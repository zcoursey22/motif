import { LucideIcon, CircleAlert, Info } from 'lucide-react';

type NoticeVariant = 'info' | 'error';

const VARIANTS: Record<NoticeVariant, { icon: LucideIcon; className: string }> =
  {
    info: { icon: Info, className: 'text-blue-500 dark:text-blue-400' },
    error: { icon: CircleAlert, className: 'text-red-500 dark:text-red-400' },
  };

export function Notice({
  variant = 'error',
  className,
  children,
}: {
  variant?: NoticeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, className: variantClassName } = VARIANTS[variant];
  return (
    <div
      className={`inline-flex justify-center items-center gap-2 ${variantClassName} ${className}`}
    >
      <Icon aria-hidden />
      <span className="text-neutral-600 dark:text-neutral-300">{children}</span>
    </div>
  );
}
