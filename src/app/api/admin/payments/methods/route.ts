import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/admin.service';
import { requireRole } from '@/lib/auth-guard';

export async function GET() {
  try {
    const methods = await AdminService.getPaymentMethods();
    return NextResponse.json({ success: true, paymentMethods: methods });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireRole(req, ['SUPER_ADMIN', 'FINANCE_ADMIN']);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Payment method ID is required.' }, { status: 400 });
    }

    const updated = await AdminService.updatePaymentMethod(auth.session!.userId, id, data);
    return NextResponse.json({
      success: true,
      message: 'Payment method settings updated successfully.',
      paymentMethod: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
