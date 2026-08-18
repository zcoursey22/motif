import { Info } from 'lucide-react';
import { toast } from 'sonner';

export const DEMO_TIMEOUT_DURATION = 600;

export const DEMO_MODE = process.env.DEMO_MODE === 'true';
export const CLIENT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const demoToast = () =>
  toast("Changes aren't saved in demo mode.", {
    icon: <Info className="text-blue-500 dark:text-blue-400" />,
  });
