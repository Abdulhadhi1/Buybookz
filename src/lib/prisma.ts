import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Lazy-loading helper to avoid connecting during build time
const getPrisma = () => {
    // During Next.js build phase, we return a dummy object to prevent connection failures.
    // In production/development runtime, we return the real singleton.
    if (process.env.NEXT_PHASE === 'phase-production-build' && !process.env.DATABASE_URL) {
        return {} as any;
    }
    
    if (process.env.NODE_ENV === "production") {
        return prismaClientSingleton();
    }
    
    return globalThis.prismaGlobal ?? (globalThis.prismaGlobal = prismaClientSingleton());
};

// Use a Proxy to ensure Prisma is only instantiated when actually called.
// This prevents "Failed to collect page data" errors during build.
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const instance = getPrisma();
    const value = (instance as any)[prop];
    
    // Crucial: Bind functions to the instance so they have the correct 'this' context.
    // This fixes the 500 errors caused by the previous Proxy implementation.
    if (typeof value === 'function') {
        return value.bind(instance);
    }
    return value;
  }
});

export default prisma;
