import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding banners...");
  
  // Clear existing banners if any
  await prisma.banner.deleteMany({});

  await prisma.banner.createMany({
    data: [
      {
        image: "/banners/banner1.png",
        title: "The Art of Literature",
      },
      {
        image: "/banners/banner2.png",
        title: "Curated Masterpieces",
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
