import { NextRequest, NextResponse } from 'next/server';
import { CallingService } from '@/services/calling.service';
import { requireAuth } from '@/lib/auth-guard';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await req.json();
    const { status, durationSeconds } = body;

    const updated = await CallingService.updateCallStatus(id, status, durationSeconds);
    return NextResponse.json({ success: true, callSession: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
