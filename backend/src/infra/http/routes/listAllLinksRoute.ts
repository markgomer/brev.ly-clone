import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { isSuccess, unwrapEither } from "@/infra/shared/either";
import { listAllLinks } from "@/app/functions/listAllLinks"

export const listAllLinksRoute: FastifyPluginAsyncZod = async (server) => {
   server.get(
      "/shortlinks",
      {
         schema: {
            summary: "List All Links",
            tags: ["list-all-links"],
            response: {
               200: z.array(z.object({ originalURL: z.url(), shortenedURL: z.url() })),
               400: z.object({ message: z.string() }),
            },
         },
      },
      async (_, reply) => {
         const result = await listAllLinks();

         if (isSuccess(result)) {
            const allLinksList = unwrapEither(result);

            return reply.status(200).send(allLinksList);

         } else {

            const error = unwrapEither(result);

            switch (error) {
               default:
                  return reply.status(400).send({ message: "Bad request." });
            }
         }
      }
   );
}

