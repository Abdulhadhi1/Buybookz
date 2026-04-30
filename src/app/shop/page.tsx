import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ShopClient from "@/components/shop/ShopClient";
import ShopSkeleton from "@/components/shop/ShopSkeleton";

// Optimized caching to make page transitions instant
export const revalidate = 60; 

export default async function ShopPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ category?: string, query?: string }> 
}) {
    const params = await searchParams;
    const category = params.category;
    const query = params.query;

    // Fetch initial data on the server with filtering
    const [books, categories] = await Promise.all([
        prisma.book.findMany({
            where: {
                AND: [
                    category && category !== "All" ? {
                        category: { name: category }
                    } : {},
                    query ? {
                        OR: [
                            { title: { contains: query, mode: "insensitive" } },
                            { author: { contains: query, mode: "insensitive" } }
                        ]
                    } : {}
                ]
            },
            take: 100, // Show up to 100 relevant books
            select: {
                id: true,
                title: true,
                author: true,
                price: true,
                image: true,
                stock: true,
                categoryId: true,
                category: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.category.findMany({
            select: { id: true, name: true }
        })
    ]);

    // Serialize data
    const serializedBooks = JSON.parse(JSON.stringify(books));
    const serializedCategories = JSON.parse(JSON.stringify(categories));

    return (
        <Suspense fallback={<ShopSkeleton />}>
            <ShopClient 
                initialBooks={serializedBooks} 
                initialCategories={serializedCategories} 
            />
        </Suspense>
    );
}
