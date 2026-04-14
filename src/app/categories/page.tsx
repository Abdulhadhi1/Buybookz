import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import CategoriesClient from "@/components/shop/CategoriesClient";

export const dynamic = "force-dynamic";

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
