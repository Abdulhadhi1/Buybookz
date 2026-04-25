import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!connectionString) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
        return {} as any;
    }
    throw new Error("DATABASE_URL is not defined");
  }

  // Use the new Prisma 7 adapter pattern
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Lazy-loaded proxy for stability
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    // Basic properties that might be accessed during build/checking
    if (prop === '$$typeof' || prop === 'constructor' || prop === 'then') return undefined;
    
    // During Next.js build phase without DB, return dummy
    if (process.env.NEXT_PHASE === 'phase-production-build' && !process.env.DATABASE_URL) {
      return () => Promise.resolve(null);
    }
    
    const instance = globalThis.prismaGlobal ?? (globalThis.prismaGlobal = prismaClientSingleton());
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

export default prisma;
