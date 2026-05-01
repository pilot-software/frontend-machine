import './globals.css'
import {Poppins} from 'next/font/google'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-poppins',
    display: 'swap',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className={poppins.variable}>
            <body className={poppins.className} suppressHydrationWarning>{children}</body>
        </html>
    );
}
