import type {Metadata} from 'next'
import {Manrope} from 'next/font/google'
import './globals.css'
import {Providers} from '@/components/Providers'

const manrope = Manrope({subsets: ['latin']})

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
        <body className={manrope.className} suppressHydrationWarning={true}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
