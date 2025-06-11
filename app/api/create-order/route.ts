import { NextRequest, NextResponse } from 'next/server';
import { createOrder as createOrderServer } from '@/lib/actions/order.actions';

export async function POST(req: NextRequest) {
  try {
    const result = await createOrderServer();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Order creation failed.' }, { status: 500 });
  }
}