import { deleteLink } from "@/app/functions/deleteLink";
import { isSuccess, unwrapEither } from "@/infra/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
   server.delete(
      "/shortlinks/:alphanumeric",
      {
         schema: {
            summary: "Delete a Shortened Link",
            tags: ["delete-link"],
            params: z.object({
               alphanumeric: z.string()
            }),
            response: {
               204: z.null(),
               400: z.object({ message: z.string() }),
               404: z.object({ message: z.string() }),
            },
         },
      },
      async (request, reply) => {
         const alphanumeric = request.params.alphanumeric;

         const result = await deleteLink(alphanumeric);

         if (isSuccess(result)) {
            return reply.status(204).send(null);
         }

         const error = unwrapEither(result);

         switch (error) {
            case "id_not_found":
               return reply.status(404).send({ message: "Link not found." });
            default:
               return reply.status(400).send({ message: "Bad request." });
         }
      }
   );
};
