import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const prismaClientSingleton = () => {
    const connectionString = (process.env.DATABASE_URL || process.env.POSTGRES_URL)?.trim();
    
    if (!connectionString) {
        if (process.env.NEXT_PHASE === "phase-production-build") {
            return {} as any;
        }
        throw new Error("DATABASE_URL is not defined in environment variables.");
    }

    try {
        // Vercel and some cloud DBs require SSL to be explicitly configured.
        const pool = new pg.Pool({ 
            connectionString,
            ssl: {
                rejectUnauthorized: false // Common for hosted RDS/Supabase/Neon cases
            },
            max: 10, // Limit connections to prevent exhaustion
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });

        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    } catch (err) {
        console.error("CRITICAL: Failed to initialize Prisma with pg adapter", err);
        throw err;
    }
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Global reference handling for both development and production
const getEffectiveInstance = () => {
    if (process.env.NODE_ENV === "production") {
        return prismaClientSingleton();
    }
    if (!globalThis.prismaGlobal) {
        globalThis.prismaGlobal = prismaClientSingleton();
    }
    return globalThis.prismaGlobal;
};

// Lazy-loaded proxy for build-time safety and runtime stability
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    // Prevent crashes during Next.js static data collection or build-time checks
    if (process.env.NEXT_PHASE === 'phase-production-build' && !process.env.DATABASE_URL) {
        return () => Promise.resolve(null);
    }
    
    // Symbol and internal Property ignore
    if (typeof prop === 'symbol' || prop === '$$typeof' || prop === 'then') return undefined;
    
    const instance = getEffectiveInstance();
    const value = (instance as any)[prop];
    
    if (typeof value === 'function') {
        return value.bind(instance);
    }
    return value;
  }
});

export default prisma;
