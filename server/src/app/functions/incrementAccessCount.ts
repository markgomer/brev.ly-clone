import { db } from "@/infra/db";
import { linksTable } from "@/infra/db/schemas/links";
import { eq, sql } from "drizzle-orm";

export async function incrementAccessCount(alphanumeric: string) {
   await db
      .update(linksTable)
      .set({ numberOfAccesses: sql`${linksTable.numberOfAccesses} + 1` })
      .where(eq(linksTable.shortenedURL, alphanumeric))
}
