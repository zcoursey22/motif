import { Plus } from 'lucide-react';
import { Button } from './ui/Button';

export default function NewSessionButton() {
  return (
    <Button color="brand" icon={Plus} href="/">
      New session
    </Button>
  );
}
