import { Handshake } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { CheckItem } from "@/components/dashboard/check-item";
import { DashButton } from "@/components/dashboard/dash-button";

export const metadata = { title: "Partner Program — ADS Skill India" };

const PARTNERS = [
  {
    name: "Associate Partner",
    price: "₹1,999.00",
    directIncome: "₹1,000 per joining",
    downline: "Indirect Income not available",
  },
  {
    name: "Executive Partner",
    price: "₹3,999.00",
    directIncome: "₹1,500 per joining",
    downline: "Downline Team Earning: 10% of team ads income",
  },
  {
    name: "Master Partner",
    price: "₹5,999.00",
    directIncome: "₹2,500 per joining",
    downline: "Downline Team Earning: 20% of team ads income",
  },
  {
    name: "Elite Partner",
    price: "₹9,999.00",
    directIncome: "₹5,000 per joining",
    downline: "Downline Team Earning: 30% of team ads income",
  },
];

export default function PartnerProgramPage() {
  return (
    <PageWrapper title="Partner Program">
      <Card className="mb-5">
        <div className="text-text-secondary text-[13px] leading-[1.7]">
          <div>Referral commission depends on the plan you join.</div>
          <div>Downline earning benefits are available on selected plans.</div>
          <div>Earnings are credited automatically after eligible actions.</div>
        </div>
      </Card>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {PARTNERS.map((p) => (
          <Card key={p.name} className="flex flex-col">
            <div className="text-text-primary font-bold text-[14px] mb-1">{p.name}</div>
            <div className="text-accent font-black text-[20px] mb-4">{p.price}</div>
            <div className="flex-1">
              <CheckItem>
                Direct Referral Income: <strong>{p.directIncome}</strong>
              </CheckItem>
              <CheckItem>{p.downline}</CheckItem>
              <CheckItem>
                Exclusive <strong>Premium Partner Badge</strong>
              </CheckItem>
              <CheckItem>
                Unlock <strong>Advanced Affiliate Features</strong>
              </CheckItem>
              <CheckItem>
                Instant <strong>Commission Settlements</strong>
              </CheckItem>
              <CheckItem>
                Dedicated <strong>24/7 Priority Support</strong>
              </CheckItem>
            </div>
            <DashButton
              variant="muted"
              fullWidth
              size="sm"
              className="mt-3.5"
              icon={<Handshake size={13} />}
            >
              Join Program
            </DashButton>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
