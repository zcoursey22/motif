import { Plus } from 'lucide-react';
import { IconButton } from './ui/Button';

export default function NewSessionButton() {
  return (
    <IconButton
      color="brand"
      icon={Plus}
      aria-label="New session"
      href="/"
    ></IconButton>
  );
}
