// For adding custom fonts with other frameworks, see:
// https://tailwindcss.com/docs/font-family
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { LOCALE } from '@/utils';

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
      <body className='font-sans antialiased p-4'>{children}</body>
    </html>
  );
}
