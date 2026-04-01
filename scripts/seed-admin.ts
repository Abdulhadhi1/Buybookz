import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const email = "salim123@gmail.com";
  const password = "Salim123@12";
  const name = "Admin Salim";

  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      const user = await prisma.user.update({
        where: { email },
        data: { role: "ADMIN", password: hashedPassword },
      });
      console.log(`✅ Success! Existing user ${user.email} updated to ADMIN with new password.`);
    } else {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      console.log(`✅ Success! New admin created: ${user.email}`);
    }
  } catch (err) {
    console.error("❌ Error: Failed to setup admin account.", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
