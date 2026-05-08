import { exportLinksToCSV } from '@/app/functions/exportLinksToCSV'
import { unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportLinksToCSVRoute: FastifyPluginAsyncZod = async server => {
   server.get(
      '/shortlinks/exports',
      {
         schema: {
            summary: 'Export Links to CSV',
            tags: ['export-links'],
            response: {
               200: z.object({
                  reportUrl: z.string(),
               }),
            },
         },
      },
      async (_, reply) => {
         const result = await exportLinksToCSV()

         const { reportUrl } = unwrapEither(result)

         return reply.status(200).send({ reportUrl })
      }
   )
}
