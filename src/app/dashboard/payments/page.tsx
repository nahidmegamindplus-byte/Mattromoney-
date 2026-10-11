'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';

export default function UserPaymentsPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
            Approved & Active
          </span>
        );
      case 'SUBMITTED_FOR_VERIFICATION':
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-700" />
            Under Verification
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-700" />
            Rejected
          </span>
        );
      case 'INFO_REQUIRED':
        return (
          <span className="inline-flex items-center text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-300">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-purple-700" />
            Action Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
            Awaiting Payment
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
            {lang === 'bn' ? 'পেমেন্ট ও মেম্বারশিপ ইতিহাস' : 'Payments & Invoices'}
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            {lang === 'bn'
              ? 'আপনার সকল প্রিমিয়াম অর্ডার, ভেরিফিকেশন স্ট্যাটাস ও রসিদসমূহ'
              : 'Track your pending Send Money claims, approved subscriptions, and official receipts'}
          </p>
        </div>

        <Link
          href="/pricing"
          className="bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          {lang === 'bn' ? 'নতুন প্যাকেজ কিনুন' : 'Upgrade Membership'}
        </Link>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gold-400/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-dark-muted">Loading payment records...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard className="w-8 h-8 text-gold-500 mx-auto" />
            <p className="text-sm font-semibold text-dark">কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি</p>
            <Link href="/pricing" className="text-xs text-maroon-800 font-bold underline">
              প্যাকেজসমূহ দেখুন
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-200 border-b border-gold-400/20 text-maroon-900 uppercase font-bold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">প্যাকেজ</th>
                  <th className="p-4">টাকার পরিমাণ</th>
                  <th className="p-4">TrxID / মাধ্যম</th>
                  <th className="p-4">তারিখ</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4 text-right">রসিদ / অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((o) => {
                  const submission = o.submissions[0];
                  return (
                    <tr key={o.id} className="hover:bg-ivory-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-maroon-900">{o.orderNumber}</td>
                      <td className="p-4 font-bold">{o.plan.nameBn}</td>
                      <td className="p-4 font-extrabold text-maroon-800">৳{o.amountBdt}</td>
                      <td className="p-4">
                        {submission ? (
                          <div>
                            <span className="font-mono font-semibold uppercase">{submission.transactionId}</span>
                            <span className="block text-[10px] text-dark-muted">{submission.provider}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Not submitted</span>
                        )}
                      </td>
                      <td className="p-4 text-dark-muted">
                        {new Date(o.createdAt).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="p-4">{getStatusBadge(o.status)}</td>
                      <td className="p-4 text-right">
                        {o.status === 'APPROVED' ? (
                          <button
                            onClick={() => setSelectedReceipt(o)}
                            className="inline-flex items-center space-x-1 bg-maroon-50 hover:bg-maroon-100 text-maroon-800 px-3 py-1.5 rounded-lg border border-maroon-200 font-bold transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>রসিদ</span>
                          </button>
                        ) : o.status === 'PENDING_PAYMENT' ? (
                          <Link
                            href={`/checkout?planId=${o.planId}`}
                            className="inline-flex items-center space-x-1 bg-gold-500 hover:bg-gold-600 text-maroon-950 px-3 py-1.5 rounded-lg font-bold"
                          >
                            <span>পেমেন্ট করুন</span>
                          </Link>
                        ) : (
                          <button
                            onClick={() => setSelectedReceipt(o)}
                            className="text-xs text-dark-muted hover:underline"
                          >
                            বিস্তারিত
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7.7 Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-gold-400 space-y-6">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-dark rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="text-center space-y-1 border-b pb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-500 to-amber-200 flex items-center justify-center mx-auto mb-1">
                <ShieldCheck className="w-6 h-6 text-maroon-900" />
              </div>
              <h3 className="text-xl font-bold text-maroon-900 font-bengali">আমারবন্ধন ম্যাট্রিমনি</h3>
              <p className="text-[11px] text-dark-muted">অফিসিয়াল মেম্বারশিপ পেমেন্ট ভাউচার ও রসিদ</p>
              {selectedReceipt.status === 'APPROVED' ? (
                <div className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full border border-emerald-300 mt-2">
                  ✓ VERIFIED & APPROVED INVOICE
                </div>
              ) : (
                <div className="inline-block bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-0.5 rounded-full border border-amber-300 mt-2">
                  PENDING CLAIM (NOT A PAYMENT CONFIRMATION)
                </div>
              )}
            </div>

            {/* Receipt Details Table */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-dark-muted">Order Number:</span>
                <span className="font-mono font-bold text-dark">{selectedReceipt.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-dark-muted">Membership Tier:</span>
                <span className="font-bold text-dark">{selectedReceipt.plan.nameEn} ({selectedReceipt.plan.durationDays} Days)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-dark-muted">Verified Amount:</span>
                <span className="font-extrabold text-maroon-800 text-sm">৳{selectedReceipt.amountBdt}</span>
              </div>
              {selectedReceipt.submissions[0] && (
                <>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-dark-muted">Payment Provider:</span>
                    <span className="font-bold text-dark">{selectedReceipt.submissions[0].provider}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-dark-muted">Sender Account:</span>
                    <span className="font-mono text-dark">{selectedReceipt.submissions[0].senderNumber}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-dark-muted">Transaction ID (TrxID):</span>
                    <span className="font-mono font-bold text-maroon-900">{selectedReceipt.submissions[0].transactionId}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-dark-muted">Submission Date:</span>
                    <span>{new Date(selectedReceipt.submissions[0].paymentTimestamp).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Printable stamp */}
            <div className="pt-2 flex justify-between items-center text-[10px] text-dark-muted border-t">
              <span>AmarBondhon Finance Department</span>
              <button
                onClick={() => window.print()}
                className="bg-maroon-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
