import { NextRequest, NextResponse } from 'next/server';
import { BiodataService } from '@/services/biodata.service';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const biodata = await BiodataService.getBiodataByUserId(auth.session!.userId);
    return NextResponse.json({ success: true, biodata });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const biodata = await BiodataService.upsertBiodata(auth.session!.userId, body);

    return NextResponse.json({
      success: true,
      message: 'Biodata saved successfully.',
      biodata,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
