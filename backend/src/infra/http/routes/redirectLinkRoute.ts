import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getOriginalURL } from "@/app/functions/getOriginalURL";
import { incrementAccessCount } from "@/app/functions/incrementAccessCount";
import { isSuccess, unwrapEither } from "@/infra/shared/either";
import z from "zod";

export const redirectLinkRoute: FastifyPluginAsyncZod = async (server) => {
   server.get(
      "/:slug",
      {
         schema: {
            summary: "Redirect Route",
            tags: ["redirect"],
            params: z.object({
               slug: z.string()
            }),
            response: {
               200: z.object({ originalURL: z.string() }),
               400: z.object({ message: z.string() }),
               404: z.object({ message: z.string() })
            },
         },
      },
      async (request, reply) => {
         const { slug } = request.params as { slug: string };

         const result = await getOriginalURL(slug);

         if (isSuccess(result)) {
            await incrementAccessCount(slug);
            const { originalURL } = unwrapEither(result);
            return reply.redirect(originalURL, 302);
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
