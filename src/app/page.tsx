import HomeClient from "@/components/home/HomeClient";
import { getHomeCatalog } from "@/lib/book-data";

export const revalidate = 300;

export default async function Home() {
  const catalog = await getHomeCatalog();

  const serializedData = JSON.parse(JSON.stringify({
    categories: catalog.categories,
    featuredCategories: catalog.featuredCategories,
    recentBooks: catalog.recentBooks,
    uncategorizedBooks: catalog.uncategorizedBooks
  }));

  return (
    <HomeClient 
      categories={serializedData.categories}
      featuredCategories={serializedData.featuredCategories}
      recentBooks={serializedData.recentBooks}
      uncategorizedBooks={serializedData.uncategorizedBooks}
    />
  );
}
