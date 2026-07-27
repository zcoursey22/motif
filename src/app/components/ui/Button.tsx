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
  primary: `bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400
    aria-disabled:bg-slate-300 dark:aria-disabled:bg-slate-500
    aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400`,
  secondary: `bg-neutral-400 hover:bg-neutral-500 dark:bg-neutral-500 dark:hover:bg-neutral-400
    aria-disabled:bg-neutral-300 dark:aria-disabled:bg-neutral-500
    aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400`,
  success: ` bg-green-400 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400
    aria-disabled:bg-mist-300 dark:aria-disabled:bg-mist-500
    aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400`,
  warn: `bg-amber-400 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400
    aria-disabled:bg-stone-300 dark:aria-disabled:bg-stone-500
    aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400`,
  error: `bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400
    aria-disabled:bg-mauve-300 dark:aria-disabled:bg-mauve-500
    aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400`,
  brand: `bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400
    aria-disabled:bg-slate-300 dark:aria-disabled:bg-slate-500
    aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400`,
};

const GHOST_CLASSNAMES: Record<ButtonColor, string> = {
  primary: `text-blue-500 dark:text-blue-400
    hover:bg-blue-500 dark:hover:bg-blue-400
    aria-disabled:hover:text-slate-300 aria-disabled:text-slate-300
    aria-disabled:dark:text-slate-500 dark:aria-disabled:hover:text-slate-500`,
  secondary: `
    hover:bg-neutral-400 dark:hover:bg-neutral-500
    aria-disabled:hover:text-neutral-300 aria-disabled:text-neutral-300
    aria-disabled:dark:text-neutral-600 dark:aria-disabled:hover:text-neutral-600`,
  success: `text-green-500 dark:text-green-400
    hover:bg-green-500 dark:hover:bg-green-400
    aria-disabled:hover:text-mist-300 aria-disabled:text-mist-300
    aria-disabled:dark:text-mist-500 dark:aria-disabled:hover:text-mist-500`,
  warn: `text-amber-500 dark:text-amber-400
    hover:bg-amber-500 dark:hover:bg-amber-400
    aria-disabled:hover:text-stone-300 aria-disabled:text-stone-300
    aria-disabled:dark:text-stone-500 dark:aria-disabled:hover:text-stone-500`,
  error: `text-red-500 dark:text-red-400
    hover:bg-red-500 dark:hover:bg-red-400
    aria-disabled:hover:text-mauve-300 aria-disabled:text-mauve-300
    aria-disabled:dark:text-mauve-500 dark:aria-disabled:hover:text-mauve-500`,
  brand: `text-indigo-500 dark:text-indigo-400
    hover:bg-indigo-500 dark:hover:bg-indigo-400
    aria-disabled:hover:text-slate-300 aria-disabled:text-slate-300
    aria-disabled:dark:text-slate-500 dark:aria-disabled:hover:text-slate-500`,
};

type ButtonProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function BaseButton({
  variant = 'solid',
  color = 'secondary',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`min-h-[40px] inline-flex justify-center items-center gap-2 rounded-xl cursor-pointer aria-disabled:cursor-default disabled:cursor-default pointer-events-auto
        ${variant === 'solid' ? `text-white ${SOLID_CLASSNAMES[color]}` : `hover:text-white aria-disabled:hover:bg-transparent aria-disabled:dark:hover:bg-transparent ${GHOST_CLASSNAMES[color]}`}
        ${className ?? ''}`}
      {...rest}
    >
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
