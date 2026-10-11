import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const { id } = await params;
    const checkoutData = await PaymentService.getOrderForCheckout(id, auth.session!.userId);

    return NextResponse.json({ success: true, ...checkoutData });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 404 });
  }
}
