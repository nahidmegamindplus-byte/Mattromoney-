import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/services/chat.service';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const conversations = await ChatService.getUserConversations(auth.session!.userId);
    return NextResponse.json({ success: true, conversations });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
