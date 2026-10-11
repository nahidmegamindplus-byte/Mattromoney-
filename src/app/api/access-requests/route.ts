import { NextRequest, NextResponse } from 'next/server';
import { ConnectionService } from '@/services/connection.service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { biodataId } = body;

    if (!biodataId) {
      return NextResponse.json({ success: false, message: 'biodataId is required.' }, { status: 400 });
    }

    const access = await ConnectionService.requestBiodataAccess(auth.session!.userId, biodataId);
    return NextResponse.json({
      success: true,
      message: 'Guardian contact unlocked successfully using your membership quota.',
      access,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
