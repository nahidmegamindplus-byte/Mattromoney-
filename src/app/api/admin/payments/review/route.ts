import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';
import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const auth = requireRole(req, ['FINANCE_ADMIN', 'SUPER_ADMIN']);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { action, submissionId, reason, adminNotes } = body;

    if (!submissionId || !action) {
      return NextResponse.json(
        { success: false, message: 'action (APPROVE | REJECT | REQUEST_INFO) and submissionId are required.' },
        { status: 400 }
      );
    }

    // Safety check: Never permit users to approve their own payments through an administrative shortcut
    const submission = await prisma.paymentSubmission.findUnique({
      where: { id: submissionId },
    });
    if (submission && submission.userId === auth.session!.userId) {
      return NextResponse.json(
        { success: false, message: 'Security violation: Administrators cannot verify or approve their own personal payment orders.' },
        { status: 403 }
      );
    }

    if (action === 'APPROVE') {
      const result = await PaymentService.approvePayment(auth.session!.userId, submissionId, adminNotes);
      return NextResponse.json({
        success: true,
        message: 'Payment verified and approved! Subscription activated successfully.',
        result,
      });
    } else if (action === 'REJECT') {
      if (!reason) {
        return NextResponse.json(
          { success: false, message: 'A rejection reason is strictly required.' },
          { status: 400 }
        );
      }
      const result = await PaymentService.rejectPayment(auth.session!.userId, submissionId, reason);
      return NextResponse.json({
        success: true,
        message: 'Payment rejected and member notified.',
        result,
      });
    } else if (action === 'REQUEST_INFO') {
      if (!reason) {
        return NextResponse.json(
          { success: false, message: 'Inquiry details are required when requesting more info.' },
          { status: 400 }
        );
      }
      const result = await PaymentService.requestMoreInfo(auth.session!.userId, submissionId, reason);
      return NextResponse.json({
        success: true,
        message: 'Additional information requested from user.',
        result,
      });
    } else {
      return NextResponse.json({ success: false, message: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
