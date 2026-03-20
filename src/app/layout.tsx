import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { LOCALE } from '@/utils';
import { Suspense } from 'react';

const fontSans = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Wealth Tracker',
  description: 'Wealth Tracker by dsidous',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={LOCALE} className={fontSans.variable}>
      <body className='font-sans antialiased p-4'>
        <Suspense fallback={<div>Loading...</div>}>
          <div className='flex flex-col gap-4 max-w-7xl mx-auto'>
            {children}
          </div>
        </Suspense>
      </body>
    </html>
  );
}
