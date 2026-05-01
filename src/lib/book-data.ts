import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const HOME_BOOK_LIMIT = 6;
const SHOP_BOOK_LIMIT = 6;
const CACHE_SECONDS = 300;

export const getHomeCatalog = unstable_cache(
  async () => {
    // 1. Fetch 10 categories
    const categoriesRaw = await prisma.category.findMany({
      take: 10,
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });

    // 2. For each category, fetch data needed (10 books for rows, or 1 book for icon)
    const processedCategories = await Promise.all(
      categoriesRaw.map(async (cat, index) => {
        // Fetch 10 books for the first 4 categories, otherwise just 1 for the icon
        const limit = index < 4 ? 10 : 1;
        
        const books = await prisma.book.findMany({
          where: { categoryId: cat.id },
          take: limit,
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

    return {
      // Top circles list (All 10 categories)
      categories: processedCategories.map(c => ({ id: c.id, name: c.name, image: c.image })),
      
      // Bottom rows (First 4 categories with books)
      featuredCategories: processedCategories.slice(0, 4).filter(c => c.books.length > 0),
      
      recentBooks,
      uncategorizedBooks: [],
    };
  },
  ["home-catalog-v5"],
  { revalidate: CACHE_SECONDS, tags: ["books", "categories"] }
);


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
          category: { name: category },
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
      category: book.categoryId ? { name: categoryNames.get(book.categoryId) || null } : null,
    }));

    return { books, categories, totalCount };
  },
  ["shop-catalog-v3"],
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
          category: { name: category },
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
  ["api-books-v3"],
  { revalidate: CACHE_SECONDS, tags: ["books", "categories"] }
);
