import { LucideIcon } from 'lucide-react';
import NextLink from 'next/link';
import { ActionColor } from './constants';

const ButtonVariant = {
  SOLID: 'solid',
  GHOST: 'ghost',
} as const;
type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

const SOLID_CLASSNAMES: Record<ActionColor, string> = {
  primary: `bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400`,
  secondary: `bg-neutral-400 hover:bg-neutral-500 dark:bg-neutral-500 dark:hover:bg-neutral-400`,
  success: ` bg-green-400 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400`,
  warn: `bg-amber-400 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400`,
  error: `bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400`,
  brand: `bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400`,
};

const GHOST_CLASSNAMES: Record<ActionColor, string> = {
  primary: `text-blue-500 dark:text-blue-400
    hover:bg-blue-500 dark:hover:bg-blue-400`,
  secondary: `text-neutral-700 dark:text-neutral-200
    hover:bg-neutral-400 dark:hover:bg-neutral-500`,
  success: `text-green-500 dark:text-green-400
    hover:bg-green-500 dark:hover:bg-green-400`,
  warn: `text-amber-500 dark:text-amber-400
    hover:bg-amber-500 dark:hover:bg-amber-400`,
  error: `text-red-500 dark:text-red-400
    hover:bg-red-500 dark:hover:bg-red-400`,
  brand: `text-indigo-500 dark:text-indigo-400
    hover:bg-indigo-500 dark:hover:bg-indigo-400`,
};

const ICON_SIZE = 18;
const ICON_STROKE = 2.5;

type ButtonProps = {
  variant?: ButtonVariant;
  color?: ActionColor;
  icon?: LucideIcon;
  href?: string;
  iconClassName?: string;
  isBusyUnstyled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function BaseButton({
  variant = 'solid',
  color = 'secondary',
  icon: Icon,
  href,
  className,
  children,
  iconClassName,
  isBusyUnstyled,
  ...rest
}: ButtonProps) {
  const classes = `min-h-[40px] font-medium inline-flex justify-center items-center gap-2 rounded-xl cursor-pointer aria-disabled:cursor-default disabled:cursor-default pointer-events-auto aria-disabled:pointer-events-none
  ${isBusyUnstyled ? '' : 'aria-disabled:field-busy'}
    ${
      variant === 'solid'
        ? `text-white ${SOLID_CLASSNAMES[color]}`
        : `hover:text-white ${GHOST_CLASSNAMES[color]}`
    }
    ${className ?? ''}`;

  const content = (
    <>
      {Icon && (
        <Icon
          size={ICON_SIZE}
          strokeWidth={ICON_STROKE}
          className={iconClassName}
          aria-hidden
        />
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <NextLink href={href} className={classes}>
        {content}
      </NextLink>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}

export function Button({ className, ...rest }: ButtonProps) {
  return <BaseButton className={`px-4 py-2 ${className ?? ''}`} {...rest} />;
}

export function IconButton({ className, ...rest }: ButtonProps) {
  return (
    <BaseButton className={`p-2 min-w-[40px] ${className ?? ''}`} {...rest} />
  );
}
