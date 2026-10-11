import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';
import { requireRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = requireRole(req, ['FINANCE_ADMIN', 'SUPER_ADMIN']);
    if (auth.error) return auth.error;

    const reports = await PaymentService.getFinancialReports();
    return NextResponse.json({ success: true, reports });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
