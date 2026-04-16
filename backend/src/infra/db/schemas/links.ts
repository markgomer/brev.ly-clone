import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const link = pgTable("links", {
  id: serial("id").primaryKey(),
  originalURL: text("originalURL").notNull(),
  shortenedURL: text("shortenedURL").notNull().unique(),
  numberOfAccesses: integer("numberOfAccesses").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

