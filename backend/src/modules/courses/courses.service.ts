import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns all active courses with a `locked` flag based on the highest course
   * package the user has purchased (cumulative unlock).
   */
  async getMyCourses(userId: string) {
    const purchases = await this.prisma.coursePurchase.findMany({
      where: { userId },
      include: { package: { select: { sortOrder: true, name: true } } },
    });

    const maxTier = purchases.reduce(
      (max, p) => Math.max(max, p.package.sortOrder),
      0,
    );
    const currentPackage =
      purchases
        .slice()
        .sort((a, b) => b.package.sortOrder - a.package.sortOrder)[0]?.package
        .name ?? null;

    const courses = await this.prisma.course.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return {
      currentPackage,
      maxTier,
      unlockedCount: courses.filter((c) => c.minTier <= maxTier).length,
      totalCount: courses.length,
      courses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        thumbnailUrl: c.thumbnailUrl,
        videoUrl: c.minTier <= maxTier ? c.videoUrl : null, // hide video when locked
        minTier: c.minTier,
        locked: c.minTier > maxTier,
      })),
    };
  }
}
