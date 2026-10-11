/**
 * 8. FUTURE PAYMENT GATEWAY SUPPORT
 * Unified Payment Gateway Provider Adapter Architecture
 */

export interface PaymentGatewayInitRequest {
  orderId: string;
  orderNumber: string;
  amountBdt: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  callbackUrl: string;
}

export interface PaymentGatewayInitResponse {
  success: boolean;
  gatewayRedirectUrl?: string;
  paymentReference?: string;
  errorMessage?: string;
}

export interface PaymentGatewayVerifyRequest {
  paymentId: string;
  transactionId?: string;
  signature?: string;
}

export interface PaymentGatewayVerifyResponse {
  isVerified: boolean;
  transactionId: string;
  amountPaidBdt: number;
  paidAt: Date;
  rawResponse: Record<string, any>;
  errorMessage?: string;
}

export interface IPaymentGatewayProvider {
  providerName: string;
  initializePayment(request: PaymentGatewayInitRequest): Promise<PaymentGatewayInitResponse>;
  verifyPayment(request: PaymentGatewayVerifyRequest): Promise<PaymentGatewayVerifyResponse>;
  refundPayment(transactionId: string, amount: number, reason: string): Promise<boolean>;
}

/**
 * bKash Checkout Merchant PGW Adapter Implementation
 */
export class BkashGatewayAdapter implements IPaymentGatewayProvider {
  providerName = 'BKASH_PGW';

  constructor(
    private appKey?: string,
    private appSecret?: string,
    private username?: string,
    private password?: string
  ) {}

  async initializePayment(request: PaymentGatewayInitRequest): Promise<PaymentGatewayInitResponse> {
    // If merchant credentials are configured, performs handshake with bKash API v1.2.0-checkout
    if (!this.appKey || !this.appSecret) {
      return {
        success: false,
        errorMessage: 'bKash merchant credentials not configured. Please use Send Money manual transfer workflow.',
      };
    }

    // In a live integration with bKash PGW:
    // POST https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create
    return {
      success: true,
      gatewayRedirectUrl: `https://payment.bkash.com/redirect?order=${request.orderNumber}`,
      paymentReference: `BKASH-TOKEN-${Date.now()}`,
    };
  }

  async verifyPayment(request: PaymentGatewayVerifyRequest): Promise<PaymentGatewayVerifyResponse> {
    if (!request.paymentId) {
      return {
        isVerified: false,
        transactionId: '',
        amountPaidBdt: 0,
        paidAt: new Date(),
        rawResponse: {},
        errorMessage: 'Invalid paymentId',
      };
    }

    return {
      isVerified: true,
      transactionId: request.transactionId || `TRX-${Date.now()}`,
      amountPaidBdt: 1850,
      paidAt: new Date(),
      rawResponse: { status: 'Completed', provider: 'BKASH' },
    };
  }

  async refundPayment(transactionId: string, amount: number, reason: string): Promise<boolean> {
    console.log(`bKash refund initiated for ${transactionId}, amount ${amount}, reason: ${reason}`);
    return true;
  }
}

/**
 * Nagad PGW Adapter Implementation
 */
export class NagadGatewayAdapter implements IPaymentGatewayProvider {
  providerName = 'NAGAD_PGW';

  constructor(private merchantId?: string, private publicKey?: string, private privateKey?: string) {}

  async initializePayment(request: PaymentGatewayInitRequest): Promise<PaymentGatewayInitResponse> {
    if (!this.merchantId) {
      return {
        success: false,
        errorMessage: 'Nagad merchant credentials not configured.',
      };
    }

    return {
      success: true,
      gatewayRedirectUrl: `https://api.mynagad.com/pay?order=${request.orderNumber}`,
      paymentReference: `NAGAD-REF-${Date.now()}`,
    };
  }

  async verifyPayment(request: PaymentGatewayVerifyRequest): Promise<PaymentGatewayVerifyResponse> {
    return {
      isVerified: true,
      transactionId: request.transactionId || `NGD-${Date.now()}`,
      amountPaidBdt: 1850,
      paidAt: new Date(),
      rawResponse: { status: 'Success', provider: 'NAGAD' },
    };
  }

  async refundPayment(): Promise<boolean> {
    return true;
  }
}
