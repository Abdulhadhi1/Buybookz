import { Suspense } from "react";
import ShopClient from "@/components/shop/ShopClient";
import ShopSkeleton from "@/components/shop/ShopSkeleton";
import { getShopCatalog } from "@/lib/book-data";

export const revalidate = 300;

export default async function ShopPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ category?: string, query?: string }> 
}) {
    const params = await searchParams;
    const query = params.query?.trim() || "";
    const category = params.category?.trim() || "";
    const sort = (params as any).sort || "relevance";
    const inStock = (params as any).inStock === "true";
    const { books, categories, totalCount } = await getShopCatalog(query, category, sort, inStock);

    const serializedBooks = JSON.parse(JSON.stringify(books));
    const serializedCategories = JSON.parse(JSON.stringify(categories));

    return (
        <Suspense fallback={<ShopSkeleton />}>
            <ShopClient 
                initialBooks={serializedBooks} 
                initialCategories={serializedCategories} 
                totalCount={totalCount}
            />
        </Suspense>
    );
}
