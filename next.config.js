const withNextIntl = require('next-intl/plugin')({
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'hi', 'gu', 'mr', 'bn', 'ta', 'te', 'kn']
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
}

module.exports = withNextIntl(nextConfig)
