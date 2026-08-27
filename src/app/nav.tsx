'use client';

import { usePathname } from 'next/navigation';
import { Link } from '../components/ui/Link';
import NewSessionButton from '@/components/NewSessionButton';

const links = [
  { href: '/sessions', label: 'Sessions' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      {pathname !== '/' && <NewSessionButton />}
      {links.map(({ href, label }) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
