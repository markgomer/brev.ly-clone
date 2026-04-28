import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { linksTable } from "@/infra/db/schemas/links";
import { makeSuccess } from "@/infra/shared/either";
import type { InferSelectModel } from "drizzle-orm";

type Link = Pick<InferSelectModel<typeof linksTable>, "originalURL" | "shortenedURL">;

export async function listAllLinks() {
   const links: Link[] = await db
      .select({
         originalURL: linksTable.originalURL,
         shortenedURL: linksTable.shortenedURL,
      })
      .from(schema.linksTable);

   return makeSuccess(links);
}
