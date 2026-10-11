import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const orders = await PaymentService.getUserPaymentHistory(auth.session!.userId);
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ success: false, message: 'planId is required.' }, { status: 400 });
    }

    const { order, activePaymentMethods } = await PaymentService.createOrder(auth.session!.userId, planId);
    return NextResponse.json({
      success: true,
      order,
      paymentMethods: activePaymentMethods,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
