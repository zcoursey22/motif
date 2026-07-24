import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Activity } from 'lucide-react';
import { LuGithub, LuLinkedin } from 'react-icons/lu';
import Link from 'next/link';

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col">
        <header className="flex px-4 py-2 bg-neutral-100 dark:bg-neutral-800">
          <Link href="/" className="flex gap-2 px-4 py-2">
            <Activity size={28} aria-hidden />
            <span className="text-xl">Motif</span>
          </Link>
        </header>
        <div className="flex grow flex-col bg-neutral-100 dark:bg-neutral-800">
          {children}
        </div>
        <footer className="flex border-t-2 border-neutral-300 dark:border-neutral-700 gap-8 items-center justify-center px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={'https://github.com/zcoursey22/motif'}
            className="hover:underline underline-offset-3 decoration-2 text-neutral-700 dark:text-neutral-200 p-2 inline-flex gap-2 items-center"
          >
            Source
            <LuGithub size={16} aria-hidden />
          </a>
          <span>
            Built by
            <a
              target="_blank"
              rel="noopener noreferrer me"
              href={'https://linkedin.com/in/zach-coursey'}
              className="hover:underline underline-offset-3 decoration-2 text-neutral-700 dark:text-neutral-200 p-2 inline-flex gap-2 items-center"
            >
              Zach Coursey
              <LuLinkedin size={16} aria-hidden />
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}
