import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { linksTable } from "@/infra/db/schemas/links";
import { makeFailure, makeSuccess } from "@/infra/shared/either";
import { eq } from "drizzle-orm";

export async function getOriginalURL(alphanumeric: string) {
   const [link] = await db
      .select({
         originalURL: linksTable.originalURL
      })
      .from(schema.linksTable)
      .where(eq(linksTable.shortenedURL, alphanumeric))

   if (!link) return makeFailure("link_not_found");

   return makeSuccess(link); // -> { originalURL }
}
