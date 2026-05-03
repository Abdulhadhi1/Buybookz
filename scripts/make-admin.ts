import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email: npx tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log(`✅ Success! User ${user.email} is now an ADMIN.`);
  } catch (err) {
    console.error("❌ Error: User not found or database connection failed.");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
