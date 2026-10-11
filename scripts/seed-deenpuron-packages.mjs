import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Deenpuron.com official packages into database ---');

  const deenpuronPackages = [
    {
      slug: 'FREE',
      nameBn: 'ফ্রি প্যাকেজ',
      nameEn: 'Free Starter',
      badgeEn: 'Free',
      priceBdt: 0,
      originalPriceBdt: 0,
      durationDays: 30,
      biodataAccessLimit: 1,
      interestLimit: 5,
      searchLimit: 50,
      directChatAllowed: false,
      directCallAllowed: false,
      isPopular: false,
      isActive: true,
      displayOrder: 0,
      featuresJson: JSON.stringify([
        'বায়োডাটা তৈরি ও প্রকাশ ১০০% বিনামূল্যে',
        '১টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'সকল যাচাইকৃত পাত্র-পাত্রীর বায়োডাটা সার্চ',
        'পছন্দসই বায়োডাটাতে আগ্রহ প্রকাশের সুযোগ',
      ]),
    },
    {
      slug: 'BASIC',
      nameBn: 'বেসিক প্যাকেজ',
      nameEn: 'Basic Package',
      badgeEn: 'Basic',
      priceBdt: 300,
      originalPriceBdt: 360,
      durationDays: 60,
      biodataAccessLimit: 3,
      interestLimit: 15,
      searchLimit: 100,
      directChatAllowed: false,
      directCallAllowed: false,
      isPopular: false,
      isActive: true,
      displayOrder: 1,
      featuresJson: JSON.stringify([
        '৩টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'মেয়াদ ৬০ দিন (২ মাস)',
        'আনলিমিটেড বায়োডাটা সার্চ ফিল্টারিং',
        'বায়োডাটাতে পছন্দ ও আগ্রহ প্রকাশের সুযোগ',
        '২৪/৭ কাস্টমার সাপোর্ট সুবিধা',
      ]),
    },
    {
      slug: 'STANDARD',
      nameBn: 'স্ট্যান্ডার্ড প্যাকেজ',
      nameEn: 'Standard Package',
      badgeEn: 'Most Popular',
      priceBdt: 550,
      originalPriceBdt: 720,
      durationDays: 120,
      biodataAccessLimit: 6,
      interestLimit: 35,
      searchLimit: 500,
      directChatAllowed: true,
      directCallAllowed: false,
      isPopular: true,
      isActive: true,
      displayOrder: 2,
      featuresJson: JSON.stringify([
        '৬টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'মেয়াদ ১২০ দিন (৪ মাস)',
        'আনলিমিটেড বায়োডাটা সার্চ ও ফিল্টারিং',
        'সরাসরি নিরাপদ চ্যাট সুবিধা',
        'অগ্রাধিকার ভিত্তিক ভেরিফিকেশন ও সাপোর্ট',
      ]),
    },
    {
      slug: 'PREMIUM',
      nameBn: 'প্রিমিয়াম প্যাকেজ',
      nameEn: 'Premium Package',
      badgeEn: 'Best Value',
      priceBdt: 850,
      originalPriceBdt: 1200,
      durationDays: 180,
      biodataAccessLimit: 10,
      interestLimit: 75,
      searchLimit: 1500,
      directChatAllowed: true,
      directCallAllowed: true,
      isPopular: false,
      isActive: true,
      displayOrder: 3,
      featuresJson: JSON.stringify([
        '১০টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'মেয়াদ ১৮০ দিন (৬ মাস)',
        'সরাসরি চ্যাট ও অডিও/ভিডিও কল সুবিধা',
        'সার্চ ফলাফলে প্রোফাইল অগ্রাধিকার ভিত্তিক প্রদর্শন',
        'প্রিমিয়াম ডেডিকেটেড সাপোর্ট ও সহায়তা',
      ]),
    },
    {
      slug: 'CUSTOM_VIP',
      nameBn: 'কাস্টমাইজড প্যাকেজ',
      nameEn: 'Customized VIP Package',
      badgeEn: 'VIP',
      priceBdt: 1200,
      originalPriceBdt: 1600,
      durationDays: 90,
      biodataAccessLimit: 15,
      interestLimit: 150,
      searchLimit: 3000,
      directChatAllowed: true,
      directCallAllowed: true,
      isPopular: false,
      isActive: true,
      displayOrder: 4,
      featuresJson: JSON.stringify([
        '১৫টি অভিভাবকের যোগাযোগের তথ্য আনলক',
        'মেয়াদ ৯০ দিন (৩ মাস)',
        'ব্যক্তিগত পছন্দ অনুযায়ী কাস্টম আনলক সুবিধা',
        'সরাসরি চ্যাট ও কল পারমিশন',
        'বিশেষ ঘটক ও প্রাতিষ্ঠানিক সহায়তা',
      ]),
    },
  ];

  for (const pkg of deenpuronPackages) {
    const upserted = await prisma.membershipPlan.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
    console.log(`✓ Upserted package: ${upserted.nameBn} (${upserted.slug}) - ৳${upserted.priceBdt}`);
  }

  // Deactivate legacy SILVER and GOLD if they exist
  await prisma.membershipPlan.updateMany({
    where: { slug: { in: ['SILVER', 'GOLD', 'PLATINUM'] } },
    data: { isActive: false },
  });

  const activePlans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  console.log(`\nTotal Active Deenpuron Plans in Database: ${activePlans.length}`);
  for (const p of activePlans) {
    console.log(`- ${p.nameBn} (৳${p.priceBdt}) [${p.durationDays} দিন, ${p.biodataAccessLimit}টি আনলক]`);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding packages:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
