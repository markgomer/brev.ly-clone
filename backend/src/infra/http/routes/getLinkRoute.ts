import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { getOriginalURL } from "@/app/functions/getOriginalURL";
import { isSuccess, unwrapEither } from "@/infra/shared/either";
import { incrementAccessCount } from "@/app/functions/incrementAccessCount";

export const getLinkRoute: FastifyPluginAsyncZod = async (server) => {
   server.get(
      "/shortlinks/:alphanumeric",
      {
         schema: {
            summary: "Get an Original Link",
            tags: ["get-original-link"],
            params: z.object({
               alphanumeric: z.string()
            }),
            response: {
               200: z.object({ originalURL: z.string() }),
               400: z.object({ message: z.string() }),
               404: z.object({ message: z.string() })
            },
         },
      },
      async (request, reply) => {
         const { alphanumeric } = request.params;

         const result = await getOriginalURL(alphanumeric);

         if (isSuccess(result)) {
            const { originalURL } = unwrapEither(result);

            incrementAccessCount(alphanumeric).catch(console.error);

            return reply.status(200).send({ originalURL });

         } else {

            const error = unwrapEither(result);

            switch (error) {
               case "id_not_found":
                  return reply.status(404).send({ message: "Link not found." });
               default:
                  return reply.status(400).send({ message: "Bad request." });
            }
         }
      }
   );
}
