/**
 * Create (or promote) a MASTER_ADMIN account. Idempotent.
 *
 * Usage:
 *   ADMIN_EMAIL=you@mail.com ADMIN_PASSWORD='Strong@123' npm run create-admin
 *
 * If the env vars are omitted, the defaults below are used. ALWAYS change the
 * password after first login via POST /api/auth/change-password.
 *
 * If a user with the email already exists, they are promoted to MASTER_ADMIN
 * (and their password is reset to the provided one).
 */
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const EMAIL = process.env.ADMIN_EMAIL ?? 'admin@adsskillindia.in';
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin@12345';
const NAME = process.env.ADMIN_NAME ?? 'Master Admin';
const MOBILE = process.env.ADMIN_MOBILE ?? '9000000001';
const STATE = process.env.ADMIN_STATE ?? 'Odisha';

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: Role.MASTER_ADMIN, passwordHash, isActive: true, isBanned: false },
    });
    console.log(`Promoted existing user ${EMAIL} to MASTER_ADMIN.`);
  } else {
    const count = await prisma.user.count();
    const adsId = `ADS${15001 + count}`;
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          adsId,
          fullName: NAME,
          email: EMAIL,
          mobile: MOBILE,
          state: STATE,
          passwordHash,
          role: Role.MASTER_ADMIN,
          referralCode: adsId,
        },
      });
      await tx.wallet.create({ data: { userId: user.id } });
    });
    console.log(`Created MASTER_ADMIN ${EMAIL} (adsId ${adsId}).`);
  }

  console.log('\n──────────────── ADMIN LOGIN ────────────────');
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
  console.log('  Change the password after first login!');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
