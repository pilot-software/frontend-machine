/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    allowedDevOrigins: ['192.168.1.51'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    typescript: {
        // Dangerously allow production builds to successfully complete even if your project has type errors
        ignoreBuildErrors: false,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if your project has ESLint errors
        ignoreDuringBuilds: false,
    },
}

module.exports = nextConfig
