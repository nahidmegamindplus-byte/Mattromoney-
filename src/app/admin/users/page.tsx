'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Search, Shield, Ban, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const { lang } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to change status to ${nextStatus}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error updating user status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark font-bengali">
            ইউজার ও সদস্য ব্যবস্থাপনা (User Moderation)
          </h1>
          <p className="text-xs text-dark-muted">
            সদস্যদের প্রোফাইল স্ট্যাটাস, সাসপেনশন ও প্রশাসনিক ভূমিকা পরিচালনা করুন
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="নাম, ইমেইল বা ফোন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs"
          />
          <button type="submit" className="bg-maroon-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs">
            সার্চ
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gold-400/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-200 border-b border-gold-400/20 text-maroon-900 uppercase font-bold">
                <tr>
                  <th className="p-4">নাম ও যোগাযোগ</th>
                  <th className="p-4">বায়োডাটা</th>
                  <th className="p-4">সক্রিয় মেম্বারশিপ</th>
                  <th className="p-4">ভূমিকা (Role)</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => {
                  const sub = u.subscriptions[0];
                  return (
                    <tr key={u.id} className="hover:bg-ivory-50/70">
                      <td className="p-4">
                        <span className="font-bold text-dark block text-sm">{u.name}</span>
                        <span className="text-[11px] text-dark-muted">{u.email}</span>
                        <span className="text-[10px] text-dark-muted block font-mono">{u.phone}</span>
                      </td>
                      <td className="p-4">
                        {u.biodata ? (
                          <span className="font-mono text-xs font-bold text-maroon-900 bg-ivory-200 px-2 py-0.5 rounded">
                            {u.biodata.biodataNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">বায়োডাটা নেই</span>
                        )}
                      </td>
                      <td className="p-4">
                        {sub ? (
                          <span className="bg-gold-100 text-maroon-900 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            {sub.plan.nameEn}
                          </span>
                        ) : (
                          <span className="text-slate-400">ফ্রি</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 font-bold px-2 py-0.5 rounded text-[10px]">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.status === 'ACTIVE' ? (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 border border-rose-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            SUSPENDED
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'সাসপেন্ড করুন' : 'আনব্যান করুন'}
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
    </div>
  );
}
