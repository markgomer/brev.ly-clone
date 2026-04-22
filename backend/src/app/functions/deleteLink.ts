import { eq } from "drizzle-orm";

import { db } from "@/infra/db";
import { makeFailure, makeSuccess, type Either } from "@/infra/shared/either";
import { linksTable } from "@/infra/db/schemas/links";

export async function deleteLink(id: number) :
   Promise<Either<"id_not_found", typeof linksTable.$inferSelect>> {

   const [deleted] = await db
      .delete(linksTable)
      .where(eq(linksTable.id, id))
      .returning();

   if (!deleted) return makeFailure("id_not_found");
   return makeSuccess(deleted);
}
