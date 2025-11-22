import type {Metadata} from 'next'
import {Poppins} from 'next/font/google'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Providers} from '@/components/providers/Providers'

const poppins = Poppins({subsets: ['latin'], weight: ['300', '400', '500', '600', '700']})

export const metadata: Metadata = {
    title: 'Healthcare Management System',
    description: 'Comprehensive healthcare management platform',
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{locale: string}>;
}) {
    const {locale} = await params;
    const messages = await getMessages({locale});

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <Providers>
                {children}
            </Providers>
        </NextIntlClientProvider>
    );
}
