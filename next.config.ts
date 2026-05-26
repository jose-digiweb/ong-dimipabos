import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '/**',
			},
			// R2 public bucket URL — update once you enable public access on the bucket
			// Format: pub-<hash>.r2.dev — add the specific hostname once known
			{
				protocol: 'https',
				hostname: '*.r2.dev',
				pathname: '/**',
			},
		],
	},
}

export default nextConfig
