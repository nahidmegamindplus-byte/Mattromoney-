import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/admin.service';
import { requireRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = requireRole(req, ['FINANCE_ADMIN', 'SUPER_ADMIN']);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const provider = searchParams.get('provider') || undefined;

    const queue = await AdminService.getManualPaymentQueue({ status, provider });
    return NextResponse.json({ success: true, queue });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
