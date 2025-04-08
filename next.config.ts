import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: ['192.168.1.21', '192.168.1.46'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'utfs.io',
				port: '',
			},
		],
	},
}

export default nextConfig
