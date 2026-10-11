import { NextRequest, NextResponse } from 'next/server';
import { CallingService } from '@/services/calling.service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { receiverId, callType } = body;

    if (!receiverId) {
      return NextResponse.json({ success: false, message: 'receiverId is required.' }, { status: 400 });
    }

    const callResult = await CallingService.initiateCall(auth.session!.userId, receiverId, callType || 'VIDEO');
    return NextResponse.json({ success: true, ...callResult });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
