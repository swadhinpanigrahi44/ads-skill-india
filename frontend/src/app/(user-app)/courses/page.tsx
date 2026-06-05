"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Package, Lock } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { DashButton } from "@/components/dashboard/dash-button";
import { coursesService, type MyCoursesResponse } from "@/lib/services";

export default function CoursesPage() {
  const [data, setData] = useState<MyCoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesService
      .getMy()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Video Courses">
      <Card className="flex items-center gap-4 mb-6">
        <div className="rounded-full flex items-center justify-center bg-accent shrink-0" style={{ width: 42, height: 42 }}>
          <Play size={18} className="text-white ml-0.5" fill="currentColor" />
        </div>
        <div className="flex-1">
          <div className="text-text-primary font-bold text-[16px]">Video Courses</div>
          <div className="text-text-muted text-[13px]">
            {data
              ? data.currentPackage
                ? `Your package: ${data.currentPackage} · ${data.unlockedCount}/${data.totalCount} courses unlocked`
                : "Buy a package to unlock courses"
              : "Access courses based on your package"}
          </div>
        </div>
        <Link href="/courses/packages">
          <DashButton variant="primary" icon={<Package size={14} />}>Packages</DashButton>
        </Link>
      </Card>

      {loading ? (
        <div className="text-center text-text-muted text-[14px] py-10 italic">Fetching your courses catalog…</div>
      ) : !data || data.courses.length === 0 ? (
        <div className="text-center text-text-muted text-[14px] py-10">No courses available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.courses.map((c) => (
            <Card key={c.id} className="relative overflow-hidden">
              <div
                className="rounded-[10px] mb-3 flex items-center justify-center"
                style={{ height: 120, background: c.locked ? "#0d0f14" : "linear-gradient(135deg,#1858d4,#2d7dff)" }}
              >
                {c.locked ? <Lock size={28} className="text-text-muted" /> : <Play size={28} className="text-white" fill="currentColor" />}
              </div>
              <div className="text-text-primary font-bold text-[14px] mb-1">{c.title}</div>
              <div className="text-text-muted text-[12px] mb-3 line-clamp-2">{c.description}</div>
              {c.locked ? (
                <Link href="/courses/packages">
                  <DashButton variant="muted" size="sm" fullWidth icon={<Lock size={12} />}>
                    Locked — Upgrade
                  </DashButton>
                </Link>
              ) : (
                <a href={c.videoUrl ?? "#"} target="_blank" rel="noreferrer">
                  <DashButton variant="primary" size="sm" fullWidth icon={<Play size={12} />}>
                    Watch Now
                  </DashButton>
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
