import { fastify } from "fastify"
import fastifyCors from "@fastify/cors"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import {
   serializerCompiler,
   validatorCompiler,
   hasZodFastifySchemaValidationErrors,
} from "fastify-type-provider-zod"
import { env } from "@/env"
import { createLinkRoute } from "@/infra/http/routes/createLinkRoute"
import { getLinksRoute } from "@/infra/http/routes/getLinksRoute"

const server = fastify()

server.setValidatorCompiler(validatorCompiler)

server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, { origin: '*' })

server.setErrorHandler((error, request, reply) => {
   if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
         message: "Validation Error",
         issues: error.validation,
      })
   }
   // envia error para alguma ferramenta de usabilidade,
   // por exemplo: (Sentry/Datadog/Grafana/CTel)
   console.error(error)
   return reply.status(500).send({ message: "Internal server error." })
})

server.register(fastifySwagger, {
   openapi: {
      info: {
         title: "Brev.ly server",
         version: "1.0.0"
      }
   },
})

// NOTE: launch the /docs route localhost:3333/docs
server.register(fastifySwaggerUi, {
   routePrefix: "/docs"
})

server.register(createLinkRoute)

server.register(getLinksRoute)

console.log(env.DATABASE_URL)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
   console.log("HTTP server runnning!")
})
