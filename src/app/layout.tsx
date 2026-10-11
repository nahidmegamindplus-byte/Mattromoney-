import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'আমারবন্ধন ম্যাট্রিমনি | দ্বীনদার পাত্র-পাত্রী খোঁজার বিশ্বস্ত ইসলামিক মাধ্যম',
  description:
    'আমারবন্ধন - সুন্নাহ সম্মত ও দ্বীনদার পাত্র-পাত্রী খোঁজার নির্ভরযোগ্য ইসলামিক ম্যাট্রিমনি প্ল্যাটফর্ম। অভিভাবকদের সরাসরি অংশগ্রহণে ও শরীয়াহ সম্মত উপায়ে সহজ বিবাহ সম্পন্ন করুন।',
  keywords: [
    'ইসলামিক ম্যাট্রিমনি',
    'দ্বীনদার পাত্র পাত্রী',
    'দ্বীনপূরণ',
    'Islamic Matrimony Bangladesh',
    'Deen Matrimony',
    'সুন্নাহ বিবাহ',
    'Bangla Matrimony',
    'AmarBondhon',
    'bKash Send Money Matrimony',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="bg-[#FFF9F2] text-[#29252A] antialiased flex flex-col min-h-screen selection:bg-[#C8A45D] selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
