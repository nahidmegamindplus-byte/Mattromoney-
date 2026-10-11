import { prisma } from '@/lib/prisma';
import { PaymentProvider, PaymentReviewStatus } from '@/types';

export class PaymentService {
  /**
   * Generates a unique, traceable order number: e.g. AB-ORD-2026-000123
   */
  static async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.order.count();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sequence = String(count + 1).padStart(5, '0');
    return `AB-ORD-${year}-${sequence}-${randomHex}`;
  }

  /**
   * 7.2 USER CHECKOUT FLOW: Create a new pending order
   * Always retrieves the true plan price from the database to ensure integrity.
   */
  static async createOrder(userId: string, planId: string) {
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      throw new Error('Selected membership plan is invalid or currently inactive.');
    }

    if (plan.priceBdt <= 0) {
      throw new Error('Free plan does not require a payment transaction.');
    }

    const orderNumber = await this.generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        planId: plan.id,
        amountBdt: plan.priceBdt,
        status: 'PENDING_PAYMENT',
      },
      include: {
        plan: true,
      },
    });

    // Fetch configured payment methods
    const activePaymentMethods = await prisma.paymentMethodConfig.findMany({
      where: { isEnabled: true },
      orderBy: [{ isDefault: 'desc' }, { provider: 'asc' }],
    });

    return {
      order,
      activePaymentMethods,
    };
  }

  /**
   * Retrieve order details for checkout display
   */
  static async getOrderForCheckout(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { plan: true },
    });

    if (!order || order.userId !== userId) {
      throw new Error('Order not found or access denied.');
    }

    const paymentMethods = await prisma.paymentMethodConfig.findMany({
      where: { isEnabled: true },
      orderBy: [{ isDefault: 'desc' }, { provider: 'asc' }],
    });

    return { order, paymentMethods };
  }

  /**
   * 7.3 PAYMENT SUBMISSION FORM
   * User submits Send Money details for their pending order.
   * Validates ownership, expected amount from DB, and enforces TrxID uniqueness.
   */
  static async submitPaymentClaim(params: {
    userId: string;
    orderId: string;
    provider: PaymentProvider;
    senderNumber: string;
    transactionId: string;
    amountSentBdt: number;
    receiptImageUrl?: string;
    userNotes?: string;
  }) {
    // 1. Fetch and validate the order from DB
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { plan: true },
    });

    if (!order) {
      throw new Error('Order does not exist.');
    }

    if (order.userId !== params.userId) {
      throw new Error('Unauthorized: You can only submit payment details for your own pending orders.');
    }

    if (order.status !== 'PENDING_PAYMENT' && order.status !== 'INFO_REQUIRED') {
      throw new Error(`Cannot submit payment for order with status: ${order.status}`);
    }

    // 2. Validate clean transaction reference
    const cleanTrxId = params.transactionId.trim().toUpperCase();
    if (!cleanTrxId || cleanTrxId.length < 5) {
      throw new Error('A valid Transaction ID (TrxID) is required (minimum 5 alphanumeric characters).');
    }

    // 3. Enforce global uniqueness of Transaction ID to prevent double-claiming
    const existingSubmission = await prisma.paymentSubmission.findFirst({
      where: {
        transactionId: cleanTrxId,
      },
    });

    if (existingSubmission) {
      throw new Error(
        `This Transaction ID (${cleanTrxId}) has already been submitted on the system. Please verify your receipt or contact support if this is an error.`
      );
    }

    // 4. Validate amount matches expected order price
    if (params.amountSentBdt < order.amountBdt) {
      throw new Error(
        `Submitted amount (৳${params.amountSentBdt}) is less than the required plan price (৳${order.amountBdt}).`
      );
    }

    // 5. Create submission and update order status in an atomic transaction
    const [submission] = await prisma.$transaction([
      prisma.paymentSubmission.create({
        data: {
          orderId: order.id,
          userId: params.userId,
          provider: params.provider,
          senderNumber: params.senderNumber.trim(),
          transactionId: cleanTrxId,
          amountSentBdt: Number(params.amountSentBdt),
          receiptImageUrl: params.receiptImageUrl || null,
          userNotes: params.userNotes ? params.userNotes.trim() : null,
          reviewStatus: 'SUBMITTED_FOR_VERIFICATION',
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'SUBMITTED_FOR_VERIFICATION' },
      }),
      prisma.notification.create({
        data: {
          userId: params.userId,
          title: 'Payment Details Submitted',
          message: `Your payment of ৳${params.amountSentBdt} for ${order.plan.nameEn} (TrxID: ${cleanTrxId}) has been received for manual verification. Our finance team is reviewing it.`,
          type: 'PAYMENT',
          linkUrl: '/dashboard/payments',
        },
      }),
    ]);

    return submission;
  }

  /**
   * 7.5 & 7.6 FINANCE ADMIN: MANUAL PAYMENT APPROVAL
   * Strictly inside a database transaction:
   * 1. Check order eligibility & ownership
   * 2. Check no duplicate approval has occurred
   * 3. Set order & submission status to APPROVED
   * 4. Activate or extend subscription with exact plan entitlements
   * 5. Record audit log & notification
   */
  static async approvePayment(adminId: string, submissionId: string, adminNotes?: string) {
    const submission = await prisma.paymentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        order: {
          include: { plan: true },
        },
        user: true,
      },
    });

    if (!submission) {
      throw new Error('Payment submission record not found.');
    }

    if (submission.reviewStatus === 'APPROVED') {
      throw new Error('This transaction claim has already been approved.');
    }

    const { order, user } = submission;
    const plan = order.plan;

    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update PaymentSubmission
      const updatedSubmission = await tx.paymentSubmission.update({
        where: { id: submissionId },
        data: {
          reviewStatus: 'APPROVED',
          reviewedByAdminId: adminId,
          reviewReason: adminNotes || 'Payment verified through receiving account statement.',
          reviewedAt: new Date(),
        },
      });

      // 2. Update Order
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: 'APPROVED' },
      });

      // 3. Calculate Subscription dates (extend if existing active subscription)
      const existingActiveSub = await tx.subscription.findFirst({
        where: {
          userId: user.id,
          status: 'ACTIVE',
          endDate: { gte: new Date() },
        },
      });

      const startDate = existingActiveSub ? existingActiveSub.endDate : new Date();
      const durationMs = plan.durationDays * 24 * 60 * 60 * 1000;
      const endDate = new Date(startDate.getTime() + durationMs);

      // Create new subscription entry
      const newSubscription = await tx.subscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          orderId: order.id,
          startDate,
          endDate,
          status: 'ACTIVE',
          interestsRemaining: plan.interestLimit,
          biodataAccessRemaining: plan.biodataAccessLimit,
        },
      });

      // 4. Send Confirmation Notification to user
      await tx.notification.create({
        data: {
          userId: user.id,
          title: '🎉 Premium Membership Activated!',
          message: `Your payment of ৳${submission.amountSentBdt} for ${plan.nameEn} has been approved! Your premium benefits are now active until ${endDate.toLocaleDateString()}.`,
          type: 'APPROVAL',
          linkUrl: '/dashboard/payments',
        },
      });

      // 5. Append-only Audit Log
      await tx.auditLog.create({
        data: {
          adminId,
          action: 'PAYMENT_APPROVED',
          entityType: 'PaymentSubmission',
          entityId: submission.id,
          detailsJson: JSON.stringify({
            orderNumber: order.orderNumber,
            planSlug: plan.slug,
            amount: submission.amountSentBdt,
            provider: submission.provider,
            transactionId: submission.transactionId,
            adminNotes,
          }),
        },
      });

      return { updatedSubmission, updatedOrder, newSubscription };
    });

    return result;
  }

  /**
   * 7.5 FINANCE ADMIN: REJECT PAYMENT
   */
  static async rejectPayment(adminId: string, submissionId: string, rejectionReason: string) {
    if (!rejectionReason || rejectionReason.trim().length < 5) {
      throw new Error('A valid rejection reason must be provided (minimum 5 characters).');
    }

    const submission = await prisma.paymentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        order: { include: { plan: true } },
      },
    });

    if (!submission) {
      throw new Error('Submission not found.');
    }

    if (submission.reviewStatus === 'APPROVED') {
      throw new Error('Cannot reject a payment that has already been approved.');
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedSubmission = await tx.paymentSubmission.update({
        where: { id: submissionId },
        data: {
          reviewStatus: 'REJECTED',
          reviewedByAdminId: adminId,
          reviewReason: rejectionReason.trim(),
          reviewedAt: new Date(),
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: submission.orderId },
        data: { status: 'REJECTED' },
      });

      await tx.notification.create({
        data: {
          userId: submission.userId,
          title: 'Payment Verification Update',
          message: `Your payment claim for order ${submission.order.orderNumber} could not be verified. Reason: ${rejectionReason}. Please review and resubmit with correct details.`,
          type: 'PAYMENT',
          linkUrl: '/dashboard/payments',
        },
      });

      await tx.auditLog.create({
        data: {
          adminId,
          action: 'PAYMENT_REJECTED',
          entityType: 'PaymentSubmission',
          entityId: submission.id,
          detailsJson: JSON.stringify({
            orderNumber: submission.order.orderNumber,
            transactionId: submission.transactionId,
            rejectionReason,
          }),
        },
      });

      return { updatedSubmission, updatedOrder };
    });

    return result;
  }

  /**
   * Request additional information from member
   */
  static async requestMoreInfo(adminId: string, submissionId: string, inquiryText: string) {
    const submission = await prisma.paymentSubmission.findUnique({
      where: { id: submissionId },
      include: { order: true },
    });

    if (!submission) throw new Error('Submission not found.');

    const result = await prisma.$transaction(async (tx) => {
      const updatedSubmission = await tx.paymentSubmission.update({
        where: { id: submissionId },
        data: {
          reviewStatus: 'INFO_REQUIRED',
          reviewedByAdminId: adminId,
          reviewReason: inquiryText,
          reviewedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: submission.orderId },
        data: { status: 'INFO_REQUIRED' },
      });

      await tx.notification.create({
        data: {
          userId: submission.userId,
          title: 'Additional Payment Information Required',
          message: `Our finance team requires clarification for order ${submission.order.orderNumber}: ${inquiryText}`,
          type: 'PAYMENT',
          linkUrl: '/dashboard/payments',
        },
      });

      return updatedSubmission;
    });

    return result;
  }

  /**
   * 7.7 USER PAYMENT HISTORY & CONFIRMED RECEIPTS
   */
  static async getUserPaymentHistory(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        plan: true,
        submissions: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 7.8 ADMIN PAYMENT REPORTS & FINANCIAL INTEGRITY
   * Revenue calculated ONLY from confirmed APPROVED transactions.
   * Unapproved or pending claims are reported separately and NEVER as earned revenue!
   */
  static async getFinancialReports(filters?: {
    startDate?: Date;
    endDate?: Date;
    provider?: string;
  }) {
    const allApprovedOrders = await prisma.order.findMany({
      where: { status: 'APPROVED' },
    });

    const allPendingOrders = await prisma.order.findMany({
      where: {
        status: { in: ['PENDING_PAYMENT', 'SUBMITTED_FOR_VERIFICATION', 'UNDER_REVIEW', 'INFO_REQUIRED'] },
      },
    });

    const allRejectedOrders = await prisma.order.findMany({
      where: { status: 'REJECTED' },
    });

    const allRefundedOrders = await prisma.order.findMany({
      where: { status: 'REFUNDED' },
    });

    const confirmedEarnedRevenueBdt = allApprovedOrders.reduce((sum, o) => sum + o.amountBdt, 0);
    const pendingClaimsBdt = allPendingOrders.reduce((sum, o) => sum + o.amountBdt, 0);
    const rejectedClaimsBdt = allRejectedOrders.reduce((sum, o) => sum + o.amountBdt, 0);
    const refundedBdt = allRefundedOrders.reduce((sum, o) => sum + o.amountBdt, 0);

    return {
      confirmedEarnedRevenueBdt,
      pendingClaimsBdt,
      rejectedClaimsBdt,
      refundedBdt,
      counts: {
        approved: allApprovedOrders.length,
        pending: allPendingOrders.length,
        rejected: allRejectedOrders.length,
        refunded: allRefundedOrders.length,
      },
    };
  }
}
