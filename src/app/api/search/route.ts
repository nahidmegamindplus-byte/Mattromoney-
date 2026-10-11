import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/search.service';
import { getSessionFromRequest } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const { searchParams } = new URL(req.url);

    const filters = {
      gender: searchParams.get('gender') || undefined,
      minAge: searchParams.get('minAge') ? Number(searchParams.get('minAge')) : undefined,
      maxAge: searchParams.get('maxAge') ? Number(searchParams.get('maxAge')) : undefined,
      minHeightCm: searchParams.get('minHeightCm') ? Number(searchParams.get('minHeightCm')) : undefined,
      maxHeightCm: searchParams.get('maxHeightCm') ? Number(searchParams.get('maxHeightCm')) : undefined,
      religion: searchParams.get('religion') || undefined,
      maritalStatus: searchParams.get('maritalStatus') || undefined,
      educationLevel: searchParams.get('educationLevel') || undefined,
      occupationCategory: searchParams.get('occupationCategory') || undefined,
      division: searchParams.get('division') || undefined,
      district: searchParams.get('district') || undefined,
      searchTerm: searchParams.get('searchTerm') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };

    const result = await SearchService.searchProfiles(filters, session?.userId);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
