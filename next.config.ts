import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'dimipabos.199b6cc24673b9eeccbff632eefdafd7.r2.cloudflarestorage.com',
				pathname: '/**',
			},
		],
	},
}

export default nextConfig
