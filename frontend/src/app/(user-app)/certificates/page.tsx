import { Award } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";

export const metadata = { title: "Certificates — ADS Skill India" };

export default function CertificatesPage() {
  return (
    <PageWrapper title="Certificates">
      <Card className="text-center py-12">
        <Award size={48} className="mx-auto mb-4 text-warning" />
        <div className="text-text-primary text-[18px] font-bold mb-2">
          No Certificates Yet
        </div>
        <div className="text-text-muted text-[13px]">
          Complete courses and earn certificates to display them here.
        </div>
      </Card>
    </PageWrapper>
  );
}
