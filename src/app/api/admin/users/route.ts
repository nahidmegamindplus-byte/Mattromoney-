import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/admin.service';
import { requireRole } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = requireRole(req, ['SUPER_ADMIN', 'MODERATOR']);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;
    const search = searchParams.get('search') || undefined;

    const result = await AdminService.listUsers(page, limit, search);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireRole(req, ['SUPER_ADMIN', 'MODERATOR']);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { userId, status, role } = body;

    if (!userId || !status) {
      return NextResponse.json({ success: false, message: 'userId and status are required.' }, { status: 400 });
    }

    const updated = await AdminService.updateUserStatus(auth.session!.userId, userId, status, role);
    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
