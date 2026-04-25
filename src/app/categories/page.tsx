import prisma from "@/lib/prisma";
import CategoriesClient from "@/components/shop/CategoriesClient";

export const revalidate = 300;

export default async function CategoriesPage() {
    // Fetch real publishers (categories) from the DB
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { books: true }
            }
        },
        orderBy: { name: "asc" }
    });

    const serializedCategories = JSON.parse(JSON.stringify(categories));

    return <CategoriesClient initialCategories={serializedCategories} />;
}
