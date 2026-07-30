import { Link } from '../components/ui/Link';

const links = [{ href: '/sessions', label: 'Sessions' }];

export function Nav() {
  return (
    <nav className="flex gap-4">
      {links.map(({ href, label }) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
