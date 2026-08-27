'use client';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { LINK } from './sharedClasses';

type LinkProps = NextLinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> & {
    children: React.ReactNode;
  };

export function Link({ className, children, href, ...rest }: LinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NextLink
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`${LINK}
        ${
          isActive
            ? 'text-indigo-700 dark:text-white underline'
            : 'text-indigo-900 dark:text-indigo-200 hover:text-indigo-800 hover:dark:text-indigo-100'
        }
        ${className ?? ''}
      `}
      {...rest}
    >
      {children}
    </NextLink>
  );
}
