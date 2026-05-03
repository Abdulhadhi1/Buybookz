import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const HOME_BOOK_LIMIT = 6;
const SHOP_BOOK_LIMIT = 6;
const CACHE_SECONDS = 300;

export const getHomeCatalog = async () => {
  // Parallelize the initial fetches
  const [categoriesWithBooks, recentBooks, allCategories] = await Promise.all([
    prisma.category.findMany({
      where: { books: { some: {} } },
      take: 10,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        books: {
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
        }
      }
    }),
    prisma.book.findMany({
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
    }),
    prisma.category.findMany({
      take: 15,
      select: { id: true, name: true }
    })
  ]);

  // Process featured categories (first 4 with books)
  const featuredCategories = categoriesWithBooks.slice(0, 4).map(cat => ({
    ...cat,
    image: cat.books[0]?.image || null
  }));

  // Process top circles (ensure 10 items)
  let topCategories = categoriesWithBooks.map(c => ({ 
    id: c.id, 
    name: c.name, 
    image: c.books[0]?.image || null 
  }));

  if (topCategories.length < 10) {
    const existingIds = new Set(topCategories.map(c => c.id));
    const extra = allCategories
      .filter(c => !existingIds.has(c.id))
      .slice(0, 10 - topCategories.length)
      .map(c => ({ id: c.id, name: c.name, image: null }));
    topCategories = [...topCategories, ...extra];
  }

  return {
    categories: topCategories.slice(0, 10),
    featuredCategories,
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
  async (query = "", category = "", limit = 24, skip = 0, sort = "relevance", inStock = false) => {
    const where: any = {
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
        inStock ? { stock: { gt: 0 } } : {},
      ],
    };

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-low-high") orderBy = { price: "asc" };
    else if (sort === "price-high-low") orderBy = { price: "desc" };

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
            orderBy,
            skip,
            take: limit,
          }),
          prisma.book.count({ where })
    ]);

    return { books, totalCount };
  },
  ["api-books-v6"],
  { revalidate: CACHE_SECONDS, tags: ["books", "categories"] }
);
