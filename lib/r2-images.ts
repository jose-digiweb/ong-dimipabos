import { getCloudflareContext } from '@opennextjs/cloudflare'

export type R2Image = {
	key: string | undefined
	size: number | undefined
	lastModified: Date | undefined
	url: string
}

export async function getR2Images(): Promise<R2Image[]> {
	const { env } = getCloudflareContext()
	const publicBaseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') ?? ''

	const list = await env.R2_BUCKET.list()

	return list.objects.map((object) => ({
		key: object.key,
		size: object.size,
		lastModified: object.uploaded,
		url: `${publicBaseUrl}/${object.key}`,
	}))
}
