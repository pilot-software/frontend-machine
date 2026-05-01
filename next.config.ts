import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'hi', 'gu', 'mr', 'bn', 'ta', 'te', 'kn'],
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
