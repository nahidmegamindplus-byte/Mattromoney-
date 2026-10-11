import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning all demo candidate data from database ---');

  // Find all non-admin users (role === 'USER')
  const demoUsers = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
    select: { id: true, email: true },
  });

  const demoUserIds = demoUsers.map((u) => u.id);
  console.log(`Found ${demoUserIds.length} non-admin candidate user(s) to remove:`, demoUsers.map((u) => u.email));

  // Purge all candidate interactions
  await prisma.biodataAccessRequest.deleteMany({});
  await prisma.profileView.deleteMany({});
  await prisma.shortlist.deleteMany({});
  await prisma.interest.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.callSession.deleteMany({});
  await prisma.blockRecord.deleteMany({});
  await prisma.reportRecord.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.paymentSubmission.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.biodata.deleteMany({});

  if (demoUserIds.length > 0) {
    await prisma.user.deleteMany({
      where: { id: { in: demoUserIds } },
    });
    console.log(`Deleted all ${demoUserIds.length} candidate user records.`);
  }

  const remainingUsers = await prisma.user.findMany({
    select: { email: true, role: true },
  });
  console.log('Remaining system accounts:', remainingUsers);

  const biodataCount = await prisma.biodata.count();
  console.log(`Total candidate biodatas remaining in database: ${biodataCount}`);
  console.log('Cleanup finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
