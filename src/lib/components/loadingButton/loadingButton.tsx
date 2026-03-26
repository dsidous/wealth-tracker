'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function LoadingButton({ children, className }: LoadingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className={className}>
      {pending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {children}
    </Button>
  );
}
