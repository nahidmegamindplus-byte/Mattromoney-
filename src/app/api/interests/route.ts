import { NextRequest, NextResponse } from 'next/server';
import { ConnectionService } from '@/services/connection.service';
import { requireAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'received';
    const userId = auth.session!.userId;

    if (tab === 'received') {
      const received = await prisma.interest.findMany({
        where: { receiverId: userId },
        include: {
          sender: {
            include: { biodata: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, interests: received });
    } else {
      const sent = await prisma.interest.findMany({
        where: { senderId: userId },
        include: {
          receiver: {
            include: { biodata: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, interests: sent });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { receiverId, message } = body;

    if (!receiverId) {
      return NextResponse.json({ success: false, message: 'Receiver ID is required.' }, { status: 400 });
    }

    const interest = await ConnectionService.sendInterest(auth.session!.userId, receiverId, message);
    return NextResponse.json({
      success: true,
      message: 'Interest request sent successfully!',
      interest,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { interestId, status } = body;

    if (!interestId || !['ACCEPTED', 'DECLINED'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Valid interestId and status required.' }, { status: 400 });
    }

    const updated = await ConnectionService.respondToInterest(auth.session!.userId, interestId, status);
    return NextResponse.json({
      success: true,
      message: `Interest request marked as ${status.toLowerCase()}.`,
      interest: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
