import { prisma } from '@/lib/prisma';
import { PaymentService } from './payment.service';

export class AdminService {
  /**
   * Complete platform analytics dashboard metrics
   */
  static async getDashboardMetrics() {
    const [
      totalUsers,
      totalBiodatas,
      approvedBiodatas,
      pendingBiodatas,
      activeSubscriptions,
      pendingPaymentsCount,
      allApprovedOrders,
      recentUsers,
      pendingReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.biodata.count(),
      prisma.biodata.count({ where: { status: 'APPROVED' } }),
      prisma.biodata.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.subscription.count({ where: { status: 'ACTIVE', endDate: { gte: new Date() } } }),
      prisma.paymentSubmission.count({ where: { reviewStatus: 'SUBMITTED_FOR_VERIFICATION' } }),
      prisma.order.findMany({ where: { status: 'APPROVED' } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { biodata: true },
      }),
      prisma.paymentSubmission.findMany({
        where: { reviewStatus: 'SUBMITTED_FOR_VERIFICATION' },
        include: { order: { include: { plan: true } }, user: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalConfirmedRevenueBdt = allApprovedOrders.reduce((sum, o) => sum + o.amountBdt, 0);

    return {
      overview: {
        totalUsers,
        totalBiodatas,
        approvedBiodatas,
        pendingBiodatas,
        activeSubscriptions,
        pendingPaymentsCount,
        totalConfirmedRevenueBdt,
      },
      recentUsers,
      pendingReviews,
    };
  }

  /**
   * User management
   */
  static async listUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          biodata: true,
          subscriptions: {
            where: { status: 'ACTIVE', endDate: { gte: new Date() } },
            include: { plan: true },
            take: 1,
          },
        },
      }),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async updateUserStatus(adminId: string, userId: string, status: 'ACTIVE' | 'SUSPENDED', role?: string) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        ...(role ? { role } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: `USER_${status}`,
        entityType: 'User',
        entityId: userId,
        detailsJson: JSON.stringify({ status, role }),
      },
    });

    return updated;
  }

  /**
   * Plan management
   */
  static async getAllPlans() {
    return prisma.membershipPlan.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async createPlan(adminId: string, data: any) {
    const rawSlug = (data.slug || data.nameEn || 'CUSTOM_PLAN').toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    let slug = rawSlug;
    let counter = 1;
    while (await prisma.membershipPlan.findUnique({ where: { slug } })) {
      slug = `${rawSlug}_${counter++}`;
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        slug,
        nameEn: data.nameEn || 'New Plan',
        nameBn: data.nameBn || 'নতুন প্যাকেজ',
        badgeEn: data.badgeEn || null,
        priceBdt: Number(data.priceBdt || 0),
        originalPriceBdt: Number(data.originalPriceBdt || data.priceBdt || 0),
        durationDays: Number(data.durationDays || 30),
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        isPopular: Boolean(data.isPopular),
        searchLimit: Number(data.searchLimit || 100),
        interestLimit: Number(data.interestLimit || 10),
        biodataAccessLimit: Number(data.biodataAccessLimit || 5),
        directChatAllowed: Boolean(data.directChatAllowed),
        directCallAllowed: Boolean(data.directCallAllowed),
        displayOrder: Number(data.displayOrder || 0),
        featuresJson: typeof data.featuresJson === 'string'
          ? data.featuresJson
          : JSON.stringify(Array.isArray(data.featuresJson) ? data.featuresJson : (data.features || [])),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'MEMBERSHIP_PLAN_CREATED',
        entityType: 'MembershipPlan',
        entityId: plan.id,
        detailsJson: JSON.stringify(data),
      },
    });

    return plan;
  }

  static async updatePlan(adminId: string, planId: string, data: any) {
    const updated = await prisma.membershipPlan.update({
      where: { id: planId },
      data: {
        ...(data.slug ? { slug: data.slug.toUpperCase() } : {}),
        nameEn: data.nameEn,
        nameBn: data.nameBn,
        badgeEn: data.badgeEn !== undefined ? data.badgeEn : undefined,
        priceBdt: Number(data.priceBdt),
        originalPriceBdt: Number(data.originalPriceBdt),
        durationDays: Number(data.durationDays),
        isActive: data.isActive,
        isPopular: data.isPopular,
        searchLimit: Number(data.searchLimit),
        interestLimit: Number(data.interestLimit),
        biodataAccessLimit: Number(data.biodataAccessLimit),
        directChatAllowed: Boolean(data.directChatAllowed),
        directCallAllowed: Boolean(data.directCallAllowed),
        displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : undefined,
        featuresJson: typeof data.featuresJson === 'string' ? data.featuresJson : JSON.stringify(data.featuresJson || []),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'MEMBERSHIP_PLAN_UPDATED',
        entityType: 'MembershipPlan',
        entityId: planId,
        detailsJson: JSON.stringify(data),
      },
    });

    return updated;
  }

  static async deletePlan(adminId: string, planId: string, force = false) {
    const existing = await prisma.membershipPlan.findUnique({ where: { id: planId } });
    if (!existing) {
      throw new Error('Plan not found.');
    }

    const orderCount = await prisma.order.count({ where: { planId } });
    const subCount = await prisma.subscription.count({ where: { planId } });

    if ((orderCount > 0 || subCount > 0) && !force) {
      // Safely deactivate it so historical orders and subscriptions are preserved
      const updated = await prisma.membershipPlan.update({
        where: { id: planId },
        data: { isActive: false },
      });
      await prisma.auditLog.create({
        data: {
          adminId,
          action: 'MEMBERSHIP_PLAN_DEACTIVATED',
          entityType: 'MembershipPlan',
          entityId: planId,
          detailsJson: JSON.stringify({ reason: 'Deactivated due to existing orders/subscriptions' }),
        },
      });
      return {
        success: true,
        action: 'DEACTIVATED',
        message: 'প্যাকেজে বিদ্যমান অর্ডার থাকায় এটি নিরাপদে নিষ্ক্রিয় (Deactivated) করা হয়েছে।',
        plan: updated,
      };
    }

    if (force && (orderCount > 0 || subCount > 0)) {
      await prisma.order.deleteMany({ where: { planId } });
      await prisma.subscription.deleteMany({ where: { planId } });
    }

    await prisma.membershipPlan.delete({ where: { id: planId } });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'MEMBERSHIP_PLAN_DELETED',
        entityType: 'MembershipPlan',
        entityId: planId,
        detailsJson: JSON.stringify({ slug: existing.slug, nameEn: existing.nameEn }),
      },
    });

    return {
      success: true,
      action: 'DELETED',
      message: 'প্যাকেজটি সফলভাবে মুছে ফেলা হয়েছে।',
    };
  }

  /**
   * 7.1 Payment Methods Configuration CRUD
   */
  static async getPaymentMethods() {
    return prisma.paymentMethodConfig.findMany({
      orderBy: [{ isDefault: 'desc' }, { provider: 'asc' }],
    });
  }

  static async updatePaymentMethod(adminId: string, id: string, data: any) {
    // Mask account number for listing
    const rawNumber = String(data.accountNumber || '').trim();
    const masked = rawNumber.length >= 6 ? rawNumber.slice(0, 5) + '***' + rawNumber.slice(-3) : rawNumber;

    const updated = await prisma.paymentMethodConfig.update({
      where: { id },
      data: {
        displayNameEn: data.displayNameEn,
        displayNameBn: data.displayNameBn,
        accountNumber: rawNumber,
        maskedAccountNumber: masked,
        accountType: data.accountType,
        instructionsEn: data.instructionsEn,
        instructionsBn: data.instructionsBn,
        transactionType: data.transactionType || 'SEND_MONEY',
        referenceFormat: data.referenceFormat,
        minAmountBdt: Number(data.minAmountBdt),
        maxAmountBdt: Number(data.maxAmountBdt),
        isEnabled: Boolean(data.isEnabled),
        isDefault: Boolean(data.isDefault),
        requiresManualReview: Boolean(data.requiresManualReview),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'PAYMENT_METHOD_CONFIG_UPDATED',
        entityType: 'PaymentMethodConfig',
        entityId: id,
        detailsJson: JSON.stringify({ provider: updated.provider, masked }),
      },
    });

    return updated;
  }

  /**
   * Manual Payment Verification Queue
   */
  static async getManualPaymentQueue(filter?: { status?: string; provider?: string }) {
    const where: any = {};
    if (filter?.status) {
      where.reviewStatus = filter.status;
    }
    if (filter?.provider) {
      where.provider = filter.provider;
    }

    const submissions = await prisma.paymentSubmission.findMany({
      where,
      include: {
        order: {
          include: { plan: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check duplicate risk flags across submissions
    const trxCounts = new Map<string, number>();
    for (const sub of submissions) {
      trxCounts.set(sub.transactionId, (trxCounts.get(sub.transactionId) || 0) + 1);
    }

    return submissions.map((sub) => ({
      ...sub,
      duplicateRisk: (trxCounts.get(sub.transactionId) || 0) > 1,
    }));
  }

  /**
   * Audit Logs
   */
  static async getAuditLogs(limit = 50) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }
}
