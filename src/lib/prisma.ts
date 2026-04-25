import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use a lazy-loaded proxy to prevent crashes during build time if environment variables are missing
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const instance = globalThis.prismaGlobal ?? (globalThis.prismaGlobal = prismaClientSingleton());
    return (instance as any)[prop];
  }
});

export default prisma;
