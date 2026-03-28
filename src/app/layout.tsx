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
import { Button } from '@/components/ui/button';

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
              <header className='flex h-12 items-center justify-end gap-2 p-3 sm:h-14 sm:gap-2.5'>
                <Show when='signed-out'>
                  <SignInButton mode='redirect'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='rounded-full px-3 text-xs'
                    >
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode='redirect'>
                    <Button
                      size='sm'
                      className='rounded-full px-3 text-xs'
                    >
                      Sign up
                    </Button>
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
