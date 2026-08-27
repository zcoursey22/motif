import { Plus } from 'lucide-react';
import { Button, IconButton } from './ui/Button';

export default function NewSessionButton({
  iconOnly = true,
}: {
  iconOnly?: boolean;
}) {
  return iconOnly ? (
    <IconButton color="brand" icon={Plus} aria-label="New session" href="/" />
  ) : (
    <Button color="brand" icon={Plus} href="/">
      New session
    </Button>
  );
}
