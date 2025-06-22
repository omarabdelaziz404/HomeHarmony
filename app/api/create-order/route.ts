import { NextResponse } from 'next/server';
import { createOrder as createOrderServer } from '@/lib/actions/order.actions';

export async function POST() {
  try {
    const result = await createOrderServer();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, message: 'Order creation failed.' }, { status: 500 });
  }
}