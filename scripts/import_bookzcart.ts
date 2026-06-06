import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

// Setup database pool and adapter with SSL settings matching src/lib/prisma.ts
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ScrapedBook {
  title: string;
  author: string;
  price: number;
  mrp: number;
  image: string;
  publisher: string;
}

function detectLanguages(title: string): string[] {
  // Regex matches characters in the Tamil block of Unicode (U+0B80 to U+0BFF)
  const tamilRegex = /[\u0B80-\u0BFF]/;
  if (tamilRegex.test(title)) {
    return ["Tamil"];
  }
  return ["English"];
}

async function main() {
  const jsonPath = path.join(process.cwd(), "scratch", "scraped_books.json");
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ File not found: ${jsonPath}`);
    process.exit(1);
  }

  console.log("📖 Reading scraped books from JSON...");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const scrapedBooks: ScrapedBook[] = JSON.parse(rawData);
  console.log(`📊 Found ${scrapedBooks.length} scraped books in dataset.`);

  // 1. Extract unique categories (publishers)
  const uniquePublisherNames = Array.from(
    new Set(scrapedBooks.map((b) => b.publisher.trim()))
  );
  console.log(`📂 Found ${uniquePublisherNames.length} unique publishers in dataset.`);

  // 2. Upsert categories and save their DB IDs
  console.log("⚙️ Upserting categories (publishers) in database...");
  const categoryMap = new Map<string, string>();
  for (const name of uniquePublisherNames) {
    if (!name) continue;
    const category = await prisma.category.upsert({
      where: { name: name },
      update: {},
      create: { name: name },
    });
    categoryMap.set(name.toLowerCase(), category.id);
  }
  console.log("✅ Categories upserted successfully.");

  // 3. Load all existing books to check for duplicates
  console.log("🔍 Fetching existing books from database to check for duplicates...");
  const existingBooks = await prisma.book.findMany({
    select: {
      title: true,
      author: true,
      categoryId: true,
    },
  });

  const existingSet = new Set<string>();
  for (const book of existingBooks) {
    if (book.categoryId) {
      const key = `${book.title.trim().toLowerCase()}|${book.author.trim().toLowerCase()}|${book.categoryId}`;
      existingSet.add(key);
    }
  }
  console.log(`🔍 Found ${existingBooks.length} existing books in database.`);

  // 4. Map books for batch insert and skip duplicates
  const booksToInsert: any[] = [];
  let duplicateCount = 0;

  for (const book of scrapedBooks) {
    const catId = categoryMap.get(book.publisher.trim().toLowerCase());
    if (!catId) continue;

    const key = `${book.title.trim().toLowerCase()}|${book.author.trim().toLowerCase()}|${catId}`;
    
    // Skip if it is already in the DB, or already prepared to be inserted in this batch
    if (existingSet.has(key)) {
      duplicateCount++;
      continue;
    }

    booksToInsert.push({
      title: book.title,
      author: book.author,
      price: book.price || book.mrp || 0.0,
      description: `Buy ${book.title} by ${book.author} online at BuyBookz.`,
      image: book.image || null,
      stock: Math.floor(Math.random() * 41) + 10, // Stock range between 10 and 50
      categoryId: catId,
      languages: detectLanguages(book.title),
    });
    
    existingSet.add(key);
  }

  console.log(`📈 Filtered duplicates. Duplicate books: ${duplicateCount}. New books to insert: ${booksToInsert.length}.`);

  if (booksToInsert.length === 0) {
    console.log("ℹ️ No new books to insert. All books already exist in the database.");
    return;
  }

  // 5. Bulk insert books in chunks of 500
  console.log("🚀 Seeding new books into database...");
  const chunkSize = 500;
  for (let i = 0; i < booksToInsert.length; i += chunkSize) {
    const chunk = booksToInsert.slice(i, i + chunkSize);
    await prisma.book.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    console.log(`✅ Seeded batch ${Math.floor(i / chunkSize) + 1} (${chunk.length} books)...`);
  }

  console.log(`🎉 Seeding complete! ${booksToInsert.length} new books added to the database.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
