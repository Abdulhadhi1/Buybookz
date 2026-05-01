import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const HOME_BOOK_LIMIT = 6;
const SHOP_BOOK_LIMIT = 6;
const CACHE_SECONDS = 300;

export const getHomeCatalog = unstable_cache(
  async () => {
    // 1. Fetch the 4 categories we want to show
    const categoriesRaw = await prisma.category.findMany({
      take: 4,
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });

    // 2. For each category, fetch 10 books in parallel for speed
    const categoriesWithBooks = await Promise.all(
      categoriesRaw.map(async (cat) => {
        const books = await prisma.book.findMany({
          where: { categoryId: cat.id },
          take: 10,
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
      categories: categoriesWithBooks.map(c => ({ id: c.id, name: c.name, image: c.image })),
      featuredCategories: categoriesWithBooks.filter(c => c.books.length > 0),
      recentBooks,
      uncategorizedBooks: [], // Removing this to clean up the UI as requested "view all only not explore"
    };
  },
  ["home-catalog-v3"],
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
