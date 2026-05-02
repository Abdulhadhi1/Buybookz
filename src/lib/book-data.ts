import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const HOME_BOOK_LIMIT = 6;
const SHOP_BOOK_LIMIT = 6;
const CACHE_SECONDS = 300;

export const getHomeCatalog = async () => {
  // 1. Fetch categories that actually HAVE books first to ensure we have rows to show
  const categoriesWithAtLeastOneBook = await prisma.category.findMany({
    where: {
      books: {
        some: {}
      }
    },
    take: 10, // We take 10 to fill the top list
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  // 2. For these 10 categories, fetch up to 10 books each
  const processedCategories = await Promise.all(
    categoriesWithAtLeastOneBook.map(async (cat, index) => {
      // We only need 10 books for the first 4 categories (to show in rows)
      // For the others, we just need 1 to show as an icon in the top circles
      const take = index < 4 ? 10 : 1;
      
      const books = await prisma.book.findMany({
        where: { categoryId: cat.id },
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          author: true,
          price: true,
          image: true,
          categoryId: true,
        },
      });

      return {
        ...cat,
        books,
        image: books[0]?.image || null,
      };
    })
  );

  // 3. Fetch 12 recent books for the "Best Selling" section
  const recentBooks = await prisma.book.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      author: true,
      price: true,
      image: true,
      categoryId: true,
    },
  });

  // 4. If we don't have enough categories with books, fetch some empty ones for the top list
  let topCategories = processedCategories.map(c => ({ id: c.id, name: c.name, image: c.image }));
  if (topCategories.length < 10) {
      const remainingCount = 10 - topCategories.length;
      const extraCategories = await prisma.category.findMany({
          where: {
              id: { notIn: topCategories.map(c => c.id) }
          },
          take: remainingCount,
          select: { id: true, name: true }
      });
      topCategories = [...topCategories, ...extraCategories.map(c => ({ id: c.id, name: c.name, image: null }))];
  }

  return {
    // Top circles list (Always 10 items)
    categories: topCategories,
    
    // Bottom rows (The first 4 categories that have books)
    featuredCategories: processedCategories.slice(0, 4).filter(c => c.books.length > 0),
    
    recentBooks,
    uncategorizedBooks: [],
  };
};


export const getShopCatalog = unstable_cache(
  async (query = "", category = "") => {
    const where = {
      AND: [
        query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { author: { contains: query, mode: "insensitive" as const } },
          ],
        } : {},
        category && category !== "All" ? {
          category: { name: { contains: category, mode: "insensitive" as const } },
        } : {},
      ],
    };

    const [booksRaw, categories, totalCount] = await Promise.all([
      prisma.book.findMany({
        where,
        take: SHOP_BOOK_LIMIT,
        select: {
          id: true,
          title: true,
          author: true,
          price: true,
          image: true,
          stock: true,
          categoryId: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        select: { id: true, name: true },
      }),
      prisma.book.count({ where }),
    ]);

    const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
    const books = booksRaw.map((book) => ({
      ...book,
      category: book.categoryId ? { name: categoryNames.get(book.categoryId)?.trim() || null } : null,
    }));

    return { books, categories, totalCount };
  },
  ["shop-catalog-v5"],
  { revalidate: CACHE_SECONDS, tags: ["books", "categories"] }
);

export const getApiBooks = unstable_cache(
  async (query = "", category = "", limit = 24, skip = 0) => {
    const where = {
      AND: [
        query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { author: { contains: query, mode: "insensitive" as const } },
          ],
        } : {},
        category && category !== "All" ? {
          category: { name: { contains: category, mode: "insensitive" as const } },
        } : {},
      ],
    };

    const [books, totalCount] = await Promise.all([
        prisma.book.findMany({
            where,
            select: {
              id: true,
              title: true,
              author: true,
              price: true,
              image: true,
              stock: true,
              categoryId: true,
              category: {
                select: { name: true },
              },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
          }),
          prisma.book.count({ where })
    ]);

    return { books, totalCount };
  },
  ["api-books-v5"],
  { revalidate: CACHE_SECONDS, tags: ["books", "categories"] }
);
