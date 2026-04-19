import { z } from "zod";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { makeSuccess } from "@/infra/shared/either";

type CreateLinkInput = z.input<typeof createLinkInput>

const createLinkInput = z.object({
   originalLink: z.url(),
   shortenedLink: z.url(),
})

export async function createLink(input: CreateLinkInput) {
   const { originalLink, shortenedLink } = createLinkInput.parse(input)

   await db.insert(schema.linksTable).values({
      originalURL: originalLink,
      shortenedURL: shortenedLink,
   })

   return makeSuccess({ url: shortenedLink })
}

