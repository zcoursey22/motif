import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Activity } from 'lucide-react';
import { LuGithub, LuLinkedin } from 'react-icons/lu';
import NextLink from 'next/link';
import { Providers } from './providers';
import { Nav } from './nav';
import { ExternalLink } from '../components/ui/ExternalLink';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Motif',
  description:
    'Musical practice diary that converts freeform reflection to structured quantitative data. Built by Zach Coursey.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="h-full flex flex-col min-h-screen">
        <Providers>
          <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-2 bg-neutral-200 dark:bg-neutral-800 shadow-lg shadow-neutral-200/100 dark:shadow-neutral-800/100">
            <NextLink href="/" className="flex gap-2 p-2">
              <Activity
                size={28}
                aria-hidden
                className="text-indigo-500 dark:text-indigo-400"
              />
              <span className="text-xl text-indigo-900 dark:text-indigo-100">
                Motif
              </span>
            </NextLink>
            <Nav />
          </header>
          <div className="flex grow flex-col items-center bg-neutral-200 dark:bg-neutral-800 px-8 pt-4 pb-8">
            {children}
          </div>
          <footer className="flex border-t-2 border-neutral-300 dark:border-neutral-700 gap-8 items-center justify-center px-8 py-2 text-sm text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800">
            <ExternalLink
              icon={LuGithub}
              href="https://github.com/zcoursey22/motif"
            >
              Source
            </ExternalLink>
            <span>
              Built by
              <ExternalLink
                isMe
                icon={LuLinkedin}
                href="https://linkedin.com/in/zach-coursey"
              >
                Zach Coursey
              </ExternalLink>
            </span>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
