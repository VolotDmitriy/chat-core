import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
    title: 'ChatCore',
    description: 'Real-time team chat',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${GeistSans.variable} ${GeistMono.variable} dark h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                {children}
                <Toaster position="top-center" />
            </body>
        </html>
    );
}
