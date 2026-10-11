'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Upload,
} from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Payment Submission form state
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [amountSent, setAmountSent] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Initialize or retrieve order
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?redirect=/checkout?planId=${planId}`);
      return;
    }

    if (!planId) {
      router.push('/pricing');
      return;
    }

    const initOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        });
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
          setPaymentMethods(data.paymentMethods);
          if (data.paymentMethods.length > 0) {
            setSelectedMethod(data.paymentMethods[0]);
          }
          setAmountSent(String(data.order.amountBdt));
        } else {
          setErrorMessage(data.message || 'Failed to initialize order.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error initializing checkout.');
      } finally {
        setLoading(false);
      }
    };

    initOrder();
  }, [user, authLoading, planId, router]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!senderNumber || !transactionId || !amountSent) {
      setErrorMessage('Please fill in sender number, Transaction ID, and amount.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          provider: selectedMethod.provider,
          senderNumber,
          transactionId,
          amountSentBdt: Number(amountSent),
          receiptImageUrl: receiptUrl || undefined,
          userNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionSuccess(true);
      } else {
        setErrorMessage(data.message || 'Failed to submit payment details.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting payment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div className="max-w-3xl mx-auto py-24 text-center">Initializing secure order checkout...</div>;
  }

  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <Check className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
            {lang === 'bn' ? 'পেমেন্ট তথ্য সফলভাবে জমা হয়েছে!' : 'Payment Claim Submitted Successfully!'}
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted max-w-md mx-auto leading-relaxed">
            {lang === 'bn'
              ? `আপনার অর্ডার #${order.orderNumber}-এর জন্য TrxID: ${transactionId} সফলভাবে জমা পড়েছে। আমাদের ফাইন্যান্স টিম যাচাই করে দ্রুত মেম্বারশিপ সক্রিয় করবে।`
              : `Order #${order.orderNumber} with TrxID: ${transactionId} has been submitted for manual finance verification.`}
          </p>
        </div>

        <div className="bg-ivory-200 p-4 rounded-2xl border border-gold-400/30 max-w-sm mx-auto text-xs space-y-1 text-left">
          <p><span className="text-dark-muted">Order ID:</span> <span className="font-bold">{order.orderNumber}</span></p>
          <p><span className="text-dark-muted">Plan:</span> <span className="font-bold">{order.plan.nameEn} (৳{order.amountBdt})</span></p>
          <p><span className="text-dark-muted">Status:</span> <span className="font-bold text-amber-700">SUBMITTED FOR VERIFICATION</span></p>
        </div>

        <div className="pt-4 flex justify-center space-x-3">
          <button
            onClick={() => router.push('/dashboard/payments')}
            className="bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            {lang === 'bn' ? 'পেমেন্ট স্ট্যাটাস দেখুন' : 'View Payment Status'}
          </button>
        </div>
      </div>
    );
  }

  if (!order || !selectedMethod) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <p className="text-rose-600 font-semibold">{errorMessage || 'Could not load order.'}</p>
        <button onClick={() => router.push('/pricing')} className="text-maroon-800 underline text-xs">
          Return to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
          {lang === 'bn' ? 'ব্যক্তিগত একাউন্ট সেন্ড মানি চেকআউট' : 'Send Money Checkout'}
        </h1>
        <p className="text-xs sm:text-sm text-dark-muted">
          {lang === 'bn'
            ? 'প্রদত্ত নম্বরে সেন্ড মানি করে নিচের ফর্মে ট্রানজেকশন তথ্য সাবমিট করুন'
            : 'Complete Send Money transfer to the configured receiving account and submit details'}
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 7.2 Order Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-gold-400/40 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <div>
          <span className="text-[11px] text-dark-muted block">অর্ডার আইডি (Order ID)</span>
          <span className="font-mono font-bold text-maroon-900 text-sm">{order.orderNumber}</span>
        </div>
        <div>
          <span className="text-[11px] text-dark-muted block">নির্বাচিত প্যাকেজ</span>
          <span className="font-bold text-dark text-sm">{order.plan.nameBn}</span>
        </div>
        <div>
          <span className="text-[11px] text-dark-muted block">পরিশোধযোগ্য টাকা</span>
          <span className="font-extrabold text-maroon-800 text-xl">৳{order.amountBdt}</span>
        </div>
        <div>
          <span className="text-[11px] text-dark-muted block">বর্তমান স্ট্যাটাস</span>
          <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Submission
          </span>
        </div>
      </div>

      {/* Payment Provider Selector */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-dark uppercase tracking-wider font-bengali">
          পেমেন্ট মাধ্যম বেছে নিন (Select Provider)
        </label>
        <div className="grid grid-cols-3 gap-3">
          {paymentMethods.map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setSelectedMethod(pm)}
              className={`p-4 rounded-xl border text-center transition-all ${
                selectedMethod.id === pm.id
                  ? 'border-2 border-gold-500 bg-gold-50 shadow-md scale-102'
                  : 'border-slate-200 bg-white hover:border-gold-300'
              }`}
            >
              <span className="font-bold text-sm block font-bengali">{pm.displayNameBn}</span>
              <span className="text-[10px] text-dark-muted">{pm.accountType}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-Step Instructions & Account Copy Strip */}
      <div className="bg-gradient-to-r from-maroon-950 to-maroon-900 text-white rounded-2xl p-6 sm:p-8 border border-gold-400/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-maroon-800 pb-5">
          <div>
            <span className="text-gold-400 text-xs font-bold uppercase tracking-wider">
              {selectedMethod.displayNameEn} ({selectedMethod.accountType})
            </span>
            <h3 className="text-xl font-bold font-bengali mt-0.5">
              প্রাপক অ্যাকাউন্ট ও রেফারেন্স বিবরণ
            </h3>
          </div>
          <span className="bg-maroon-800 text-gold-300 text-xs font-semibold px-3 py-1 rounded-full border border-gold-500/30">
            ট্রানজেকশন টাইপ: {selectedMethod.transactionType}
          </span>
        </div>

        {/* Copyable Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Account Number */}
          <div className="bg-maroon-900/80 p-3.5 rounded-xl border border-gold-400/25 space-y-1">
            <span className="text-[11px] text-ivory-300 block">প্রাপক অ্যাকাউন্ট নম্বর</span>
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-gold-300 text-base">
                {selectedMethod.accountNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedMethod.accountNumber, 'account')}
                className="text-xs bg-gold-500 hover:bg-gold-600 text-maroon-950 px-2 py-1 rounded font-bold flex items-center space-x-1"
              >
                {copiedField === 'account' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'account' ? 'কপি!' : 'কপি'}</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-maroon-900/80 p-3.5 rounded-xl border border-gold-400/25 space-y-1">
            <span className="text-[11px] text-ivory-300 block">নির্দিষ্ট টাকার পরিমাণ</span>
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-gold-300 text-base">
                ৳{order.amountBdt}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(String(order.amountBdt), 'amount')}
                className="text-xs bg-gold-500 hover:bg-gold-600 text-maroon-950 px-2 py-1 rounded font-bold flex items-center space-x-1"
              >
                {copiedField === 'amount' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'amount' ? 'কপি!' : 'কপি'}</span>
              </button>
            </div>
          </div>

          {/* Order Reference */}
          <div className="bg-maroon-900/80 p-3.5 rounded-xl border border-gold-400/25 space-y-1">
            <span className="text-[11px] text-ivory-300 block">পেমেন্ট রেফারেন্স</span>
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-gold-300 text-xs truncate max-w-[140px]">
                {order.orderNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(order.orderNumber, 'ref')}
                className="text-xs bg-gold-500 hover:bg-gold-600 text-maroon-950 px-2 py-1 rounded font-bold flex items-center space-x-1"
              >
                {copiedField === 'ref' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'ref' ? 'কপি!' : 'কপি'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions Text */}
        <div className="bg-maroon-950/70 p-4 rounded-xl border border-maroon-800 text-xs text-ivory-200 space-y-2 whitespace-pre-line font-bengali leading-relaxed">
          <p className="font-bold text-gold-400">লেনদেনের নিয়মাবলী:</p>
          {lang === 'bn' ? selectedMethod.instructionsBn : selectedMethod.instructionsEn}
        </div>
      </div>

      {/* 7.3 Payment Submission Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-400/40 shadow-sm space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-xl font-bold text-dark font-bengali">
            লেনদেনের তথ্য জমা দিন (Submit Transaction Proof)
          </h3>
          <p className="text-xs text-dark-muted">
            টাকা পাঠানো সম্পন্ন হলে TrxID ও প্রেরক নম্বর দিয়ে ফর্মটি সাবমিট করুন
          </p>
        </div>

        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Phone */}
            <div>
              <label className="block text-xs font-bold text-dark mb-1 font-bengali">
                প্রেরক মোবাইল নম্বর (Sender Mobile Number) *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: 01711223344"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-maroon-600"
              />
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-bold text-dark mb-1 font-bengali">
                ট্রানজেকশন আইডি (Transaction ID / TrxID) *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: BK9X87TRQ1"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-maroon-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount Sent */}
            <div>
              <label className="block text-xs font-bold text-dark mb-1 font-bengali">
                প্রেরিত টাকার পরিমাণ (Amount Sent in BDT) *
              </label>
              <input
                type="number"
                required
                min={order.amountBdt}
                value={amountSent}
                onChange={(e) => setAmountSent(e.target.value)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-maroon-900 focus:ring-2 focus:ring-maroon-600"
              />
              <span className="text-[11px] text-dark-muted mt-0.5 block">
                অর্ডারের নির্ধারিত পরিমাণ: ৳{order.amountBdt}
              </span>
            </div>

            {/* Receipt URL / Screenshot attachment */}
            <div>
              <label className="block text-xs font-bold text-dark mb-1 font-bengali">
                রসিদের ছবি বা স্ক্রিনশট লিংক (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="https://... (বা ফাঁকা রাখুন)"
                value={receiptUrl}
                onChange={(e) => setReceiptUrl(e.target.value)}
                className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-maroon-600"
              />
            </div>
          </div>

          {/* User Notes */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1 font-bengali">
              অতিরিক্ত মন্তব্য (যদি থাকে)
            </label>
            <textarea
              rows={2}
              placeholder="পেমেন্ট সম্পর্কিত কোনো অতিরিক্ত নোট লিখুন..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-maroon-600"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-maroon-950 font-bold py-3 px-6 rounded-xl shadow-md text-sm transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>{submitting ? 'যাচাইয়ের জন্য পাঠানো হচ্ছে...' : 'পেমেন্ট ভেরিফিকেশনের জন্য জমা দিন'}</span>
              <ArrowRight className="w-4 h-4 text-maroon-950" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
