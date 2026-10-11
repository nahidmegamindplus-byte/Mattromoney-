import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/admin.service';
import { requireRole } from '@/lib/auth-guard';

export async function GET() {
  try {
    const plans = await AdminService.getAllPlans();
    return NextResponse.json({ success: true, plans });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireRole(req, ['SUPER_ADMIN', 'FINANCE_ADMIN']);
    if (auth.error) return auth.error;

    const body = await req.json();
    if (!body.nameEn || !body.nameBn) {
      return NextResponse.json(
        { success: false, message: 'ইংরেজি ও বাংলা উভয় নাম প্রদান করা আবশ্যক।' },
        { status: 400 }
      );
    }

    const plan = await AdminService.createPlan(auth.session!.userId, body);
    return NextResponse.json({
      success: true,
      message: 'নতুন মেম্বারশিপ প্যাকেজ সফলভাবে তৈরি হয়েছে।',
      plan,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireRole(req, ['SUPER_ADMIN', 'FINANCE_ADMIN']);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Plan ID is required.' }, { status: 400 });
    }

    const updated = await AdminService.updatePlan(auth.session!.userId, id, data);
    return NextResponse.json({
      success: true,
      message: 'প্যাকেজের তথ্য সফলভাবে আপডেট করা হয়েছে।',
      plan: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireRole(req, ['SUPER_ADMIN', 'FINANCE_ADMIN']);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const force = searchParams.get('force') === 'true';

    if (!id) {
      return NextResponse.json({ success: false, message: 'Plan ID is required.' }, { status: 400 });
    }

    const result = await AdminService.deletePlan(auth.session!.userId, id, force);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
