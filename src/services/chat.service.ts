import { prisma } from '@/lib/prisma';

export class ChatService {
  /**
   * Get or create a conversation between two users
   */
  static async getOrCreateConversation(user1Id: string, user2Id: string) {
    if (user1Id === user2Id) throw new Error('Cannot chat with yourself.');

    // Check block status
    const isBlocked = await prisma.blockRecord.findFirst({
      where: {
        OR: [
          { blockerId: user1Id, blockedId: user2Id },
          { blockerId: user2Id, blockedId: user1Id },
        ],
      },
    });

    if (isBlocked) {
      throw new Error('Communication is blocked between these accounts.');
    }

    // Normalizing participants order
    const [p1, p2] = [user1Id, user2Id].sort();

    let conversation = await prisma.conversation.findUnique({
      where: {
        participant1Id_participant2Id: {
          participant1Id: p1,
          participant2Id: p2,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: p1,
          participant2Id: p2,
          lastMessageAt: new Date(),
        },
      });
    }

    return conversation;
  }

  static async sendMessage(senderId: string, receiverId: string, content: string, attachmentUrl?: string) {
    if (!content.trim() && !attachmentUrl) {
      throw new Error('Message content or attachment cannot be empty.');
    }

    const conversation = await this.getOrCreateConversation(senderId, receiverId);

    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId,
          receiverId,
          content: content.trim(),
          attachmentUrl: attachmentUrl || null,
        },
      });

      await tx.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      await tx.notification.create({
        data: {
          userId: receiverId,
          title: 'New Message',
          message: content.length > 40 ? content.slice(0, 40) + '...' : content,
          type: 'MESSAGE',
          linkUrl: `/dashboard/chat?partnerId=${senderId}`,
        },
      });

      return msg;
    });

    return message;
  }

  static async getMessages(conversationId: string, limit = 50) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }

  static async markConversationAsRead(conversationId: string, currentUserId: string) {
    return prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  static async getUserConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Populate other participant's profile
    const partnerIds = conversations.map((c) =>
      c.participant1Id === userId ? c.participant2Id : c.participant1Id
    );

    const partners = await prisma.user.findMany({
      where: { id: { in: partnerIds } },
      include: { biodata: true },
    });

    const partnerMap = new Map(partners.map((p) => [p.id, p]));

    return conversations.map((c) => {
      const partnerId = c.participant1Id === userId ? c.participant2Id : c.participant1Id;
      const partner = partnerMap.get(partnerId);
      const lastMsg = c.messages[0] || null;

      return {
        id: c.id,
        partnerId,
        partnerName: partner?.name || 'Member',
        partnerBiodataNumber: partner?.biodata?.biodataNumber || 'AB-MEMBER',
        partnerPhoto: partner?.biodata?.profilePhoto || null,
        lastMessage: lastMsg?.content || '',
        lastMessageAt: c.lastMessageAt,
        unread: lastMsg && lastMsg.receiverId === userId && !lastMsg.isRead,
      };
    });
  }
}
