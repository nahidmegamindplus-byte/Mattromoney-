'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Heart,
  Send,
  Phone,
  MessageSquare,
  Video,
  Lock,
  Unlock,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function ProfileDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { user, activeSubscription } = useAuth();

  const [biodata, setBiodata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [unlockingContact, setUnlockingContact] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/biodata/${id}`);
      const data = await res.json();
      if (data.success && data.biodata) {
        setBiodata(data.biodata);
        if (!data.biodata.isGuardianContactLocked) {
          setContactUnlocked(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const handleUnlockContact = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!activeSubscription || activeSubscription.biodataAccessRemaining <= 0) {
      router.push('/pricing');
      return;
    }

    setUnlockingContact(true);
    try {
      const res = await fetch('/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ biodataId: biodata.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Guardian contact unlocked successfully using your membership quota!');
        fetchProfile();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Failed to unlock contact');
    } finally {
      setUnlockingContact(false);
    }
  };

  const handleSendInterest = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: biodata.userId, message: 'Interested in your biodata.' }),
      });
      const data = await res.json();
      if (data.success) {
        setInterestSent(true);
        alert('Interest request sent successfully!');
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error sending interest');
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-24 text-center">Loading biodata details...</div>;
  }

  if (!biodata) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">Biodata not found</h2>
        <Link href="/search" className="text-maroon-700 font-semibold underline">
          Back to Search
        </Link>
      </div>
    );
  }

  const isBlurred = biodata.isPhotoBlurred && !contactUnlocked;
  const photoSrc =
    biodata.profilePhoto ||
    (biodata.gender === 'FEMALE'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top back button */}
      <div>
        <Link
          href="/search"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-maroon-800 hover:text-maroon-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'সকল বায়োডাটায় ফিরে যান' : 'Back to Search Profiles'}</span>
        </Link>
      </div>

      {/* Main Biodata Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-400/35 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Photo Column */}
        <div className="relative h-72 rounded-2xl overflow-hidden border border-gold-400/30 bg-slate-100 shadow-inner">
          <Image
            src={photoSrc}
            alt={biodata.biodataNumber}
            fill
            className={`object-cover object-top ${isBlurred ? 'blur-md scale-110' : ''}`}
            unoptimized
          />
          {isBlurred && (
            <div className="absolute inset-0 bg-dark/50 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
              <Lock className="w-8 h-8 text-gold-400 mb-2" />
              <p className="text-xs text-ivory font-medium">
                {lang === 'bn'
                  ? 'গোপনীয়তার স্বার্থে ছবিটি অন-রিকোয়েস্ট রাখা হয়েছে'
                  : 'Photo protected by privacy settings'}
              </p>
            </div>
          )}
        </div>

        {/* Core Attributes */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-maroon-800 text-white font-bold text-sm px-3.5 py-1 rounded-full shadow">
              {biodata.biodataNumber}
            </span>
            {biodata.isVerified && (
              <span className="bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center shadow">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {lang === 'bn' ? 'এনআইডি ও পরিচয় ভেরিফাইড' : 'NID Verified'}
              </span>
            )}
            <span className="text-xs bg-ivory-300 text-maroon-900 font-semibold px-2.5 py-1 rounded-full">
              {biodata.gender === 'FEMALE' ? 'পাত্রীর বায়োডাটা' : 'পাত্রের বায়োডাটা'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
            {biodata.occupationCategory} - {biodata.designation || 'পেশাজীবী'}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-dark">
            <div className="bg-ivory-200 p-2.5 rounded-xl border border-gold-400/20">
              <span className="text-dark-muted block">বয়স ও উচ্চতা</span>
              <span className="font-bold text-maroon-900">
                {biodata.age} বছর, {Math.floor(biodata.heightCm / 30.48)}&apos;{Math.round((biodata.heightCm % 30.48) / 2.54)}&quot;
              </span>
            </div>

            <div className="bg-ivory-200 p-2.5 rounded-xl border border-gold-400/20">
              <span className="text-dark-muted block">বৈবাহিক অবস্থা</span>
              <span className="font-bold text-maroon-900">{biodata.maritalStatus.replace('_', ' ')}</span>
            </div>

            <div className="bg-ivory-200 p-2.5 rounded-xl border border-gold-400/20">
              <span className="text-dark-muted block">ধর্ম ও অনুশাসন</span>
              <span className="font-bold text-maroon-900">{biodata.religion} ({biodata.prayerFrequency || 'নিয়মিত'})</span>
            </div>

            <div className="bg-ivory-200 p-2.5 rounded-xl border border-gold-400/20">
              <span className="text-dark-muted block">বর্তমান জেলা</span>
              <span className="font-bold text-maroon-900">{biodata.presentDistrict}</span>
            </div>

            <div className="bg-ivory-200 p-2.5 rounded-xl border border-gold-400/20">
              <span className="text-dark-muted block">স্থায়ী জেলা</span>
              <span className="font-bold text-maroon-900">{biodata.permanentDistrict}</span>
            </div>

            <div className="bg-ivory-200 p-2.5 rounded-xl border border-gold-400/20">
              <span className="text-dark-muted block">গায়ের রঙ ও রক্ত</span>
              <span className="font-bold text-maroon-900">{biodata.complexion}, {biodata.bloodGroup || 'N/A'}</span>
            </div>
          </div>

          {/* Quick Action Buttons Bar */}
          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              onClick={handleSendInterest}
              disabled={interestSent}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 ${
                interestSent
                  ? 'bg-emerald-700 text-white'
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-maroon-950'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{interestSent ? 'আগ্রহ পাঠানো হয়েছে' : 'আগ্রহ প্রকাশ করুন'}</span>
            </button>

            {/* Direct Chat (For Gold/Platinum) */}
            <Link
              href={`/dashboard/chat?partnerId=${biodata.userId}`}
              className="bg-maroon-800 hover:bg-maroon-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
              <span>নিরাপদ চ্যাট</span>
            </Link>

            {/* Direct Video Call */}
            <button
              onClick={() => router.push(`/call/AB-ROOM-${Date.now()}`)}
              className="bg-maroon-900 hover:bg-black text-ivory px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-gold-400/30 transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-gold-400" />
              <span>ভিডিও কল</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guardian Contact Protection Box */}
      <div className="bg-gradient-to-r from-maroon-950 to-maroon-900 text-white rounded-2xl p-6 border border-gold-400/40 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-base font-bengali">অভিভাবকের সরাসরি যোগাযোগ নম্বর</h3>
          </div>
          <p className="text-xs text-ivory-300">
            {contactUnlocked
              ? 'যোগাযোগ নম্বর অনুমোদিত ও দৃশ্যমান:'
              : 'অযাচিত কল প্রতিরোধে অভিভাবকের নম্বর সুরক্ষিত। প্রিমিয়াম মেম্বারশিপ দিয়ে আনলক করুন।'}
          </p>
          <div className="pt-1">
            <span className="text-lg font-mono font-bold tracking-wider text-gold-300 bg-maroon-900/90 px-3 py-1 rounded-lg border border-gold-400/30 inline-block">
              {biodata.guardianContactPhone} ({biodata.guardianContactRelation || 'অভিভাবক'})
            </span>
          </div>
        </div>

        {!contactUnlocked && (
          <button
            onClick={handleUnlockContact}
            disabled={unlockingContact}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-maroon-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Unlock className="w-4 h-4 text-maroon-950" />
            <span>{unlockingContact ? 'আনলক হচ্ছে...' : 'অভিভাবকের নম্বর দেখুন'}</span>
          </button>
        )}
      </div>

      {/* Structured Biodata Breakdown Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education & Career */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-dark border-b pb-2 flex items-center font-bengali">
            <GraduationCap className="w-5 h-5 mr-2 text-maroon-700" />
            শিক্ষাগত ও পেশাগত বিবরণ
          </h3>
          <div className="space-y-2.5 text-xs text-dark">
            <div>
              <span className="text-dark-muted block">সর্বোচ্চ শিক্ষাগত যোগ্যতা:</span>
              <span className="font-semibold">{biodata.educationLevel}</span>
            </div>
            <div>
              <span className="text-dark-muted block">বিভাগ বা বিষয়:</span>
              <span className="font-semibold">{biodata.educationField || 'সাধারণ'}</span>
            </div>
            <div>
              <span className="text-dark-muted block">শিক্ষা প্রতিষ্ঠানের নাম:</span>
              <span className="font-semibold">{biodata.instituteName || 'উল্লেখ নেই'}</span>
            </div>
            <div>
              <span className="text-dark-muted block">বর্তমান পেশা ও পদবী:</span>
              <span className="font-semibold">{biodata.designation} ({biodata.occupationCategory})</span>
            </div>
            <div>
              <span className="text-dark-muted block">প্রতিষ্ঠানের নাম:</span>
              <span className="font-semibold">{biodata.companyName || 'গোপনীয়'}</span>
            </div>
            <div>
              <span className="text-dark-muted block">বার্ষিক আনুমানিক আয়:</span>
              <span className="font-semibold text-emerald-800">{biodata.annualIncomeRange || 'আলোচনা সাপেক্ষে'}</span>
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-dark border-b pb-2 flex items-center font-bengali">
            <Users className="w-5 h-5 mr-2 text-maroon-700" />
            পারিবারিক পটভূমি
          </h3>
          <div className="space-y-2.5 text-xs text-dark">
            <div>
              <span className="text-dark-muted block">পিতার পেশা:</span>
              <span className="font-semibold">{biodata.fatherProfession || 'জীবিত'}</span>
            </div>
            <div>
              <span className="text-dark-muted block">মাতার পেশা:</span>
              <span className="font-semibold">{biodata.motherProfession || 'গৃহিণী'}</span>
            </div>
            <div>
              <span className="text-dark-muted block">ভাই ও বোনের সংখ্যা:</span>
              <span className="font-semibold">
                ভাই: {biodata.brothersCount} জন, বোন: {biodata.sistersCount} জন
              </span>
            </div>
            <div>
              <span className="text-dark-muted block">পারিবারিক মূল্যবোধ ও সামাজিক মর্যাদা:</span>
              <span className="font-semibold">{biodata.familyValues}, {biodata.familyFinancialStatus}</span>
            </div>
            {biodata.familyBackgroundNote && (
              <div>
                <span className="text-dark-muted block">পরিবার সম্পর্কে বিশেষ তথ্য:</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-ivory-100 p-2.5 rounded-lg">
                  {biodata.familyBackgroundNote}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Religious Practice & Lifestyle */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-dark border-b pb-2 flex items-center font-bengali">
            <Sparkles className="w-5 h-5 mr-2 text-gold-600" />
            ধর্মীয় জীবনধারা ও ব্যক্তিত্ব
          </h3>
          <div className="space-y-2.5 text-xs text-dark">
            <div>
              <span className="text-dark-muted block">সালাত / নামাজের নিয়মিততা:</span>
              <span className="font-semibold">{biodata.prayerFrequency || 'সবসময় ৫ ওয়াক্ত'}</span>
            </div>
            <div>
              <span className="text-dark-muted block">শরীয়াহ সম্মত পোশাক (দাড়ি/হিজাব):</span>
              <span className="font-semibold">{biodata.religiousAttire || 'পাশ্চাত্য/শালীন পোশাক'}</span>
            </div>
            {biodata.aboutMe && (
              <div>
                <span className="text-dark-muted block">ব্যক্তিগত সংক্ষিপ্ত বিবরণ:</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-ivory-100 p-2.5 rounded-lg">
                  {biodata.aboutMe}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Expected Partner Characteristics */}
        <div className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-dark border-b pb-2 flex items-center font-bengali">
            <Heart className="w-5 h-5 mr-2 text-maroon-700" />
            যেমন জীবনসঙ্গী প্রত্যাশা করেন
          </h3>
          <div className="space-y-2.5 text-xs text-dark">
            <div>
              <span className="text-dark-muted block">প্রত্যাশিত বয়সসীমা:</span>
              <span className="font-semibold">
                {biodata.partnerMinAge} থেকে {biodata.partnerMaxAge} বছর
              </span>
            </div>
            <div>
              <span className="text-dark-muted block">প্রত্যাশিত উচ্চতা:</span>
              <span className="font-semibold">
                {Math.floor(biodata.partnerMinHeightCm / 30.48)}&apos;{Math.round((biodata.partnerMinHeightCm % 30.48) / 2.54)}&quot; - {Math.floor(biodata.partnerMaxHeightCm / 30.48)}&apos;{Math.round((biodata.partnerMaxHeightCm % 30.48) / 2.54)}&quot;
              </span>
            </div>
            <div>
              <span className="text-dark-muted block">প্রত্যাশিত শিক্ষা ও পেশা:</span>
              <span className="font-semibold">{biodata.partnerEducation || 'যেকোনো'}, {biodata.partnerProfession || 'যেকোনো'}</span>
            </div>
            {biodata.partnerExpectations && (
              <div>
                <span className="text-dark-muted block">জীবনসঙ্গী সম্পর্কে বিস্তারিত প্রত্যাশা:</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-ivory-100 p-2.5 rounded-lg">
                  {biodata.partnerExpectations}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
