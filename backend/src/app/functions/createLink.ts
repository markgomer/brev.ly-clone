import { z } from "zod";

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { makeFailure, makeSuccess } from "@/infra/shared/either";
import { ShortenedLinkAlreadyExists } from "@/app/functions/errors/ShortenedLinkAlreadyExists";

type CreateLinkInput = z.input<typeof createLinkInput>

const createLinkInput = z.object({
   originalLink: z.url(),
   shortenedLink: z.url(),
})

export async function createLink(input: CreateLinkInput) {
   const { originalLink, shortenedLink } = createLinkInput.parse(input)
   try {
      await db.insert(schema.linksTable).values({
         originalURL: originalLink,
         shortenedURL: shortenedLink,
      })

      return makeSuccess({ url: shortenedLink })
   } catch (err: any) {
      if (err?.cause?.code === "23505") {
         return makeFailure(new ShortenedLinkAlreadyExists())
      }
      throw err
   }
}

