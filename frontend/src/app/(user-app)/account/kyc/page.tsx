import { Play, Info, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";

export const metadata = { title: "Account & KYC — ADS Skill India" };

export default function AccountKYCPage() {
  return (
    <PageWrapper>
      <div className="max-w-[500px] mx-auto my-5 text-center">
        <div
          className="bg-warning rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ width: 70, height: 70 }}
        >
          <Play size={28} className="text-white ml-1" fill="currentColor" />
        </div>
        <div className="text-text-primary text-[28px] font-black tracking-[1px] mb-3 uppercase">
          KYC Restricted
        </div>
        <p className="text-text-secondary text-[14px] mb-7">
          KYC shuru karne ke liye aapko kam se kam{" "}
          <strong className="text-white">2 ads</strong> dekhna zaroori hai.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className="rounded-[10px] p-[18px]"
            style={{ background: "#161b24", border: "1px solid #1e2535" }}
          >
            <div className="text-text-muted text-[11px] font-bold tracking-[1px] mb-2">
              WATCHED
            </div>
            <div className="text-text-primary text-[32px] font-black">0</div>
          </div>
          <div
            className="rounded-[10px] p-[18px]"
            style={{
              background: "rgba(245,158,11,0.13)",
              border: "1px solid rgba(245,158,11,0.27)",
            }}
          >
            <div className="text-warning text-[11px] font-bold tracking-[1px] mb-2">
              REMAINING
            </div>
            <div className="text-warning text-[32px] font-black">2</div>
          </div>
        </div>

        <Card className="text-left mb-5">
          <div className="flex gap-2.5 items-start">
            <Info size={16} className="text-accent mt-0.5 shrink-0" />
            <div className="text-text-secondary text-[13px] leading-[1.55]">
              <strong>Note:</strong> Agar aap koi bhi{" "}
              <strong className="text-accent">Ad Plan</strong> buy karte hain, toh aap bina ads
              dekhe turant KYC kar sakte hain.
            </div>
          </div>
        </Card>

        <button
          type="button"
          className="w-full text-white font-bold uppercase tracking-[0.5px] rounded-[10px] py-3.5 px-3.5 flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition"
          style={{ background: "linear-gradient(135deg,#7c6ff7,#5b4ecf)" }}
        >
          <ArrowRight size={16} /> Dekhne Ke Liye Click Karein
          <ArrowRight size={16} />
        </button>
      </div>
    </PageWrapper>
  );
}
