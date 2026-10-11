import { prisma } from '@/lib/prisma';

export class CallingService {
  /**
   * Initiates a real audio/video call session after verifying permissions, subscription privileges, and block status
   */
  static async initiateCall(callerId: string, receiverId: string, callType: 'AUDIO' | 'VIDEO' = 'VIDEO') {
    if (callerId === receiverId) {
      throw new Error('Cannot start a call with yourself.');
    }

    // 1. Verify not blocked
    const isBlocked = await prisma.blockRecord.findFirst({
      where: {
        OR: [
          { blockerId: callerId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: callerId },
        ],
      },
    });

    if (isBlocked) {
      throw new Error('Call cannot be placed because one of the accounts has blocked communication.');
    }

    // 2. Verify calling permission:
    // Either user has Gold/Platinum subscription with directCallAllowed
    // OR mutual interest is ACCEPTED
    const callerSub = await prisma.subscription.findFirst({
      where: {
        userId: callerId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
      include: { plan: true },
    });

    const hasDirectCallPrivilege = callerSub?.plan?.directCallAllowed === true;

    const acceptedInterest = await prisma.interest.findFirst({
      where: {
        OR: [
          { senderId: callerId, receiverId, status: 'ACCEPTED' },
          { senderId: receiverId, receiverId: callerId, status: 'ACCEPTED' },
        ],
      },
    });

    if (!hasDirectCallPrivilege && !acceptedInterest) {
      throw new Error(
        'Direct audio/video calling requires an active Gold or Platinum membership, or an accepted mutual interest request.'
      );
    }

    const roomId = `AB-ROOM-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const callSession = await prisma.callSession.create({
      data: {
        callerId,
        receiverId,
        callType,
        status: 'INITIATED',
        roomId,
      },
      include: {
        caller: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    // Notify receiver of incoming call
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: `Incoming ${callType} Call`,
        message: `${callSession.caller.name} is calling you...`,
        type: 'CALL',
        linkUrl: `/call/${roomId}`,
      },
    });

    // WebRTC connection configuration
    const rtcConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
      ],
    };

    return {
      callSession,
      roomId,
      rtcConfig,
      provider: process.env.LIVEKIT_URL ? 'LIVEKIT' : 'WEBRTC_MESH',
    };
  }

  static async updateCallStatus(
    callSessionId: string,
    status: 'CONNECTED' | 'REJECTED' | 'MISSED' | 'COMPLETED' | 'FAILED',
    durationSeconds = 0
  ) {
    const session = await prisma.callSession.findUnique({ where: { id: callSessionId } });
    if (!session) throw new Error('Call session not found.');

    return prisma.callSession.update({
      where: { id: callSessionId },
      data: {
        status,
        durationSeconds: durationSeconds || session.durationSeconds,
        endedAt: ['COMPLETED', 'REJECTED', 'MISSED', 'FAILED'].includes(status) ? new Date() : null,
      },
    });
  }

  static async getCallHistory(userId: string) {
    return prisma.callSession.findMany({
      where: {
        OR: [{ callerId: userId }, { receiverId: userId }],
      },
      include: {
        caller: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });
  }
}
