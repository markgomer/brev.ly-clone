import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const linksTable = pgTable("links", {
   id: serial("id").primaryKey(),
   originalURL: text("original_url").notNull(),
   shortenedURL: text("shortened_url").notNull().unique(),
   numberOfAccesses: integer("number_of_accesses").default(0).notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
})

