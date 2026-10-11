import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/services/chat.service';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ success: false, message: 'conversationId is required.' }, { status: 400 });
    }

    const messages = await ChatService.getMessages(conversationId);
    await ChatService.markConversationAsRead(conversationId, auth.session!.userId);

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { receiverId, content, attachmentUrl } = body;

    if (!receiverId || (!content && !attachmentUrl)) {
      return NextResponse.json(
        { success: false, message: 'receiverId and message content/attachment are required.' },
        { status: 400 }
      );
    }

    const message = await ChatService.sendMessage(
      auth.session!.userId,
      receiverId,
      content || '',
      attachmentUrl
    );

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
