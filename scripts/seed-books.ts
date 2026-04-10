import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables");
  }
  
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const bookData = [
    {
      title: "The Silent Forest",
      author: "Elena Rossi",
      price: 599,
      description: "A gripping thriller that takes you deep into the heart of a mysterious forest where secrets are buried and the silence is deafening.",
      categoryName: "Mystery",
      stock: 50,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
      languages: ["English", "Tamil"]
    },
    {
      title: "Neon Dreams",
      author: "Marcus Vane",
      price: 749,
      description: "A cyberpunk odyssey through a sprawling metropolis where technology and humanity collide in a dance of neon and shadows.",
      categoryName: "Sci-Fi",
      stock: 30,
      image: "https://images.unsplash.com/photo-1543004218-ee141104308e?q=80&w=800&auto=format&fit=crop",
      languages: ["English", "Hindi"]
    },
    {
      title: "Culinary Alchemy",
      author: "Chef Isabella",
      price: 1250,
      description: "Master the art of high-end gastronomy with secrets from one of the world's most innovative kitchens.",
      categoryName: "Lifestyle",
      stock: 20,
      image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop",
      languages: ["English", "French"]
    },
    {
      title: "Whispers of History",
      author: "Prof. Julian Thorne",
      price: 899,
      description: "An evocative journey through the forgotten corridors of history, revealing the stories that shaped our civilization.",
      categoryName: "History",
      stock: 40,
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop",
      languages: ["English", "Tamil"]
    },
    {
      title: "Modern Minimalist",
      author: "Sarah Jenkins",
      price: 499,
      description: "A guide to decluttering your life and finding peace in simplicity within a chaotic modern world.",
      categoryName: "Self-Help",
      stock: 100,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
      languages: ["English"]
    }
  ];

  console.log("Seeding started...");

  try {
    // 1. Sync Categories
    const categoryNames = Array.from(new Set(bookData.map(b => b.categoryName)));
    const categories: Record<string, string> = {};

    for (const name of categoryNames) {
        const cat = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name }
        });
        categories[name] = cat.id;
    }

    console.log("✅ Categories synchronized.");

    // 2. Clear existing books (optional, but good for clean seeding)
    // await prisma.book.deleteMany();

    // 3. Create Books
    for (const book of bookData) {
      await prisma.book.create({
        data: {
            title: book.title,
            author: book.author,
            price: book.price,
            description: book.description,
            stock: book.stock,
            image: book.image,
            languages: book.languages,
            categoryId: categories[book.categoryName]
        }
      });
    }
    console.log("✅ Books seeded successfully!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
