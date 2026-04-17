import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Seeding sample books to Supabase...");

  // Create Categories
  const fiction = await prisma.category.upsert({
    where: { name: "Fiction" },
    update: {},
    create: { name: "Fiction" },
  });

  const business = await prisma.category.upsert({
    where: { name: "Business & Finance" },
    update: {},
    create: { name: "Business & Finance" },
  });

  const books = [
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 599,
      description: "Between life and death there is a library...",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190203i/52578297.jpg",
      stock: 15,
      categoryId: fiction.id,
      languages: ["English", "Tamil"]
    },
    {
      title: "Think and Grow Rich",
      author: "Napoleon Hill",
      price: 350,
      description: "The landmark bestseller that has helped millions...",
      image: "https://images-na.ssl-images-amazon.com/images/I/71Ad9E6Vf0L.jpg",
      stock: 50,
      categoryId: business.id,
      languages: ["English"]
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      price: 499,
      description: "An easy and proven way to build good habits...",
      image: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
      stock: 25,
      categoryId: business.id,
      languages: ["English"]
    },
    {
      title: "Ponniyin Selvan",
      author: "Kalki",
      price: 1200,
      description: "The historical masterpiece of Tamizh literature.",
      image: "https://m.media-amazon.com/images/I/910i8fXy52L.jpg",
      stock: 10,
      categoryId: fiction.id,
      languages: ["Tamil"]
    }
  ];

  for (const book of books) {
    await prisma.book.create({
      data: book
    });
  }

  console.log("✅ Seeding complete! 5 books added.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
