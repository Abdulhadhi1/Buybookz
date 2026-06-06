import sys
import re
import os
import json
import time
import requests
from bs4 import BeautifulSoup
import concurrent.futures
from threading import Lock

# Configure console stdout to output UTF-8 (vital for Tamil text printing)
sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Thread locks for safe output operations
print_lock = Lock()
books_lock = Lock()

all_scraped_books = []
publishers_done = 0

def clean_publisher_name(raw_name):
    # Splits by newline and takes the first non-empty line
    lines = [line.strip() for line in raw_name.split('\n') if line.strip()]
    if not lines:
        return "Unknown"
    # Remove any trailing book counts e.g. "169 books" or "1 book"
    name = lines[0]
    name = re.sub(r'\s*\d+\s*books?.*$', '', name, flags=re.IGNORECASE)
    return name.strip()

def fetch_publishers():
    url = "https://bookzcart.in/publishers/"
    with print_lock:
        print(f"[INIT] Fetching publishers list from: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=20)
        if response.status_code != 200:
            with print_lock:
                print(f"[ERROR] Failed to fetch publishers, status code: {response.status_code}")
            return []
            
        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.find_all('a', href=True)
        publishers = []
        seen_slugs = set()
        
        for link in links:
            href = link['href']
            if '/publisher/' in href:
                slug_match = re.search(r'/publisher/([^/]+)/?', href)
                if slug_match:
                    slug = slug_match.group(1)
                    if slug not in seen_slugs:
                        seen_slugs.add(slug)
                        raw_name = link.text
                        clean_name = clean_publisher_name(raw_name)
                        publishers.append({
                            'name': clean_name,
                            'slug': slug,
                            'url': href
                        })
                        
        with print_lock:
            print(f"[INIT] Successfully found {len(publishers)} unique publishers.")
        return publishers
    except Exception as e:
        with print_lock:
            print(f"[ERROR] Exception fetching publishers: {e}")
        return []

def scrape_publisher_books(publisher):
    slug = publisher['slug']
    name = publisher['name']
    
    publisher_books = []
    page = 1
    max_books = 500
    
    with print_lock:
        print(f"[START] Scraping books for publisher: '{name}' ({slug})")
        
    while len(publisher_books) < max_books:
        # Construct paginated URL
        if page == 1:
            url = f"https://bookzcart.in/publisher/{slug}/"
        else:
            url = f"https://bookzcart.in/publisher/{slug}/page/{page}/"
            
        retry_count = 3
        success = False
        response_text = ""
        status_code = 0
        
        for attempt in range(retry_count):
            try:
                response = requests.get(url, headers=headers, timeout=20)
                status_code = response.status_code
                if response.status_code == 200:
                    response_text = response.text
                    success = True
                    break
                elif response.status_code == 404:
                    # Normal end of pagination
                    break
                else:
                    time.sleep(2 * (attempt + 1))
            except Exception as e:
                time.sleep(2 * (attempt + 1))
                
        if not success:
            if status_code == 404:
                # Reached last page
                break
            else:
                with print_lock:
                    print(f"[WARN] Failed to load {url} (status: {status_code}). Stopping pagination for '{name}'.")
                break
                
        soup = BeautifulSoup(response_text, 'html.parser')
        cards = soup.find_all('article', class_='book-card')
        
        if not cards:
            break
            
        page_books_count = 0
        for card in cards:
            if len(publisher_books) >= max_books:
                break
                
            # Extract Title
            title_el = card.find('h3', class_='book-title')
            title = ""
            if title_el:
                title = title_el.text.strip()
                
            if not title:
                continue
                
            # Extract Author
            author_el = card.find('p', class_='book-author-name')
            author = author_el.text.strip() if author_el else "Unknown"
            if not author:
                author = "Unknown"
                
            # Extract Image URL
            zoom_btn = card.find('button', class_='book-zoom-btn')
            image_url = ""
            if zoom_btn and zoom_btn.get('data-lightbox-src'):
                image_url = zoom_btn.get('data-lightbox-src')
            else:
                img_el = card.find('img', class_='product-thumbnail')
                if img_el:
                    image_url = img_el.get('src') or img_el.get('data-src') or ""
            
            # Extract Prices
            price_row = card.find('div', class_='book-price-row')
            price = 0.0
            mrp = 0.0
            if price_row:
                price_el = price_row.find(class_='book-price')
                if price_el:
                    try:
                        price = float(re.sub(r'[^\d.]', '', price_el.text))
                    except ValueError:
                        pass
                
                mrp_el = price_row.find(class_='book-old-price')
                if mrp_el:
                    try:
                        mrp = float(re.sub(r'[^\d.]', '', mrp_el.text))
                    except ValueError:
                        pass
                
                if not mrp and price:
                    mrp = price
                elif mrp and not price:
                    price = mrp
            
            # Add to local list
            publisher_books.append({
                'title': title,
                'author': author,
                'price': price,
                'mrp': mrp,
                'image': image_url,
                'publisher': name
            })
            page_books_count += 1
            
        with print_lock:
            print(f"[{name}] Page {page}: Gathered {page_books_count} books. (Total for publisher: {len(publisher_books)}/{max_books})")
            
        if page_books_count == 0:
            break
            
        page += 1
        # Quick rate limiting delay
        time.sleep(0.5)
        
    with print_lock:
        print(f"[COMPLETE] Finished '{name}': Scraped {len(publisher_books)} books.")
        
    return publisher_books

def main():
    global publishers_done
    start_time = time.time()
    
    # Ensure scratch directory exists
    os.makedirs("scratch", exist_ok=True)
    
    publishers = fetch_publishers()
    if not publishers:
        print("[ERROR] No publishers found to scrape. Exiting.")
        return
        
    print(f"[START] Beginning multi-threaded scrape of {len(publishers)} publishers...")
    
    # Run scraping using ThreadPoolExecutor for concurrency
    # Since it's mostly network-bound I/O, we can use 8 concurrent workers safely.
    max_workers = 8
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_pub = {executor.submit(scrape_publisher_books, pub): pub for pub in publishers}
        for future in concurrent.futures.as_completed(future_to_pub):
            pub = future_to_pub[future]
            try:
                pub_books = future.result()
                with books_lock:
                    all_scraped_books.extend(pub_books)
                    publishers_done += 1
                    print(f"[PROGRESS] {publishers_done}/{len(publishers)} publishers scraped. Total books: {len(all_scraped_books)}")
            except Exception as exc:
                print(f"[ERROR] Publisher '{pub['name']}' generated an exception: {exc}")
                
    duration = time.time() - start_time
    print(f"\n[DONE] Scraping complete in {duration:.2f} seconds!")
    print(f"Total books gathered: {len(all_scraped_books)}")
    
    # Save to JSON in scratch folder
    output_path = "scratch/scraped_books.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_scraped_books, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully saved all scraped records to: {output_path}")

if __name__ == "__main__":
    main()
