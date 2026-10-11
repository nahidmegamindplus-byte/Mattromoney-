import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { orderId, provider, senderNumber, transactionId, amountSentBdt, receiptImageUrl, userNotes } = body;

    if (!orderId || !provider || !senderNumber || !transactionId || !amountSentBdt) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required payment submission details.' },
        { status: 400 }
      );
    }

    const submission = await PaymentService.submitPaymentClaim({
      userId: auth.session!.userId,
      orderId,
      provider,
      senderNumber,
      transactionId,
      amountSentBdt: Number(amountSentBdt),
      receiptImageUrl,
      userNotes,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment claim submitted successfully. Awaiting manual verification from finance administration.',
      submission,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
