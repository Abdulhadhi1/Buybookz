import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // We provide a fallback dummy URL to prevent the 'PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions' 
  // error during the build phase where environment variables might be missing.
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || "postgres://dummy:dummy@localhost:5432/dummy"
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use a lazy-loaded proxy to prevent actual connection attempts during build time
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const instance = globalThis.prismaGlobal ?? (globalThis.prismaGlobal = prismaClientSingleton());
    return (instance as any)[prop];
  }
});

export default prisma;
