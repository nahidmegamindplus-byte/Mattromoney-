import { NextRequest, NextResponse } from 'next/server';
import { ConnectionService } from '@/services/connection.service';
import { requireAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const shortlists = await prisma.shortlist.findMany({
      where: { userId: auth.session!.userId },
      include: {
        biodata: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, shortlists });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { biodataId } = body;

    if (!biodataId) {
      return NextResponse.json({ success: false, message: 'biodataId is required.' }, { status: 400 });
    }

    const result = await ConnectionService.toggleShortlist(auth.session!.userId, biodataId);
    return NextResponse.json({
      success: true,
      shortlisted: result.shortlisted,
      message: result.shortlisted ? 'Profile added to shortlist.' : 'Profile removed from shortlist.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
