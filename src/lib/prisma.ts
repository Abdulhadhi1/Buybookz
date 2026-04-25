import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // Use standard initialization. The Proxy below will prevent this from being
  // called during the build process if environment variables are missing.
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use a lazy-loaded proxy to prevent actual connection attempts or construction
// crashes during build time when nothing should be accessing the database.
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    // If we're in the build phase and something (like a check) touches prisma,
    // we return a dummy to prevent crashes.
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return () => Promise.resolve(null);
    }
    
    const instance = globalThis.prismaGlobal ?? (globalThis.prismaGlobal = prismaClientSingleton());
    return (instance as any)[prop];
  }
});

export default prisma;
