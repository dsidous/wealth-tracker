import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { LOCALE } from '@/utils';
import { Suspense } from 'react';
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

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
            <ClerkProvider>
              <header className='flex justify-end items-center p-4 gap-4 h-16'>
                <Show when='signed-out'>
                  <SignInButton />
                  <SignUpButton>
                    <button className='bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer'>
                      Sign Up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when='signed-in'>
                  <UserButton />
                </Show>
              </header>
              {children}
            </ClerkProvider>
          </div>
        </Suspense>
      </body>
    </html>
  );
}
