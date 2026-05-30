import Link from "next/link";
import { Play, Package } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { DashButton } from "@/components/dashboard/dash-button";

export const metadata = { title: "Video Courses — ADS Skill India" };

export default function CoursesPage() {
  return (
    <PageWrapper title="Video Courses">
      <Card className="flex items-center gap-4 mb-6">
        <div
          className="rounded-full flex items-center justify-center bg-accent shrink-0"
          style={{ width: 42, height: 42 }}
        >
          <Play size={18} className="text-white ml-0.5" fill="currentColor" />
        </div>
        <div className="flex-1">
          <div className="text-text-primary font-bold text-[16px]">Video Courses</div>
          <div className="text-text-muted text-[13px]">
            Access courses based on your package
          </div>
        </div>
        <Link href="/courses/packages">
          <DashButton variant="primary" icon={<Package size={14} />}>
            Packages
          </DashButton>
        </Link>
      </Card>

      <div className="text-center text-text-muted text-[14px] py-10 italic">
        Fetching your courses catalog…
      </div>
    </PageWrapper>
  );
}
