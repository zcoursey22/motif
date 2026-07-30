import { LucideIcon } from 'lucide-react';
import { IconType as ReactIconIcon } from 'react-icons';
import { LINK } from './sharedClasses';

type ExternalLinkProps = {
  icon: LucideIcon | ReactIconIcon;
  isMe?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function ExternalLink({
  icon: Icon,
  isMe,
  className,
  children,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      rel={`noopener noreferrer${isMe ? ' me' : ''}`}
      className={`${LINK} ${className ?? ''}`}
      {...rest}
    >
      {children}
      <Icon size={16} aria-hidden />
    </a>
  );
}
