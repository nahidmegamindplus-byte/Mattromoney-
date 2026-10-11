'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  AlertTriangle,
  Check,
  X,
  Eye,
  Clock,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
} from 'lucide-react';

export default function ManualPaymentVerificationPage() {
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('SUBMITTED_FOR_VERIFICATION');
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'REQUEST_INFO' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/queue?status=${filterStatus}`);
      const data = await res.json();
      if (data.success) {
        setQueue(data.queue);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [filterStatus]);

  const handleExecuteAction = async () => {
    if (!actionType || !selectedSubmission) return;

    if (actionType === 'REJECT' && (!rejectionReason || rejectionReason.trim().length < 5)) {
      alert('A detailed rejection reason is required.');
      return;
    }

    setProcessing(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/payments/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          submissionId: selectedSubmission.id,
          reason: actionType === 'REJECT' ? rejectionReason : adminNotes,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        setSelectedSubmission(null);
        setActionType(null);
        setAdminNotes('');
        setRejectionReason('');
        fetchQueue();
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Action failed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error executing action.' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark font-bengali">
            ম্যানুয়াল পেমেন্ট যাচাইকরণ (Manual Payment Verification)
          </h1>
          <p className="text-xs text-dark-muted">
            বিকাশ, নগদ ও রকেট সেন্ড মানি লেনদেনসমূহ ক্রস-চেক করে মেম্বারশিপ সক্রিয় করুন
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('SUBMITTED_FOR_VERIFICATION')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'SUBMITTED_FOR_VERIFICATION'
                ? 'bg-amber-600 text-white'
                : 'text-dark hover:bg-slate-100'
            }`}
          >
            Pending Claims
          </button>
          <button
            onClick={() => setFilterStatus('APPROVED')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'APPROVED' ? 'bg-emerald-600 text-white' : 'text-dark hover:bg-slate-100'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus('REJECTED')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'REJECTED' ? 'bg-rose-600 text-white' : 'text-dark hover:bg-slate-100'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-rose-50 text-rose-800 border border-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Verification Queue Table */}
      <div className="bg-white rounded-2xl border border-gold-400/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-dark-muted">Loading payment verification queue...</div>
        ) : queue.length === 0 ? (
          <div className="p-12 text-center space-y-2 text-xs text-dark-muted">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-semibold text-dark text-sm">কোনো পেন্ডিং পেমেন্ট দাবি অবশিষ্ট নেই</p>
            <p>সকল লেনদেন যাচাই সম্পন্ন হয়েছে।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-200 border-b border-gold-400/20 text-maroon-900 font-bold uppercase">
                <tr>
                  <th className="p-4">Order & Member</th>
                  <th className="p-4">প্যাকেজ</th>
                  <th className="p-4">নির্ধারিত / প্রেরিত টাকা</th>
                  <th className="p-4">মাধ্যম ও প্রেরক</th>
                  <th className="p-4">Transaction ID (TrxID)</th>
                  <th className="p-4">রিস্ক স্ট্যাটাস</th>
                  <th className="p-4 text-right">পদক্ষেপ (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {queue.map((sub) => {
                  const amountMismatch = sub.amountSentBdt < sub.order.amountBdt;
                  return (
                    <tr key={sub.id} className="hover:bg-ivory-50/70 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-maroon-900 block">{sub.order.orderNumber}</span>
                        <span className="text-dark font-semibold block">{sub.user.name}</span>
                        <span className="text-[10px] text-dark-muted">{sub.user.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold block">{sub.order.plan.nameBn}</span>
                        <span className="text-[10px] text-dark-muted">{sub.order.plan.durationDays} Days</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-dark">৳{sub.amountSentBdt}</span>
                          <span className="text-dark-muted text-[10px]">/ ৳{sub.order.amountBdt}</span>
                        </div>
                        {amountMismatch && (
                          <span className="text-[10px] text-rose-600 font-bold block">কম টাকা পাঠানো হয়েছে!</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-bold block text-maroon-800">{sub.provider}</span>
                        <span className="font-mono text-dark-muted">{sub.senderNumber}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-extrabold text-sm text-dark bg-slate-100 px-2 py-0.5 rounded border">
                          {sub.transactionId}
                        </span>
                      </td>
                      <td className="p-4">
                        {sub.duplicateRisk ? (
                          <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            DUPLICATE CLAIM
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setActionType('APPROVE');
                          }}
                          className="bg-maroon-800 hover:bg-maroon-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm"
                        >
                          যাচাই করুন
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspection & Action Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-gold-400 space-y-6">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-dark rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-4">
              <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">
                Finance Verification Inspector
              </span>
              <h3 className="text-xl font-bold text-dark font-bengali">
                লেনদেন নিরীক্ষণ ও চূড়ান্ত অনুমোদন
              </h3>
            </div>

            {/* Submission Specs Box */}
            <div className="bg-ivory-100 p-4 rounded-xl border border-gold-400/25 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-dark-muted block">অর্ডার নম্বর:</span>
                <span className="font-mono font-bold text-maroon-900">{selectedSubmission.order.orderNumber}</span>
              </div>
              <div>
                <span className="text-dark-muted block">গ্রাহকের নাম:</span>
                <span className="font-bold text-dark">{selectedSubmission.user.name} ({selectedSubmission.user.phone})</span>
              </div>
              <div>
                <span className="text-dark-muted block">প্যাকেজ ও মূল্য:</span>
                <span className="font-bold">{selectedSubmission.order.plan.nameEn} (৳{selectedSubmission.order.amountBdt})</span>
              </div>
              <div>
                <span className="text-dark-muted block">প্রেরিত টাকা:</span>
                <span className="font-extrabold text-maroon-800 text-sm">৳{selectedSubmission.amountSentBdt}</span>
              </div>
              <div>
                <span className="text-dark-muted block">পেমেন্ট মাধ্যম:</span>
                <span className="font-bold text-dark">{selectedSubmission.provider}</span>
              </div>
              <div>
                <span className="text-dark-muted block">প্রেরক নম্বর:</span>
                <span className="font-mono font-bold">{selectedSubmission.senderNumber}</span>
              </div>
              <div className="col-span-2">
                <span className="text-dark-muted block">Transaction ID (TrxID):</span>
                <span className="font-mono font-extrabold text-sm text-maroon-900 bg-white p-1 rounded border inline-block">
                  {selectedSubmission.transactionId}
                </span>
              </div>
              {selectedSubmission.userNotes && (
                <div className="col-span-2">
                  <span className="text-dark-muted block">গ্রাহকের মন্তব্য:</span>
                  <p className="bg-white p-2 rounded text-slate-700 italic">{selectedSubmission.userNotes}</p>
                </div>
              )}
            </div>

            {/* Action selector tabs */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-dark font-bengali">
                প্রশাসনিক সিদ্ধান্ত গ্রহণ করুন:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('APPROVE')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 border ${
                    actionType === 'APPROVE'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                      : 'bg-white border-slate-200 text-dark hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType('REJECT')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 border ${
                    actionType === 'REJECT'
                      ? 'bg-rose-600 text-white border-rose-600 shadow'
                      : 'bg-white border-slate-200 text-dark hover:bg-slate-50'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType('REQUEST_INFO')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 border ${
                    actionType === 'REQUEST_INFO'
                      ? 'bg-purple-600 text-white border-purple-600 shadow'
                      : 'bg-white border-slate-200 text-dark hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask Info</span>
                </button>
              </div>
            </div>

            {/* Input field based on action */}
            {actionType === 'APPROVE' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-dark font-bengali">
                  অভ্যন্তরীণ নোট (Internal Verification Note):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: Verified against receiving bKash account statement."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-ivory-100 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>
            )}

            {actionType === 'REJECT' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-rose-800 font-bengali">
                  বাতিলের সুনির্দিষ্ট কারণ (Rejection Reason - Required) *:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="যেমন: প্রদত্ত TrxID আমাদের বিকাশ স্টেটমেন্টে পাওয়া যায়নি / টাকার পরিমাণ মেলেনি।"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-rose-50 border border-rose-300 rounded-xl p-2.5 text-xs text-rose-900"
                />
              </div>
            )}

            {actionType === 'REQUEST_INFO' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-purple-800 font-bengali">
                  গ্রাহকের কাছে বিস্তারিত তথ্য চাওয়ার বার্তা *:
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: অনুগ্রহ করে বিকাশ অ্যাপের লেনদেনের পরিষ্কার স্ক্রিনশট প্রদান করুন।"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-purple-50 border border-purple-300 rounded-xl p-2.5 text-xs text-purple-900"
                />
              </div>
            )}

            {/* Execution Buttons */}
            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-dark hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={processing}
                className={`px-6 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'REJECT'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {processing ? 'প্রক্রিয়াধীন...' : 'নিশ্চিত করুন (Confirm Decision)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
