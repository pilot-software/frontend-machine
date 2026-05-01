import type {Metadata} from 'next'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Providers} from '@/components/providers/Providers'

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
