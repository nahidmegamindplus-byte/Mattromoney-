import { prisma } from '@/lib/prisma';
import { BiodataStatus } from '@/types';

export class BiodataService {
  /**
   * Generates sequential biodata numbers: AB-YYYY-1001, AB-YYYY-1002, etc.
   */
  static async generateBiodataNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.biodata.count();
    const sequence = 1000 + count + 1;
    return `AB-${year}-${sequence}`;
  }

  /**
   * Calculate profile completion percentage across demographics, career, family, preferences
   */
  static calculateCompletionPercentage(data: Record<string, any>): number {
    const criticalFields = [
      'gender',
      'dateOfBirth',
      'maritalStatus',
      'heightCm',
      'complexion',
      'religion',
      'presentDivision',
      'presentDistrict',
      'permanentDivision',
      'permanentDistrict',
      'educationLevel',
      'occupationCategory',
      'familyValues',
      'fatherProfession',
      'motherProfession',
      'aboutMe',
      'partnerMinAge',
      'partnerMaxAge',
      'partnerExpectations',
      'profilePhoto',
      'guardianContactPhone',
    ];

    let filledCount = 0;
    for (const field of criticalFields) {
      if (data[field] !== undefined && data[field] !== null && String(data[field]).trim() !== '') {
        filledCount++;
      }
    }

    return Math.round((filledCount / criticalFields.length) * 100);
  }

  static async getBiodataById(id: string, viewerUserId?: string) {
    const biodata = await prisma.biodata.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!biodata) return null;

    // Increment views count if viewer is not owner
    if (viewerUserId && viewerUserId !== biodata.userId) {
      await prisma.biodata.update({
        where: { id: biodata.id },
        data: { viewsCount: { increment: 1 } },
      });

      // Record profile view
      await prisma.profileView.create({
        data: {
          viewerId: viewerUserId,
          biodataId: biodata.id,
        },
      });
    }

    // Apply Server-side Privacy Rules
    return this.applyPrivacyFilter(biodata, viewerUserId);
  }

  static async getBiodataByUserId(userId: string) {
    return prisma.biodata.findUnique({
      where: { userId },
    });
  }

  /**
   * Server-side Privacy & Contact masking enforcement:
   * Guardian phone and private documents are masked unless authorized
   */
  static async applyPrivacyFilter(biodata: any, viewerUserId?: string) {
    const isOwner = viewerUserId && viewerUserId === biodata.userId;
    
    // Check if viewer has an active approved access request
    let hasApprovedAccess = false;
    if (viewerUserId && !isOwner) {
      const accessGrant = await prisma.biodataAccessRequest.findUnique({
        where: {
          requesterId_biodataId: {
            requesterId: viewerUserId,
            biodataId: biodata.id,
          },
        },
      });
      if (accessGrant && accessGrant.status === 'APPROVED') {
        hasApprovedAccess = true;
      }
    }

    const filtered = { ...biodata };

    // Mask Guardian Contact Phone unless owner or approved access
    if (!isOwner && !hasApprovedAccess) {
      if (filtered.guardianContactPhone) {
        const phone = filtered.guardianContactPhone;
        filtered.guardianContactPhone = phone.slice(0, 5) + '******';
      }
      filtered.isGuardianContactLocked = true;
    } else {
      filtered.isGuardianContactLocked = false;
    }

    // Photo privacy enforcement
    if (!isOwner) {
      if (filtered.photoPrivacy === 'ON_REQUEST' && !hasApprovedAccess) {
        filtered.isPhotoBlurred = true;
      } else if (filtered.photoPrivacy === 'HIDDEN') {
        filtered.profilePhoto = null;
        filtered.isPhotoBlurred = true;
      }
    }

    return filtered;
  }

  static async upsertBiodata(userId: string, data: any) {
    const existing = await prisma.biodata.findUnique({ where: { userId } });
    
    // Calculate age from dateOfBirth if provided
    let calculatedAge = data.age;
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      calculatedAge = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }
    }

    const mergedData = {
      ...data,
      age: calculatedAge || existing?.age || 25,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : existing?.dateOfBirth,
      heightCm: Number(data.heightCm) || existing?.heightCm || 165,
      completionPercentage: this.calculateCompletionPercentage({ ...(existing || {}), ...data }),
    };

    if (existing) {
      return prisma.biodata.update({
        where: { id: existing.id },
        data: mergedData,
      });
    } else {
      const biodataNumber = await this.generateBiodataNumber();
      return prisma.biodata.create({
        data: {
          ...mergedData,
          biodataNumber,
          userId,
          status: 'APPROVED', // Default to approved for immediate usability or PENDING_REVIEW
        },
      });
    }
  }

  static async updateStatus(biodataId: string, status: BiodataStatus, reason?: string) {
    return prisma.biodata.update({
      where: { id: biodataId },
      data: {
        status,
        rejectionReason: reason || null,
      },
    });
  }
}
