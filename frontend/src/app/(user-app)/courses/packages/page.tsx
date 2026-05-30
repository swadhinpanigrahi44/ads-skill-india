import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { CheckItem } from "@/components/dashboard/check-item";
import { DashButton } from "@/components/dashboard/dash-button";

export const metadata = { title: "Course Packages — ADS Skill India" };

const PACKAGES = [
  { name: "Basic Package",    price: "₹999",   courses: "5 Courses",   access: "30 Days" },
  { name: "Standard Package", price: "₹1,999", courses: "15 Courses",  access: "90 Days" },
  { name: "Pro Package",      price: "₹3,999", courses: "All Courses", access: "1 Year"  },
];

export default function CoursePackagesPage() {
  return (
    <PageWrapper title="Course Packages">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {PACKAGES.map((p) => (
          <Card key={p.name}>
            <div className="text-text-primary font-bold text-[15px] mb-1">{p.name}</div>
            <div className="text-accent font-black text-[22px] mb-3.5">{p.price}</div>
            <CheckItem>{p.courses}</CheckItem>
            <CheckItem>Access: {p.access}</CheckItem>
            <CheckItem>Certificate on completion</CheckItem>
            <DashButton variant="primary" fullWidth className="mt-3.5">
              Get Package
            </DashButton>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
