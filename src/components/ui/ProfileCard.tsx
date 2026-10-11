'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Lock,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';

interface ProfileCardProps {
  profile: any;
  onInterestSent?: () => void;
  onShortlistToggled?: (shortlisted: boolean) => void;
}

export default function ProfileCard({ profile, onInterestSent, onShortlistToggled }: ProfileCardProps) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [shortlisted, setShortlisted] = useState(false);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  const isBlurred = profile.isPhotoBlurred || profile.photoPrivacy === 'ON_REQUEST';
  const photoSrc =
    profile.profilePhoto ||
    (profile.gender === 'FEMALE'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80');

  const handleToggleShortlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await fetch('/api/shortlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ biodataId: profile.id }),
      });
      const data = await res.json();
      if (data.success) {
        setShortlisted(data.shortlisted);
        onShortlistToggled?.(data.shortlisted);
      }
    } catch {
      // ignore
    }
  };

  const handleSendQuickInterest = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setSendingInterest(true);
    try {
      const res = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: profile.userId }),
      });
      const data = await res.json();
      if (data.success) {
        setInterestSent(true);
        onInterestSent?.();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error sending interest');
    } finally {
      setSendingInterest(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#C8A45D]/25 flex flex-col group">
      {/* Photo & Badges Header */}
      <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
        <Image
          src={photoSrc}
          alt={profile.biodataNumber}
          fill
          className={`object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
            isBlurred ? 'blur-md scale-110' : ''
          }`}
          unoptimized
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-black/20" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-maroon-900/95 backdrop-blur-sm text-ivory text-xs font-bold px-2.5 py-1 rounded-full border border-gold-400/40 flex items-center shadow-sm font-bengali">
            {profile.gender === 'FEMALE' ? '🧕 পাত্রীর বায়োডাটা' : '👳‍♂️ পাত্রের বায়োডাটা'} | {profile.biodataNumber}
          </span>
          {profile.isVerified && (
            <span className="bg-emerald-700/90 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center shadow-sm">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-300" />
              {lang === 'bn' ? 'ভেরিফাইড' : 'Verified'}
            </span>
          )}
        </div>

        {/* Shortlist Heart Button */}
        <button
          onClick={handleToggleShortlist}
          title="Shortlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white text-maroon-700 shadow-md transition-all active:scale-95"
        >
          <Heart className={`w-4 h-4 ${shortlisted ? 'fill-maroon-700 text-maroon-700' : 'text-slate-600'}`} />
        </button>

        {/* Blurred photo badge indicator */}
        {isBlurred && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="w-10 h-10 rounded-full bg-dark/70 backdrop-blur-md flex items-center justify-center mb-1 border border-gold-400/40">
              <Lock className="w-4 h-4 text-gold-300" />
            </div>
            <p className="text-xs text-ivory-100 font-medium bg-dark/60 backdrop-blur-sm px-3 py-1 rounded-full">
              {lang === 'bn' ? 'অনুরোধ সাপেক্ষে ছবি দৃশ্যমান' : 'Photo Visible on Request'}
            </p>
          </div>
        )}

        {/* Bottom banner over photo: Compatibility score */}
        {profile.compatibilityScore !== undefined && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs">
            <span className="bg-gold-500/95 backdrop-blur-sm text-maroon-950 font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {profile.compatibilityScore}% {lang === 'bn' ? 'ম্যাচ' : 'Match'}
            </span>
            <span className="text-white text-xs font-semibold drop-shadow">
              {profile.age} {lang === 'bn' ? 'বছর' : 'Yrs'}, {Math.floor(profile.heightCm / 30.48)}&apos;{Math.round((profile.heightCm % 30.48) / 2.54)}&quot;
            </span>
          </div>
        )}
      </div>

      {/* Profile Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Location */}
          <div className="flex items-center text-xs text-dark-muted font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-maroon-700 flex-shrink-0" />
            <span>
              {profile.presentDistrict}, {profile.presentDivision} ({lang === 'bn' ? 'স্থায়ী' : 'Permanent'}: {profile.permanentDistrict})
            </span>
          </div>

          {/* Education */}
          <div className="flex items-center text-xs text-dark font-medium">
            <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-gold-600 flex-shrink-0" />
            <span className="truncate">
              {profile.educationLevel} {profile.educationField ? `- ${profile.educationField}` : ''}
            </span>
          </div>

          {/* Occupation */}
          <div className="flex items-center text-xs text-dark font-medium">
            <Briefcase className="w-3.5 h-3.5 mr-1.5 text-maroon-700 flex-shrink-0" />
            <span className="truncate">
              {profile.designation || profile.occupationCategory}
            </span>
          </div>

          {/* Religion / Practice Tag */}
          <div className="pt-1 flex flex-wrap gap-1.5">
            <span className="text-[11px] bg-ivory-300 text-maroon-900 px-2 py-0.5 rounded font-medium border border-gold-400/20">
              {profile.religion}
            </span>
            {profile.religiousAttire && profile.religiousAttire !== 'NONE' && (
              <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
                {profile.religiousAttire}
              </span>
            )}
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
              {profile.maritalStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
          <Link
            href={`/profiles/${profile.id}`}
            className="flex-1 bg-maroon-50 hover:bg-maroon-100 text-maroon-800 text-xs font-semibold py-2 px-3 rounded-lg border border-maroon-200 text-center transition-colors flex items-center justify-center space-x-1"
          >
            <span>{lang === 'bn' ? 'বায়োডাটা দেখুন' : 'View Profile'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSendQuickInterest}
            disabled={sendingInterest || interestSent}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1 ${
              interestSent
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-maroon-950 shadow-sm active:scale-95'
            }`}
          >
            <Send className="w-3 h-3" />
            <span>
              {interestSent
                ? lang === 'bn'
                  ? 'প্রেরিত'
                  : 'Sent'
                : lang === 'bn'
                ? 'আগ্রহ'
                : 'Interest'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
