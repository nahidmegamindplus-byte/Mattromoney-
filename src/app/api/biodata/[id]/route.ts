import { NextRequest, NextResponse } from 'next/server';
import { BiodataService } from '@/services/biodata.service';
import { getSessionFromRequest } from '@/lib/auth-guard';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = getSessionFromRequest(req);

    const biodata = await BiodataService.getBiodataById(id, session?.userId);
    if (!biodata) {
      return NextResponse.json({ success: false, message: 'Biodata not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, biodata });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
