'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import ProfileCard from '@/components/ui/ProfileCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, t } = useLanguage();

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state initialized from query params
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [minAge, setMinAge] = useState(searchParams.get('minAge') || '18');
  const [maxAge, setMaxAge] = useState(searchParams.get('maxAge') || '45');
  const [religion, setReligion] = useState(searchParams.get('religion') || '');
  const [maritalStatus, setMaritalStatus] = useState(searchParams.get('maritalStatus') || '');
  const [educationLevel, setEducationLevel] = useState(searchParams.get('educationLevel') || '');
  const [occupationCategory, setOccupationCategory] = useState(searchParams.get('occupationCategory') || '');
  const [division, setDivision] = useState(searchParams.get('division') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'compatibility');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchProfiles = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (gender) params.set('gender', gender);
      if (minAge) params.set('minAge', minAge);
      if (maxAge) params.set('maxAge', maxAge);
      if (religion) params.set('religion', religion);
      if (maritalStatus) params.set('maritalStatus', maritalStatus);
      if (educationLevel) params.set('educationLevel', educationLevel);
      if (occupationCategory) params.set('occupationCategory', occupationCategory);
      if (division) params.set('division', division);
      if (district) params.set('district', district);
      if (searchTerm) params.set('searchTerm', searchTerm);
      if (sortBy) params.set('sortBy', sortBy);
      params.set('page', String(page));
      params.set('limit', '12');

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(1);
  }, [gender, minAge, maxAge, religion, maritalStatus, educationLevel, occupationCategory, division, district, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles(1);
  };

  const handleResetFilters = () => {
    setGender('');
    setMinAge('18');
    setMaxAge('45');
    setReligion('');
    setMaritalStatus('');
    setEducationLevel('');
    setOccupationCategory('');
    setDivision('');
    setDistrict('');
    setSearchTerm('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-maroon-900 to-maroon-800 text-white rounded-2xl p-6 sm:p-8 border border-gold-400/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-bengali">
            {lang === 'bn' ? 'পাত্র-পাত্রী অনুসন্ধান' : 'Find Your Compatible Partner'}
          </h1>
          <p className="text-xs sm:text-sm text-ivory-200 mt-1">
            {lang === 'bn'
              ? `মোট ${totalCount}টি ভেরিফাইড বায়োডাটা পাওয়া গেছে`
              : `Found ${totalCount} verified biodatas matching criteria`}
          </p>
        </div>

        {/* Quick Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder={lang === 'bn' ? 'বায়োডাটা নম্বর, পেশা বা কলেজ...' : 'Biodata #, profession, institute...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-maroon-950/80 border border-gold-400/40 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-ivory-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
            />
            <Search className="w-4 h-4 text-gold-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-maroon-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            {lang === 'bn' ? 'খুঁজুন' : 'Search'}
          </button>
        </form>
      </div>

      {/* Mobile-Friendly Quick Filter Tabs (Deenpuron Style) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-4">
        <button
          type="button"
          onClick={() => setGender('')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all font-bengali active:scale-95 ${
            gender === ''
              ? 'bg-maroon-800 text-white shadow-md'
              : 'bg-white text-dark-muted border border-gold-400/30 hover:bg-ivory-200'
          }`}
        >
          সকল বায়োডাটা
        </button>
        <button
          type="button"
          onClick={() => setGender('FEMALE')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all font-bengali active:scale-95 flex items-center space-x-1.5 ${
            gender === 'FEMALE'
              ? 'bg-gradient-to-r from-rose-800 to-pink-900 text-white shadow-md'
              : 'bg-white text-dark-muted border border-gold-400/30 hover:bg-ivory-200'
          }`}
        >
          <span>🧕</span>
          <span>পাত্রীর বায়োডাটা (Brides)</span>
        </button>
        <button
          type="button"
          onClick={() => setGender('MALE')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all font-bengali active:scale-95 flex items-center space-x-1.5 ${
            gender === 'MALE'
              ? 'bg-gradient-to-r from-indigo-800 to-blue-900 text-white shadow-md'
              : 'bg-white text-dark-muted border border-gold-400/30 hover:bg-ivory-200'
          }`}
        >
          <span>👳‍♂️</span>
          <span>পাত্রের বায়োডাটা (Grooms)</span>
        </button>
      </div>

      {/* Main Grid: Filter Sidebar + Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-xl border border-gold-400/30">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center space-x-2 text-sm font-bold text-maroon-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-600" />
            <span>{lang === 'bn' ? 'ফিল্টার পরিবর্তন করুন' : 'Change Filters'}</span>
          </button>
          <span className="text-xs text-dark-muted">{totalCount} profiles</span>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white rounded-2xl p-6 border border-gold-400/30 shadow-sm space-y-6 h-fit`}
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-dark flex items-center font-bengali">
              <Filter className="w-4 h-4 mr-1.5 text-maroon-700" />
              {lang === 'bn' ? 'অনুসন্ধানের ফিল্টার' : 'Search Filters'}
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-maroon-700 hover:text-maroon-900 flex items-center space-x-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 font-bengali">
              {lang === 'bn' ? 'পাত্র / পাত্রী' : 'Looking For'}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-maroon-600"
            >
              <option value="">{lang === 'bn' ? 'উভয় (পাত্র ও পাত্রী)' : 'Both Grooms & Brides'}</option>
              <option value="FEMALE">{lang === 'bn' ? 'পাত্রী (Female)' : 'Bride (Female)'}</option>
              <option value="MALE">{lang === 'bn' ? 'পাত্র (Male)' : 'Groom (Male)'}</option>
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 font-bengali">
              {lang === 'bn' ? 'বয়সসীমা (বছর)' : 'Age Range'}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="18"
                max="65"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                className="w-1/2 bg-ivory-100 border border-slate-200 rounded-lg p-2 text-xs text-center font-medium"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                min="18"
                max="70"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                className="w-1/2 bg-ivory-100 border border-slate-200 rounded-lg p-2 text-xs text-center font-medium"
              />
            </div>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 font-bengali">
              {lang === 'bn' ? 'ধর্ম' : 'Religion'}
            </label>
            <select
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-200 rounded-lg p-2 text-xs font-medium"
            >
              <option value="">{lang === 'bn' ? 'সকল ধর্ম' : 'All Religions'}</option>
              <option value="ISLAM">{lang === 'bn' ? 'ইসলাম' : 'Islam'}</option>
              <option value="HINDUISM">{lang === 'bn' ? 'হিন্দু' : 'Hinduism'}</option>
              <option value="CHRISTIANITY">{lang === 'bn' ? 'খ্রিস্টান' : 'Christianity'}</option>
              <option value="BUDDHISM">{lang === 'bn' ? 'বৌদ্ধ' : 'Buddhism'}</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 font-bengali">
              {lang === 'bn' ? 'বৈবাহিক অবস্থা' : 'Marital Status'}
            </label>
            <select
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-200 rounded-lg p-2 text-xs font-medium"
            >
              <option value="">{lang === 'bn' ? 'যেকোনো অবস্থা' : 'Any'}</option>
              <option value="NEVER_MARRIED">{lang === 'bn' ? 'অবিবাহিত (Never Married)' : 'Never Married'}</option>
              <option value="DIVORCED">{lang === 'bn' ? 'ডিভোর্সড (Divorced)' : 'Divorced'}</option>
              <option value="WIDOWED">{lang === 'bn' ? 'বিধবা / বিপত্নীক (Widowed)' : 'Widowed'}</option>
            </select>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 font-bengali">
              {lang === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Education'}
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-200 rounded-lg p-2 text-xs font-medium"
            >
              <option value="">{lang === 'bn' ? 'যেকোনো যোগ্যতা' : 'Any Education'}</option>
              <option value="POST_GRADUATE">Post Graduate / Masters</option>
              <option value="GRADUATE">Graduate / Bachelors</option>
              <option value="DOCTORATE">Doctorate / PhD</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="HSC">Higher Secondary (HSC/Alim)</option>
            </select>
          </div>

          {/* Occupation Category */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 font-bengali">
              {lang === 'bn' ? 'পেশা' : 'Profession'}
            </label>
            <select
              value={occupationCategory}
              onChange={(e) => setOccupationCategory(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-200 rounded-lg p-2 text-xs font-medium"
            >
              <option value="">{lang === 'bn' ? 'যেকোনো পেশা' : 'Any Profession'}</option>
              <option value="ENGINEER">Engineer / Software</option>
              <option value="DOCTOR">Doctor (MBBS/BDS)</option>
              <option value="GOVT_SERVICE">Govt Service / BCS Cadre</option>
              <option value="BANKER">Banker / Financial</option>
              <option value="TEACHER">Teacher / Lecturer</option>
              <option value="PRIVATE_JOB">Private Job / MNC</option>
              <option value="BUSINESS">Businessman / Entrepreneur</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 font-bengali">
              {lang === 'bn' ? 'বর্তমান জেলা' : 'District'}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-ivory-100 border border-slate-200 rounded-lg p-2 text-xs font-medium"
            >
              <option value="">{lang === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
              <option value="Dhaka">Dhaka (ঢাকা)</option>
              <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
              <option value="Comilla">Comilla (কুমিল্লা)</option>
              <option value="Sylhet">Sylhet (সিলেট)</option>
              <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
              <option value="Khulna">Khulna (খুলনা)</option>
              <option value="Barisal">Barisal (বরিশাল)</option>
              <option value="Bogra">Bogra (বগুড়া)</option>
              <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
            </select>
          </div>
        </aside>

        {/* Search Results Area */}
        <section className="lg:col-span-3 space-y-6">
          {/* Sorting Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gold-400/30">
            <span className="text-xs text-dark font-medium">
              {lang === 'bn' ? `${totalCount}টি বায়োডাটা পাওয়া গেছে` : `Showing ${profiles.length} of ${totalCount}`}
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-dark-muted font-medium">{lang === 'bn' ? 'সর্টিং:' : 'Sort by:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-ivory-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:ring-1 focus:ring-maroon-600"
              >
                <option value="compatibility">{lang === 'bn' ? 'ম্যাচিং স্কোর (সেরা)' : 'Compatibility Score'}</option>
                <option value="newest">{lang === 'bn' ? 'সর্বশেষ বায়োডাটা' : 'Newest First'}</option>
                <option value="age_asc">{lang === 'bn' ? 'বয়স (কম থেকে বেশি)' : 'Age: Low to High'}</option>
                <option value="age_desc">{lang === 'bn' ? 'বয়স (বেশি থেকে কম)' : 'Age: High to Low'}</option>
                <option value="views">{lang === 'bn' ? 'জনপ্রিয়তা' : 'Most Viewed'}</option>
              </select>
            </div>
          </div>

          {/* Profiles Loading or Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gold-400/30 space-y-3">
              <Sparkles className="w-10 h-10 text-gold-500 mx-auto" />
              <h3 className="font-bold text-lg text-dark font-bengali">
                {lang === 'bn' ? 'কোনো বায়োডাটা পাওয়া যায়নি' : 'No Profiles Found'}
              </h3>
              <p className="text-xs text-dark-muted max-w-sm mx-auto">
                {lang === 'bn'
                  ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন করে বা রিসেট করে পুনরায় অনুসন্ধান করুন।'
                  : 'Try relaxing your filter criteria or searching with fewer restrictions.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-maroon-800 text-white font-semibold text-xs px-4 py-2 rounded-xl"
              >
                {lang === 'bn' ? 'সকল ফিল্টার রিসেট করুন' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((p) => (
                <ProfileCard key={p.id} profile={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => fetchProfiles(currentPage - 1)}
                className="p-2 rounded-lg border border-slate-300 bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold px-4">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => fetchProfiles(currentPage + 1)}
                className="p-2 rounded-lg border border-slate-300 bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
