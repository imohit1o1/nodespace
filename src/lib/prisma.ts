import { PrismaClient } from "@prisma/client";

const prismaClientSinglton = () => {
    return new PrismaClient()
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// const prisma = globalForPrisma.prisma || new PrismaClient();
export const prisma = globalForPrisma.prisma ?? prismaClientSinglton();


if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

