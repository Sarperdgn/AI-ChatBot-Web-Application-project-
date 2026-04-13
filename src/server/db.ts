import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaInit: Promise<void> | undefined;
};

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

async function initializeSqliteSchema() {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Conversation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "preview" TEXT NOT NULL DEFAULT 'Start a fresh conversation',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Message" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "role" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "conversationId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Message_conversationId_fkey"
      FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "Message"("conversationId")'
  );
}

export function ensureDatabaseReady() {
  if (!globalForPrisma.prismaSchemaInit) {
    globalForPrisma.prismaSchemaInit = initializeSqliteSchema();
  }

  return globalForPrisma.prismaSchemaInit;
}
