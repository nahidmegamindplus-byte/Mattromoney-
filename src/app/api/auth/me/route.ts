import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        biodata: true,
        subscriptions: {
          where: { status: 'ACTIVE', endDate: { gte: new Date() } },
          include: { plan: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      user: safeUser,
      activeSubscription: user.subscriptions[0] || null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
