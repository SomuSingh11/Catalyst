/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client";

// Declare the PrismaClient instance globally to ensure only a single instance
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // In production, always create a new PrismaClient instance
  prisma = new PrismaClient();
} else {
  // In development or non-production environments, use a global instance
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

// In development, we reuse the Prisma Client by storing it globally (global.prisma), ensuring it isn't recreated on every request.
