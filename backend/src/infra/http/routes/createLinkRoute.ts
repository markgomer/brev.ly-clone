import { createLink } from "@/app/functions/createLink";
import { isSuccess, unwrapEither } from "@/infra/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/createlink",
    {
      schema: {
        summary: "Create a New Shortened Link",
        tags: ["create-link"],
        body: z.object({
          originalLink: z.string().url(),
          shortenedLink: z.string().min(1)
        }),
        response: {
          201: z.object({ url: z.string() }),
          400: z.object({ message: z.string() })
        }
      }
    },
    async (request, reply) => {
      const { originalLink, shortenedLink } = request.body

      if(!originalLink || !shortenedLink) {
        return reply.status(400).send({ message: "One of the links was not provided"})
      }

      const result = await createLink({ originalLink, shortenedLink })

      if (isSuccess(result)) {
        const { url } = unwrapEither(result)
        return reply.status(201).send({ url })
      }
      else {
        const error = unwrapEither(result)

        switch(error.constructor.name) {
          case "InvalidLinkFormat":
            return reply.status(400).send({ message: error.message });
          default:
            return reply.status(400).send({ message: error.message });
        }
      }
    }
  )
}

