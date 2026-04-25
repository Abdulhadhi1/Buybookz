import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log("Using URL:", connectionString ? connectionString.substring(0, 20) + "..." : "MISSING");
  
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log("Connecting to database using Prisma 7 adapter pattern...");
    const userCount = await prisma.user.count();
    console.log("Connection successful! User count:", userCount);
  } catch (error) {
    console.error("Connection failed!");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
