'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  TrendingUp,
  Clock,
  XCircle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Download,
} from 'lucide-react';

export default function FinancialReportsPage() {
  const { lang } = useLanguage();
  const [reports, setReports] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-dark-muted">Loading financial audit reports...</div>;
  }

  if (!reports) {
    return <div className="p-12 text-center text-xs text-rose-600">Failed to load reports.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark font-bengali">
            আর্থিক প্রতিবেদন ও রাজস্ব নিরীক্ষা (Financial & Revenue Reports)
          </h1>
          <p className="text-xs text-dark-muted">
            কঠোর অডিট নীতি: শুধুমাত্র নিশ্চিত অনুমোদিত লেনদেন থেকেই রাজস্ব গণনাকৃত
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-maroon-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>প্রতিবেদন ডাউনলোড / প্রিন্ট</span>
        </button>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Confirmed Earned Revenue */}
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              অনুমোদিত প্রকৃত রাজস্ব
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-900">
            ৳{reports.confirmedEarnedRevenueBdt.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">
            মোট {reports.counts.approved}টি সফল লেনদেন থেকে অর্জিত
          </p>
        </div>

        {/* Pending Claims */}
        <div className="bg-white rounded-2xl p-6 border border-amber-300 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              অপেক্ষমান দাবি (Pending)
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-900">
            ৳{reports.pendingClaimsBdt.toLocaleString()}
          </p>
          <p className="text-[11px] text-amber-700 font-medium">
            {reports.counts.pending}টি দাবি যাচাইাধীন (রাজস্বে অন্তর্ভূক্ত নয়)
          </p>
        </div>

        {/* Rejected Claims */}
        <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              বাতিলকৃত দাবি
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-900">
            ৳{reports.rejectedClaimsBdt.toLocaleString()}
          </p>
          <p className="text-[11px] text-rose-700 font-medium">
            মোট {reports.counts.rejected}টি ভুয়া বা ভুল দাবি প্রত্যাখ্যাত
          </p>
        </div>

        {/* Refunded */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              রিফান্ডকৃত লেনদেন
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">
            ৳{reports.refundedBdt.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-600 font-medium">
            মোট {reports.counts.refunded}টি ফেরত সম্পন্ন
          </p>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="bg-ivory-200 border border-gold-400/30 rounded-2xl p-6 text-xs text-dark-muted space-y-2">
        <h4 className="font-bold text-sm text-dark font-bengali flex items-center">
          <ShieldCheck className="w-4 h-4 text-maroon-800 mr-1.5" />
          হিসাবরক্ষণ ও আর্থিক সততা সংক্রান্ত বিধিসমূহ (Financial Integrity Principles)
        </h4>
        <p>1. <strong>Strict Earned Revenue Basis:</strong> কোনো অবস্থাতেই পেন্ডিং পেমেন্ট সাবমিশনকে অর্জিত রাজস্ব হিসেবে দেখানো হয় না।</p>
        <p>2. <strong>One-time Subscription Activation:</strong> একটি অনুমোদিত ট্রানজেকশন শুধুমাত্র একবারই সাবস্ক্রিপশন চালু করতে পারে।</p>
        <p>3. <strong>Audit Immutability:</strong> অনুমোদিত বা প্রত্যাখ্যাত কোনো ট্রানজেকশনের অডিট রেকর্ড মুছা যায় না।</p>
      </div>
    </div>
  );
}
