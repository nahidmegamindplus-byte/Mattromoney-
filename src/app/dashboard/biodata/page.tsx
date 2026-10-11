'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  CheckCircle2,
  Save,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Heart,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function BiodataWizardPage() {
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<any>({
    profileCreatedFor: 'SELF',
    maritalConsentGiven: true,
    gender: 'MALE',
    dateOfBirth: '1998-01-01',
    maritalStatus: 'NEVER_MARRIED',
    heightCm: 172,
    weightKg: 68,
    complexion: 'FAIR',
    bloodGroup: 'B+',
    religion: 'ISLAM',
    religiousDenomination: 'SUNNI',
    prayerFrequency: 'ALWAYS_5_TIMES',
    religiousAttire: 'NONE',
    presentDivision: 'Dhaka',
    presentDistrict: 'Dhaka',
    presentUpazila: 'Gulshan',
    permanentDivision: 'Chittagong',
    permanentDistrict: 'Comilla',
    permanentUpazila: 'Kotwali',
    educationLevel: 'GRADUATE',
    educationField: 'CSE',
    instituteName: 'BUET',
    occupationCategory: 'ENGINEER',
    designation: 'Software Engineer',
    companyName: '',
    annualIncomeRange: 'LAKH_6_TO_12',
    familyValues: 'ISLAMIC_PRACTICING',
    fatherAlive: true,
    fatherProfession: 'Retired Officer',
    motherAlive: true,
    motherProfession: 'Homemaker',
    brothersCount: 1,
    sistersCount: 1,
    familyFinancialStatus: 'UPPER_MIDDLE',
    familyBackgroundNote: '',
    aboutMe: 'Practicing Muslim, calm-natured and family oriented.',
    partnerMinAge: 20,
    partnerMaxAge: 28,
    partnerMinHeightCm: 155,
    partnerMaxHeightCm: 172,
    partnerMaritalStatus: 'NEVER_MARRIED',
    partnerExpectations: 'Looking for a religious, well-mannered partner.',
    profilePhoto: '',
    photoPrivacy: 'REGISTERED_ONLY',
    guardianContactPhone: '01711223344',
    guardianContactRelation: 'Father',
  });

  useEffect(() => {
    const fetchBiodata = async () => {
      try {
        const res = await fetch('/api/biodata');
        const data = await res.json();
        if (data.success && data.biodata) {
          setFormData({
            ...data.biodata,
            dateOfBirth: data.biodata.dateOfBirth
              ? new Date(data.biodata.dateOfBirth).toISOString().split('T')[0]
              : '1998-01-01',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBiodata();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      const res = await fetch('/api/biodata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage(data.message || 'Failed to save biodata.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving biodata.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs">Loading biodata form...</div>;
  }

  const steps = [
    { num: 1, title: 'ব্যক্তিগত তথ্য' },
    { num: 2, title: 'ধর্মীয় জীবনধারা' },
    { num: 3, title: 'ঠিকানা ও অবস্থান' },
    { num: 4, title: 'শিক্ষা ও পেশা' },
    { num: 5, title: 'পারিবারিক বিবরণ' },
    { num: 6, title: 'জীবনসঙ্গী প্রত্যাশা' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark font-bengali">
            বায়োডাটা তৈরি ও সম্পাদনা
          </h1>
          <p className="text-xs text-dark-muted">
            সঠিক ও নির্ভুল তথ্য প্রদান করে আপনার বৈবাহিক বায়োডাটা সম্পন্ন করুন
          </p>
        </div>

        {formData.biodataNumber && (
          <span className="font-mono text-xs font-bold text-maroon-900 bg-ivory-300 px-3 py-1.5 rounded-xl border border-gold-400/30">
            {formData.biodataNumber}
          </span>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>আপনার বায়োডাটার তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {steps.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setCurrentStep(s.num)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              currentStep === s.num
                ? 'bg-maroon-800 text-white shadow'
                : 'bg-white text-dark border border-slate-200 hover:bg-ivory-100'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              {s.num}
            </span>
            <span className="font-bengali">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-400/30 shadow-sm space-y-6">
        {/* Step 1: Personal Demographics */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-dark font-bengali border-b pb-2">
              ধাপ ১: সাধারণ ও ব্যক্তিগত তথ্য
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold mb-1">বায়োডাটা যার জন্য তৈরি হচ্ছে *</label>
                <select
                  value={formData.profileCreatedFor}
                  onChange={(e) => handleChange('profileCreatedFor', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="SELF">নিজের জন্য</option>
                  <option value="SON">ছেলের জন্য</option>
                  <option value="DAUGHTER">মেয়ের জন্য</option>
                  <option value="BROTHER">ভাইয়ের জন্য</option>
                  <option value="SISTER">বোনের জন্য</option>
                  <option value="RELATIVE">আত্মীয়ের জন্য</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">লিঙ্গ (Gender) *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="MALE">পাত্র (পুরুষ)</option>
                  <option value="FEMALE">পাত্রী (নারী)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">জন্ম তারিখ (DOB) *</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">বৈবাহিক অবস্থা *</label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleChange('maritalStatus', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="NEVER_MARRIED">অবিবাহিত (Never Married)</option>
                  <option value="DIVORCED">ডিভোর্সড (Divorced)</option>
                  <option value="WIDOWED">বিধবা / বিপত্নীক (Widowed)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">উচ্চতা (সেমি বা ফুট) *</label>
                <select
                  value={formData.heightCm}
                  onChange={(e) => handleChange('heightCm', Number(e.target.value))}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value={152}>5&apos;0&quot; (152 cm)</option>
                  <option value={155}>5&apos;1&quot; (155 cm)</option>
                  <option value={158}>5&apos;2&quot; (158 cm)</option>
                  <option value={160}>5&apos;3&quot; (160 cm)</option>
                  <option value={163}>5&apos;4&quot; (163 cm)</option>
                  <option value={165}>5&apos;5&quot; (165 cm)</option>
                  <option value={168}>5&apos;6&quot; (168 cm)</option>
                  <option value={170}>5&apos;7&quot; (170 cm)</option>
                  <option value={173}>5&apos;8&quot; (173 cm)</option>
                  <option value={175}>5&apos;9&quot; (175 cm)</option>
                  <option value={178}>5&apos;10&quot; (178 cm)</option>
                  <option value={180}>5&apos;11&quot; (180 cm)</option>
                  <option value={183}>6&apos;0&quot; (183 cm)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">গায়ের রঙ (Complexion) *</label>
                <select
                  value={formData.complexion}
                  onChange={(e) => handleChange('complexion', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="FAIR">উজ্জ্বল ফর্সা (Fair)</option>
                  <option value="VERY_FAIR">খুব ফর্সা (Very Fair)</option>
                  <option value="WHEATISH">উজ্জ্বল শ্যামলা (Wheatish)</option>
                  <option value="DUSKY">শ্যামলা (Dusky)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Religious Practice & Lifestyle */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-dark font-bengali border-b pb-2">
              ধাপ ২: ধর্মীয় জীবনধারা ও অনুশাসন
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold mb-1">ধর্ম *</label>
                <select
                  value={formData.religion}
                  onChange={(e) => handleChange('religion', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="ISLAM">ইসলাম</option>
                  <option value="HINDUISM">হিন্দু</option>
                  <option value="CHRISTIANITY">খ্রিস্টান</option>
                  <option value="BUDDHISM">বৌদ্ধ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">নামাজ / সালাতের নিয়মিততা</label>
                <select
                  value={formData.prayerFrequency}
                  onChange={(e) => handleChange('prayerFrequency', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="ALWAYS_5_TIMES">সবসময় ৫ ওয়াক্ত</option>
                  <option value="REGULAR">নিয়মিত পড়ার চেষ্টা করি</option>
                  <option value="OCCASIONAL">মাঝে মাঝে</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">পোশাকের ধরণ (দাড়ি / হিজাব)</label>
                <select
                  value={formData.religiousAttire}
                  onChange={(e) => handleChange('religiousAttire', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="NONE">শালীন সাধারণ পোশাক</option>
                  <option value="HIJAB">হিজাব পরিধান করি</option>
                  <option value="NIQAB">নিকাব সহ পর্দা করি</option>
                  <option value="BEARD">সুন্নত দাড়ি রয়েছে</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">নিজের সম্পর্কে কিছু কথা</label>
                <textarea
                  rows={3}
                  value={formData.aboutMe}
                  onChange={(e) => handleChange('aboutMe', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-dark font-bengali border-b pb-2">
              ধাপ ৩: বর্তমান ও স্থায়ী ঠিকানা
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold mb-1">বর্তমান জেলা *</label>
                <input
                  type="text"
                  required
                  value={formData.presentDistrict}
                  onChange={(e) => handleChange('presentDistrict', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">বর্তমান থানা / এলাকা</label>
                <input
                  type="text"
                  value={formData.presentUpazila}
                  onChange={(e) => handleChange('presentUpazila', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">স্থায়ী জেলা *</label>
                <input
                  type="text"
                  required
                  value={formData.permanentDistrict}
                  onChange={(e) => handleChange('permanentDistrict', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">স্থায়ী থানা / উপজেলা</label>
                <input
                  type="text"
                  value={formData.permanentUpazila}
                  onChange={(e) => handleChange('permanentUpazila', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Education & Profession */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-dark font-bengali border-b pb-2">
              ধাপ ৪: শিক্ষা ও পেশা
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold mb-1">সর্বোচ্চ শিক্ষাগত যোগ্যতা *</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleChange('educationLevel', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="POST_GRADUATE">Post Graduate / Masters</option>
                  <option value="GRADUATE">Graduate / Bachelors</option>
                  <option value="DOCTORATE">Doctorate / PhD</option>
                  <option value="DIPLOMA">Diploma</option>
                  <option value="HSC">Higher Secondary (HSC/Alim)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">বিষয় বা বিভাগ (Field of Study)</label>
                <input
                  type="text"
                  value={formData.educationField}
                  onChange={(e) => handleChange('educationField', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">শিক্ষা প্রতিষ্ঠানের নাম</label>
                <input
                  type="text"
                  value={formData.instituteName}
                  onChange={(e) => handleChange('instituteName', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">পেশার ধরণ (Occupation Category) *</label>
                <select
                  value={formData.occupationCategory}
                  onChange={(e) => handleChange('occupationCategory', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="ENGINEER">Engineer / Software</option>
                  <option value="DOCTOR">Doctor (MBBS/BDS)</option>
                  <option value="GOVT_SERVICE">Govt Service / BCS Cadre</option>
                  <option value="BANKER">Banker / Financial</option>
                  <option value="TEACHER">Teacher / Lecturer</option>
                  <option value="PRIVATE_JOB">Private Job / MNC</option>
                  <option value="BUSINESS">Businessman / Entrepreneur</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">পদবী (Designation)</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">বার্ষিক আনুমানিক আয়</label>
                <select
                  value={formData.annualIncomeRange}
                  onChange={(e) => handleChange('annualIncomeRange', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                >
                  <option value="BELOW_3_LAKH">৩ লক্ষ টাকার নিচে</option>
                  <option value="LAKH_3_TO_6">৩ থেকে ৬ লক্ষ টাকা</option>
                  <option value="LAKH_6_TO_12">৬ থেকে ১২ লক্ষ টাকা</option>
                  <option value="LAKH_12_TO_20">১২ থেকে ২০ লক্ষ টাকা</option>
                  <option value="ABOVE_20_LAKH">২০ লক্ষ টাকার উপরে</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Family Details */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-dark font-bengali border-b pb-2">
              ধাপ ৫: পারিবারিক পটভূমি ও অভিভাবকের তথ্য
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold mb-1">পিতার পেশা</label>
                <input
                  type="text"
                  value={formData.fatherProfession}
                  onChange={(e) => handleChange('fatherProfession', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">মাতার পেশা</label>
                <input
                  type="text"
                  value={formData.motherProfession}
                  onChange={(e) => handleChange('motherProfession', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">ভাইয়ের সংখ্যা</label>
                <input
                  type="number"
                  min="0"
                  value={formData.brothersCount}
                  onChange={(e) => handleChange('brothersCount', Number(e.target.value))}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">বোনের সংখ্যা</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sistersCount}
                  onChange={(e) => handleChange('sistersCount', Number(e.target.value))}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-maroon-900">অভিভাবকের সরাসরি ফোন নম্বর *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: 01711223344"
                  value={formData.guardianContactPhone}
                  onChange={(e) => handleChange('guardianContactPhone', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">অভিভাবকের সম্পর্ক *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পিতা / মাতা / বড় ভাই"
                  value={formData.guardianContactRelation}
                  onChange={(e) => handleChange('guardianContactRelation', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Partner Preferences */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-dark font-bengali border-b pb-2">
              ধাপ ৬: জীবনসঙ্গী সম্পর্কিত প্রত্যাশা
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold mb-1">জীবনসঙ্গীর সর্বনিম্ন বয়স</label>
                <input
                  type="number"
                  value={formData.partnerMinAge}
                  onChange={(e) => handleChange('partnerMinAge', Number(e.target.value))}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">জীবনসঙ্গীর সর্বোচ্চ বয়স</label>
                <input
                  type="number"
                  value={formData.partnerMaxAge}
                  onChange={(e) => handleChange('partnerMaxAge', Number(e.target.value))}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">জীবনসঙ্গী সম্পর্কে বিশেষ প্রত্যাশা</label>
                <textarea
                  rows={3}
                  value={formData.partnerExpectations}
                  onChange={(e) => handleChange('partnerExpectations', e.target.value)}
                  className="w-full bg-ivory-100 border p-2.5 rounded-xl font-medium leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation / Save Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold"
            >
              পূর্ববর্তী ধাপ
            </button>
          ) : <div />}

          <div className="flex space-x-2">
            {currentStep < 6 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-dark font-bold rounded-xl text-xs"
              >
                পরবর্তী ধাপ →
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white font-bold rounded-xl text-xs shadow flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'ড্রাফট সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
