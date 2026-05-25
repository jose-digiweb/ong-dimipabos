import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

export type R2Image = {
  key: string | undefined
  size: number | undefined
  lastModified: Date | undefined
  url: string
}

export async function getR2Images(): Promise<R2Image[]> {
  const list = await s3.send(new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME }))

  return Promise.all(
    list.Contents?.map(async (object) => {
      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: object.Key }),
        { expiresIn: 3600 }
      )
      return { key: object.Key, size: object.Size, lastModified: object.LastModified, url }
    }) ?? []
  )
}
