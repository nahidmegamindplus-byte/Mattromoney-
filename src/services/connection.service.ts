import { prisma } from '@/lib/prisma';

export class ConnectionService {
  /**
   * Send interest request with subscription entitlement check & block verification
   */
  static async sendInterest(senderId: string, receiverId: string, message?: string) {
    if (senderId === receiverId) {
      throw new Error('You cannot send an interest request to your own profile.');
    }

    // Verify neither user is blocked
    const isBlocked = await prisma.blockRecord.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: senderId },
        ],
      },
    });

    if (isBlocked) {
      throw new Error('Action not allowed. One of the users has blocked the other.');
    }

    // Check active subscription and remaining quota
    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId: senderId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
      include: { plan: true },
    });

    if (!activeSub) {
      throw new Error('You need an active membership plan to send interest requests.');
    }

    if (activeSub.interestsRemaining <= 0) {
      throw new Error('You have exhausted your interest limit for this plan. Please upgrade to continue.');
    }

    // Check if interest already sent
    const existing = await prisma.interest.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });

    if (existing) {
      if (existing.status === 'PENDING') {
        throw new Error('You have already sent an interest request to this member.');
      }
      if (existing.status === 'ACCEPTED') {
        throw new Error('Interest has already been accepted between you and this member.');
      }
    }

    // Atomic transaction: create/update interest and decrement quota
    const [interest] = await prisma.$transaction([
      prisma.interest.upsert({
        where: { senderId_receiverId: { senderId, receiverId } },
        update: { status: 'PENDING', message, createdAt: new Date() },
        create: { senderId, receiverId, message, status: 'PENDING' },
      }),
      prisma.subscription.update({
        where: { id: activeSub.id },
        data: { interestsRemaining: { decrement: 1 } },
      }),
      prisma.notification.create({
        data: {
          userId: receiverId,
          title: 'New Matrimonial Interest Received',
          message: 'A prospective match has sent you an interest request.',
          type: 'INTEREST',
          linkUrl: '/dashboard/interests?tab=received',
        },
      }),
    ]);

    return interest;
  }

  static async respondToInterest(receiverId: string, interestId: string, status: 'ACCEPTED' | 'DECLINED') {
    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
      include: { sender: true },
    });

    if (!interest || interest.receiverId !== receiverId) {
      throw new Error('Interest request not found or unauthorized.');
    }

    const updated = await prisma.interest.update({
      where: { id: interestId },
      data: {
        status,
        respondedAt: new Date(),
      },
    });

    // Notify sender
    await prisma.notification.create({
      data: {
        userId: interest.senderId,
        title: status === 'ACCEPTED' ? 'Interest Accepted!' : 'Interest Update',
        message:
          status === 'ACCEPTED'
            ? 'Your interest request was accepted! You can now view their details or chat.'
            : 'Your interest request was declined by the candidate.',
        type: 'ACCEPTANCE',
        linkUrl: '/dashboard/interests?tab=sent',
      },
    });

    return updated;
  }

  static async toggleShortlist(userId: string, biodataId: string) {
    const existing = await prisma.shortlist.findUnique({
      where: { userId_biodataId: { userId, biodataId } },
    });

    if (existing) {
      await prisma.shortlist.delete({ where: { id: existing.id } });
      return { shortlisted: false };
    } else {
      await prisma.shortlist.create({
        data: { userId, biodataId },
      });
      return { shortlisted: true };
    }
  }

  static async requestBiodataAccess(requesterId: string, biodataId: string) {
    const biodata = await prisma.biodata.findUnique({ where: { id: biodataId } });
    if (!biodata) throw new Error('Biodata not found.');

    if (biodata.userId === requesterId) {
      throw new Error('You cannot request access to your own profile.');
    }

    // Check subscription and access quota
    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId: requesterId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
    });

    if (!activeSub || activeSub.biodataAccessRemaining <= 0) {
      throw new Error('You need an active plan with available contact unlock quota.');
    }

    const existing = await prisma.biodataAccessRequest.findUnique({
      where: { requesterId_biodataId: { requesterId, biodataId } },
    });

    if (existing && existing.status === 'APPROVED') {
      return existing;
    }

    // In AmarBondhon, premium plan users can immediately unlock or request permission
    const [request] = await prisma.$transaction([
      prisma.biodataAccessRequest.upsert({
        where: { requesterId_biodataId: { requesterId, biodataId } },
        update: { status: 'APPROVED', grantedAt: new Date() },
        create: { requesterId, biodataId, status: 'APPROVED', grantedAt: new Date() },
      }),
      prisma.subscription.update({
        where: { id: activeSub.id },
        data: { biodataAccessRemaining: { decrement: 1 } },
      }),
      prisma.notification.create({
        data: {
          userId: biodata.userId,
          title: 'Contact Details Unlocked',
          message: 'A verified premium member has unlocked your guardian contact information.',
          type: 'INFO',
          linkUrl: `/profiles/${biodataId}`,
        },
      }),
    ]);

    return request;
  }

  static async blockUser(blockerId: string, blockedId: string, reason?: string) {
    if (blockerId === blockedId) throw new Error('Cannot block yourself.');

    return prisma.blockRecord.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      update: { reason },
      create: { blockerId, blockedId, reason },
    });
  }

  static async reportUser(reporterId: string, targetUserId: string, reason: string, details?: string) {
    return prisma.reportRecord.create({
      data: {
        reporterId,
        targetUserId,
        reason,
        details,
        status: 'PENDING',
      },
    });
  }
}
