import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const HOME_BOOK_LIMIT = 6;
const SHOP_BOOK_LIMIT = 6;
const CACHE_SECONDS = 300;

export const getHomeCatalog = unstable_cache(
  async () => {
    const [categoriesRaw, homeBooks] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.book.findMany({
        take: HOME_BOOK_LIMIT,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          author: true,
          price: true,
          image: true,
          categoryId: true,
        },
      }),
    ]);

    const booksByCategory = homeBooks.reduce<Record<string, typeof homeBooks>>((acc, book) => {
      if (!book.categoryId) return acc;
      acc[book.categoryId] = acc[book.categoryId] || [];
      if (acc[book.categoryId].length < 8) {
        acc[book.categoryId].push(book);
      }
      return acc;
    }, {});

    const categories = categoriesRaw.map((cat) => ({
      id: cat.id,
      name: cat.name,
      image: booksByCategory[cat.id]?.[0]?.image || null,
    }));

    const featuredCategories = categoriesRaw
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        books: booksByCategory[cat.id] || [],
      }))
      .filter((cat) => cat.books.length > 0);

    return {
      categories,
      featuredCategories,
      recentBooks: homeBooks.slice(0, 12),
      uncategorizedBooks: homeBooks.filter((book) => !book.categoryId).slice(0, 8),
    };
  },
  ["home-catalog-v2"],
  { revalidate: CACHE_SECONDS, tags: ["books", "categories"] }
);

export const getShopCatalog = unstable_cache(
  async (query = "", category = "") => {
    const where = {
      AND: [
        query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
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
            { title: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
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
