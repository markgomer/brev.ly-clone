import z from "zod";
import { Readable } from "node:stream"

import { Upload } from "@aws-sdk/lib-storage";
import { env } from "@/env";
import { r2 } from "./client";

const params = z.object({
   folder: z.enum(["backups", "downloads"]),
   fileName: z.string(),
   contentType: z.string(),
   contentStream: z.instanceof(Readable)
})

type Params = z.input<typeof params>

export async function uploadFileToStorage(input: Params) {
   const { fileName, contentType, contentStream } = params.parse(input)

   const upload = new Upload({
      client: r2,
      params: {
         Key: fileName,
         Bucket: env.CLOUDFARE_BUCKET,
         Body: contentStream,
         ContentType: contentType
      }
   })

   await upload.done()

   return {
      key: fileName,
      url: new URL(fileName, env.CLOUDFARE_PUBLIC_URL).toString()
   }
}

