import prisma from "@/lib/prisma";
import ShopClient from "@/components/shop/ShopClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 300;


export default async function ShopPage() {
    // Fetch initial data on the server for the fastest response
    const [books, categories] = await Promise.all([
        prisma.book.findMany({
            select: {
                id: true,
                title: true,
                author: true,
                price: true,
                image: true,
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-accent" size={48} /></div>}>
            <ShopClient initialBooks={serializedBooks} initialCategories={serializedCategories} />
        </Suspense>
    );
}
