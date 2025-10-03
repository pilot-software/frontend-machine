import type {Metadata} from 'next'
import {Poppins} from 'next/font/google'
import './globals.css'
import {Providers} from '@/components/Providers'

const poppins = Poppins({subsets: ['latin'], weight: ['300', '400', '500', '600', '700']})

export const metadata: Metadata = {
    title: 'Healthcare Management System',
    description: 'Comprehensive healthcare management platform',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={poppins.className} suppressHydrationWarning={true}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
