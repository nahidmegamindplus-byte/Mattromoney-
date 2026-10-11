import { prisma } from '@/lib/prisma';
import { SearchFilters, CompatibilityScore } from '@/types';

export class SearchService {
  /**
   * Computes compatibility score between a viewer's biodata and a candidate biodata
   */
  static calculateCompatibility(viewerBiodata: any, candidateBiodata: any): CompatibilityScore {
    if (!viewerBiodata || !candidateBiodata) {
      return {
        score: 75,
        factors: {
          religion: true,
          ageMatch: true,
          educationMatch: true,
          locationMatch: false,
          lifestyleMatch: true,
        },
      };
    }

    let totalScore = 0;
    const factors = {
      religion: false,
      ageMatch: false,
      educationMatch: false,
      locationMatch: false,
      lifestyleMatch: false,
    };

    // 1. Religion match (30 pts)
    if (viewerBiodata.religion === candidateBiodata.religion) {
      factors.religion = true;
      totalScore += 30;
    }

    // 2. Age within candidate preferences (25 pts)
    const minAge = viewerBiodata.partnerMinAge || 18;
    const maxAge = viewerBiodata.partnerMaxAge || 50;
    if (candidateBiodata.age >= minAge && candidateBiodata.age <= maxAge) {
      factors.ageMatch = true;
      totalScore += 25;
    } else {
      const diff = Math.min(Math.abs(candidateBiodata.age - minAge), Math.abs(candidateBiodata.age - maxAge));
      if (diff <= 2) totalScore += 15;
    }

    // 3. Education match (15 pts)
    if (
      candidateBiodata.educationLevel === 'POST_GRADUATE' ||
      candidateBiodata.educationLevel === 'GRADUATE' ||
      candidateBiodata.educationLevel === viewerBiodata.educationLevel
    ) {
      factors.educationMatch = true;
      totalScore += 15;
    }

    // 4. Location match (15 pts)
    if (
      viewerBiodata.presentDistrict === candidateBiodata.presentDistrict ||
      viewerBiodata.permanentDistrict === candidateBiodata.permanentDistrict
    ) {
      factors.locationMatch = true;
      totalScore += 15;
    } else if (viewerBiodata.presentDivision === candidateBiodata.presentDivision) {
      totalScore += 10;
    }

    // 5. Lifestyle & Family Values (15 pts)
    if (viewerBiodata.familyValues === candidateBiodata.familyValues) {
      factors.lifestyleMatch = true;
      totalScore += 15;
    } else {
      totalScore += 10;
    }

    return {
      score: Math.min(totalScore, 100),
      factors,
    };
  }

  static async searchProfiles(filters: SearchFilters, currentUserId?: string) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'APPROVED',
    };

    // If viewer is logged in, exclude their own profile and blocked users
    if (currentUserId) {
      const blockedRecords = await prisma.blockRecord.findMany({
        where: {
          OR: [{ blockerId: currentUserId }, { blockedId: currentUserId }],
        },
      });

      const blockedUserIds = blockedRecords.map((b) =>
        b.blockerId === currentUserId ? b.blockedId : b.blockerId
      );

      where.userId = {
        notIn: [currentUserId, ...blockedUserIds],
      };
    }

    if (filters.gender) {
      where.gender = filters.gender.toUpperCase();
    }

    if (filters.minAge || filters.maxAge) {
      where.age = {};
      if (filters.minAge) where.age.gte = Number(filters.minAge);
      if (filters.maxAge) where.age.lte = Number(filters.maxAge);
    }

    if (filters.minHeightCm || filters.maxHeightCm) {
      where.heightCm = {};
      if (filters.minHeightCm) where.heightCm.gte = Number(filters.minHeightCm);
      if (filters.maxHeightCm) where.heightCm.lte = Number(filters.maxHeightCm);
    }

    if (filters.religion) {
      where.religion = filters.religion.toUpperCase();
    }

    if (filters.maritalStatus) {
      where.maritalStatus = filters.maritalStatus;
    }

    if (filters.educationLevel) {
      where.educationLevel = filters.educationLevel;
    }

    if (filters.occupationCategory) {
      where.occupationCategory = filters.occupationCategory;
    }

    if (filters.division) {
      where.presentDivision = filters.division;
    }

    if (filters.district) {
      where.presentDistrict = filters.district;
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.trim();
      where.OR = [
        { biodataNumber: { contains: term } },
        { occupationCategory: { contains: term } },
        { designation: { contains: term } },
        { instituteName: { contains: term } },
        { presentDistrict: { contains: term } },
        { educationField: { contains: term } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sortBy === 'age_asc') orderBy = { age: 'asc' };
    if (filters.sortBy === 'age_desc') orderBy = { age: 'desc' };
    if (filters.sortBy === 'views') orderBy = { viewsCount: 'desc' };

    const [total, profiles] = await Promise.all([
      prisma.biodata.count({ where }),
      prisma.biodata.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    // Calculate compatibility score if viewer has biodata
    let viewerBiodata = null;
    if (currentUserId) {
      viewerBiodata = await prisma.biodata.findUnique({ where: { userId: currentUserId } });
    }

    const enrichedProfiles = profiles.map((p) => {
      const compatibility = this.calculateCompatibility(viewerBiodata, p);
      return {
        ...p,
        compatibilityScore: compatibility.score,
        compatibilityFactors: compatibility.factors,
      };
    });

    if (filters.sortBy === 'compatibility') {
      enrichedProfiles.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    return {
      profiles: enrichedProfiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getRecommendedProfiles(userId: string) {
    const userBiodata = await prisma.biodata.findUnique({ where: { userId } });
    if (!userBiodata) {
      return prisma.biodata.findMany({
        where: { status: 'APPROVED' },
        take: 6,
        orderBy: { viewsCount: 'desc' },
      });
    }

    // Opposite gender
    const targetGender = userBiodata.gender === 'MALE' ? 'FEMALE' : 'MALE';

    return prisma.biodata.findMany({
      where: {
        status: 'APPROVED',
        gender: targetGender,
        userId: { not: userId },
        age: {
          gte: userBiodata.partnerMinAge || 18,
          lte: userBiodata.partnerMaxAge || 50,
        },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  }
}
