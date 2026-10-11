import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/admin.service';
import { requireRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = requireRole(req, ['SUPER_ADMIN', 'FINANCE_ADMIN', 'MODERATOR']);
    if (auth.error) return auth.error;

    const data = await AdminService.getDashboardMetrics();
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
