import { LucideIcon } from 'lucide-react';

const ButtonVariant = {
  SOLID: 'solid',
  GHOST: 'ghost',
} as const;
type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

const ButtonColor = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warn',
  DELETE: 'error',
  BRAND: 'brand',
} as const;
type ButtonColor = (typeof ButtonColor)[keyof typeof ButtonColor];

const SOLID_CLASSNAMES: Record<ButtonColor, string> = {
  primary: `bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400`,
  secondary: `bg-neutral-400 hover:bg-neutral-500 dark:bg-neutral-500 dark:hover:bg-neutral-400`,
  success: ` bg-green-400 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400`,
  warn: `bg-amber-400 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400`,
  error: `bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400`,
  brand: `bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400`,
};

const GHOST_CLASSNAMES: Record<ButtonColor, string> = {
  primary: `text-blue-500 dark:text-blue-400
    hover:bg-blue-500 dark:hover:bg-blue-400`,
  secondary: `
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
const ICON_STROKE = 2;

type ButtonProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  icon?: LucideIcon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function BaseButton({
  variant = 'solid',
  color = 'secondary',
  icon: Icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`min-h-[40px] inline-flex justify-center items-center gap-2 rounded-xl cursor-pointer aria-disabled:cursor-default disabled:cursor-default pointer-events-auto
        ${
          variant === 'solid'
            ? `text-white aria-disabled:text-neutral-100 aria-disabled:bg-neutral-300 aria-disabled:dark:text-neutral-400 aria-disabled:dark:bg-neutral-600 ${SOLID_CLASSNAMES[color]}`
            : `hover:text-white
                aria-disabled:text-neutral-300 dark:aria-disabled:text-neutral-600
            aria-disabled:hover:bg-transparent aria-disabled:dark:hover:bg-transparent ${GHOST_CLASSNAMES[color]}`
        }
        ${className ?? ''}`}
      {...rest}
    >
      {Icon && <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden />}
      {children}
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
