import { stringify } from 'csv-stringify'
import { PassThrough, Transform } from "node:stream"
import { pipeline } from "node:stream/promises"
import crypto from "node:crypto"

import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeSuccess } from '@/infra/shared/either'
import { uploadFileToStorage } from '@/infra/storage/uploadFileToStorage'

type ExportUploadsOutput = {
   reportUrl: string
}

export async function exportLinksToCSV(): Promise<Either<never, ExportUploadsOutput>> {

   const { sql, params } = db
      .select()
      .from(schema.linksTable)
      .toSQL()

   const cursor = pg.unsafe(sql, params as string[]).cursor(2)

   const csv = stringify({
      delimiter: ",",
      header: true,
      columns: [
         { key: "id", header: "id" },
         { key: "original_url", header: "original_url" },
         { key: "shortened_url", header: "shortened_url" },
         { key: "number_of_accesses", header: "number_of_accesses" },
         { key: "created_at", header: "created_at" },
      ]
   })

   const uploadToStorageStream = new PassThrough()

   const convertToCSVPipeline = pipeline(
      cursor,
      new Transform({
         objectMode: true,
         transform(chunks: unknown[], _, callback) {
            for (const chunk of chunks) {
               this.push(chunk)
            }

            callback()
         },
      }),
      csv,
      uploadToStorageStream
   )

   const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
   const random = crypto.randomBytes(4).toString("hex")
   const filename = `links-export-${timestamp}-${random}.csv`

   const uploadToStorage = uploadFileToStorage({
      contentType: "text/csv",
      folder: "downloads",
      fileName: filename,
      contentStream: uploadToStorageStream
   })

   const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

   return makeSuccess({ reportUrl: url })
}
