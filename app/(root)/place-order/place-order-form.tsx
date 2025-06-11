'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createOrder } from '@/lib/actions/order.actions';

export default function PlaceOrderForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    const res = await createOrder();
    setPending(false);
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <Button type="submit" disabled={pending} className='w-full'>
        {pending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Check className='w-4 h-4' />
        )}{' '}
        Place Order
      </Button>
    </form>
  );
}
