/**
 * Seed script — idempotent. Populates course packages, partner tiers, and the
 * 40-row commission matrix (4 tiers x 5 packages x 2 levels).
 *
 * Run:  npx tsx prisma/seed.ts   (or)   npm run seed
 *
 * All amounts are in PAISE (integer). ₹1,495 = 149500.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Course packages ──────────────────────────────────────────────
const COURSE_PACKAGES = [
  { name: 'Ads Lite', slug: 'ads-lite', price: 149500, sortOrder: 1 },
  { name: 'Ads Pro', slug: 'ads-pro', price: 299900, sortOrder: 2 },
  { name: 'Ads Supreme', slug: 'ads-sumo', price: 599900, sortOrder: 3 },
  { name: 'Ads Premium', slug: 'ads-premium', price: 999900, sortOrder: 4 },
  { name: 'Ads Premium Plus', slug: 'ads-premium-plus', price: 1599900, sortOrder: 5 },
];

// ── Partner tiers ────────────────────────────────────────────────
// l1Pct / l2Pct are used only to COMPUTE the flat commission amounts at seed
// time. After seeding, the matrix holds fixed paise amounts (admin-editable).
const PARTNER_TIERS = [
  { name: 'Associate Partner', slug: 'associate-partner', price: 199900, downlineAdsPercent: 0, sortOrder: 1, l1Pct: 0.1, l2Pct: 0 },
  { name: 'Executive Partner', slug: 'executive-partner', price: 399900, downlineAdsPercent: 10, sortOrder: 2, l1Pct: 0.12, l2Pct: 0.03 },
  { name: 'Master Partner', slug: 'master-partner', price: 599900, downlineAdsPercent: 20, sortOrder: 3, l1Pct: 0.15, l2Pct: 0.05 },
  { name: 'Elite Partner', slug: 'elite-partner', price: 999900, downlineAdsPercent: 30, sortOrder: 4, l1Pct: 0.2, l2Pct: 0.07 },
];

// ── Courses (placeholder content) ────────────────────────────────
// minTier maps to package sortOrder. Cumulative: a user with package sortOrder N
// unlocks every course with minTier <= N.
const SAMPLE_VIDEO = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
// Distribution gives cumulative unlock counts of 4 / 6 / 9 / 12 / 15
// (Lite / Pro / Supreme / Premium / Premium Plus).
const COURSES = [
  // Tier 1 — Ads Lite (4 courses)
  { title: 'Digital Marketing Foundations', minTier: 1 },
  { title: 'Social Media Basics', minTier: 1 },
  { title: 'Introduction to Affiliate Marketing', minTier: 1 },
  { title: 'Building Your Personal Brand', minTier: 1 },
  // Tier 2 — Ads Pro (+2 = 6)
  { title: 'Content Creation 101', minTier: 2 },
  { title: 'Facebook & Instagram Ads', minTier: 2 },
  // Tier 3 — Ads Supreme (+3 = 9)
  { title: 'WhatsApp Marketing Mastery', minTier: 3 },
  { title: 'Lead Generation Strategies', minTier: 3 },
  { title: 'Advanced Funnel Building', minTier: 3 },
  // Tier 4 — Ads Premium (+3 = 12)
  { title: 'Email Marketing Automation', minTier: 4 },
  { title: 'Google Ads & SEO', minTier: 4 },
  { title: 'YouTube Channel Growth', minTier: 4 },
  // Tier 5 — Ads Premium Plus (+3 = 15)
  { title: 'Scaling to 6 Figures', minTier: 5 },
  { title: 'Team Building & Leadership', minTier: 5 },
  { title: 'Business Automation Systems', minTier: 5 },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  console.log('Seeding course packages...');
  for (const pkg of COURSE_PACKAGES) {
    await prisma.coursePackage.upsert({
      where: { slug: pkg.slug },
      create: pkg,
      update: { name: pkg.name, price: pkg.price, sortOrder: pkg.sortOrder },
    });
  }

  console.log('Seeding partner tiers...');
  for (const t of PARTNER_TIERS) {
    await prisma.partnerTier.upsert({
      where: { slug: t.slug },
      create: {
        name: t.name,
        slug: t.slug,
        price: t.price,
        downlineAdsPercent: t.downlineAdsPercent,
        sortOrder: t.sortOrder,
      },
      update: {
        name: t.name,
        price: t.price,
        downlineAdsPercent: t.downlineAdsPercent,
        sortOrder: t.sortOrder,
      },
    });
  }

  console.log('Seeding commission matrix (40 rows)...');
  const tiers = await prisma.partnerTier.findMany();
  const packages = await prisma.coursePackage.findMany();
  const tierConfig = new Map(PARTNER_TIERS.map((t) => [t.slug, t]));

  for (const tier of tiers) {
    const cfg = tierConfig.get(tier.slug);
    if (!cfg) continue;
    for (const pkg of packages) {
      const l1 = Math.round(pkg.price * cfg.l1Pct);
      const l2 = Math.round(pkg.price * cfg.l2Pct);
      for (const [level, amount] of [
        [1, l1],
        [2, l2],
      ] as const) {
        await prisma.commissionRate.upsert({
          where: {
            partnerTierId_coursePackageId_level: {
              partnerTierId: tier.id,
              coursePackageId: pkg.id,
              level,
            },
          },
          create: {
            partnerTierId: tier.id,
            coursePackageId: pkg.id,
            level,
            amount,
          },
          update: { amount },
        });
      }
    }
  }

  console.log('Seeding courses...');
  for (let i = 0; i < COURSES.length; i++) {
    const c = COURSES[i];
    const slug = slugify(c.title);
    await prisma.course.upsert({
      where: { slug },
      create: {
        title: c.title,
        slug,
        description: `${c.title} — full course content coming soon.`,
        videoUrl: SAMPLE_VIDEO,
        minTier: c.minTier,
        sortOrder: i + 1,
      },
      update: { title: c.title, minTier: c.minTier, sortOrder: i + 1 },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
