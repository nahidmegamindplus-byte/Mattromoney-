'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    brandName: 'AmarBondhon',
    brandTagline: 'Trusted Matrimonial Platform of Bangladesh',
    home: 'Home',
    findPartner: 'Find Partner',
    pricing: 'Plans & Pricing',
    howItWorks: 'How It Works',
    safety: 'Safety Center',
    faq: 'FAQ',
    contact: 'Contact Us',
    stories: 'Success Stories',
    about: 'About Us',
    login: 'Log In',
    register: 'Create Free Biodata',
    dashboard: 'Dashboard',
    admin: 'Admin Panel',
    logout: 'Sign Out',
    searchTitle: 'Search Bangladeshi Brides & Grooms',
    searchSubtitle: 'Find your compatible, verified life partner based on religion, education, and district.',
    iAmLookingFor: 'I am looking for',
    bride: 'Bride (পাত্রী)',
    groom: 'Groom (পাত্র)',
    ageRange: 'Age Range',
    religion: 'Religion',
    district: 'District',
    searchNow: 'Search Biodatas',
    verifiedProfiles: '100% NID & Family Verified',
    halalPrivacy: 'Halal & Privacy Protected',
    bKashSendMoneySupported: 'bKash, Nagad & Rocket Send Money Supported',
    viewBiodata: 'View Full Biodata',
    sendInterest: 'Send Interest',
    shortlist: 'Shortlist',
    unlockContact: 'Unlock Guardian Contact',
    chatNow: 'Start Secure Chat',
    callNow: 'Audio/Video Call',
    checkoutTitle: 'Secure Membership Checkout',
    orderNumber: 'Order Number',
    amountPayable: 'Amount Payable',
    copy: 'Copy',
    copied: 'Copied!',
    submitPayment: 'Submit Payment Details',
    trxIdLabel: 'Transaction ID (TrxID)',
    senderPhoneLabel: 'Sender Mobile Number',
    amountSentLabel: 'Exact Amount Sent (BDT)',
    pendingReview: 'Under Finance Review',
    approved: 'Verified & Approved',
    rejected: 'Rejected',
  },
  bn: {
    brandName: 'আমারবন্ধন',
    brandTagline: 'বাংলাদেশের সবচেয়ে বিশ্বস্ত ও নিরাপদ বৈবাহিক মাধ্যম',
    home: 'হোম',
    findPartner: 'পাত্র-পাত্রী খুঁজুন',
    pricing: 'প্যাকেজ ও মূল্যতালিকা',
    howItWorks: 'কীভাবে কাজ করে',
    safety: 'নিরাপত্তা কেন্দ্র',
    faq: 'প্রশ্নোত্তর',
    contact: 'যোগাযোগ',
    stories: 'সফলতার গল্প',
    about: 'আমাদের সম্পর্কে',
    login: 'লগইন',
    register: 'বিনামূল্যে বায়োডাটা তৈরি করুন',
    dashboard: 'ড্যাশবোর্ড',
    admin: 'অ্যাডমিন প্যানেল',
    logout: 'লগআউট',
    searchTitle: 'কাঙ্ক্ষিত দ্বীনদার পাত্র-পাত্রীর সন্ধান',
    searchSubtitle: 'শিক্ষা, পেশা, ধর্মীয় মূল্যবোধ ও জেলা অনুযায়ী আপনার উপযুক্ত জীবনসঙ্গী খুঁজুন।',
    iAmLookingFor: 'আমি খুঁজছি',
    bride: 'পাত্রী (মেয়ে)',
    groom: 'পাত্র (ছেলে)',
    ageRange: 'বয়সসীমা',
    religion: 'ধর্ম',
    district: 'জেলা',
    searchNow: 'বায়োডাটা খুঁজুন',
    verifiedProfiles: '১০০% ভেরিফাইড বায়োডাটা',
    halalPrivacy: 'শরীয়াহ সম্মত ও সর্বোচ্চ গোপনীয়তা',
    bKashSendMoneySupported: 'বিকাশ, নগদ ও রকেট সেন্ড মানি সমর্থিত',
    viewBiodata: 'সম্পূর্ণ বায়োডাটা দেখুন',
    sendInterest: 'আগ্রহ প্রকাশ করুন',
    shortlist: 'পছন্দের তালিকায় রাখুন',
    unlockContact: 'অভিভাবকের নম্বর দেখুন',
    chatNow: 'নিরাপদ চ্যাট শুরু করুন',
    callNow: 'অডিও/ভিডিও কল',
    checkoutTitle: 'মেম্বারশিপ পেমেন্ট চেকআউট',
    orderNumber: 'অর্ডার নম্বর',
    amountPayable: 'পরিশোধযোগ্য টাকা',
    copy: 'কপি করুন',
    copied: 'কপি হয়েছে!',
    submitPayment: 'পেমেন্টের তথ্য জমা দিন',
    trxIdLabel: 'ট্রানজেকশন আইডি (TrxID)',
    senderPhoneLabel: 'প্রেরক মোবাইল নম্বর',
    amountSentLabel: 'প্রেরিত টাকার পরিমাণ (BDT)',
    pendingReview: 'যাচাইকরণ প্রক্রিয়াধীন',
    approved: 'অনুমোদিত ও সক্রিয়',
    rejected: 'বাতিলকৃত',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('bn'); // Default to Bangla for rich local experience

  useEffect(() => {
    const saved = localStorage.getItem('amarbondhon_lang') as Language;
    if (saved === 'en' || saved === 'bn') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('amarbondhon_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
