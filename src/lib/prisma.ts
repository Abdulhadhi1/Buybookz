import { PrismaClient } from "@prisma/client";

// This singleton ensures that Prisma is only instantiated when it's safe to do so.
// During the Next.js build phase (where DATABASE_URL is often missing), we return a dummy.
// At runtime, we return the real PrismaClient.
const getPrismaClient = () => {
  // Check if we are in the build phase or if the connection string is missing
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  const hasDbUrl = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

  if (isBuildPhase || !hasDbUrl) {
    // Return a proxy that swallows calls during build to prevent crashes
    return new Proxy({} as PrismaClient, {
      get: () => () => Promise.resolve(null),
    });
  }

  // Standard singleton logic for runtime
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  }

  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  return (global as any).prisma;
};

const prisma = getPrismaClient();

export default prisma;
