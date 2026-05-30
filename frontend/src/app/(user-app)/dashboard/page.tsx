import {
  Wallet,
  Tag,
  Video,
  HandCoins,
  History,
  Inbox,
  Lightbulb,
  FolderOpen,
  Camera,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";
import { PageWrapper } from "@/components/dashboard/page-wrapper";

export const metadata = { title: "Dashboard — ADS Skill India" };

const EARNINGS = [
  { label: "TODAY'S EARNING",      value: "₹0.00", gradient: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)" },
  { label: "LAST 7 DAYS EARNING",  value: "₹0.00", gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
  { label: "LAST 30 DAYS EARNING", value: "₹0.00", gradient: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)" },
  { label: "ALL TIME EARNING",     value: "₹0.00", gradient: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)" },
];

const STATS = [
  { label: "BALANCE",          value: "₹0.00", icon: Wallet,    gradient: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)" },
  { label: "AFFILIATE INCOME", value: "₹0.00", icon: Tag,       gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" },
  { label: "ADS INCOME",       value: "₹0.00", icon: Video,     gradient: "linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)" },
  { label: "WITHDRAWAL",       value: "₹0.00", icon: HandCoins, gradient: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)" },
];

export default function DashboardPage() {
  return (
    <PageWrapper title="Dashboard">
      {/* User Profile Card */}
      <div
        className="rounded-[20px] p-7 flex flex-col items-center gap-3 text-center mb-5"
        style={{ background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)" }}
      >
        <p className="text-white font-extrabold text-2xl tracking-[3px]">ADS15130</p>

        <div className="relative">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: "rgba(0,0,0,0.25)" }}
          >
            <Camera size={42} className="text-white/40" />
          </div>
          <span
            className="absolute bottom-2 right-2 w-5 h-5 rounded-full border-[3px]"
            style={{ background: "#22c55e", borderColor: "#d97706" }}
          />
        </div>

        <p className="text-white font-extrabold text-2xl mt-1">Rohit Kumar</p>

        <div
          className="px-10 py-2.5 rounded-xl text-white text-[13px] font-bold tracking-[2px] shadow-lg"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
        >
          ADS SKILL INDIA
        </div>
      </div>

      {/* Earnings stacked cards */}
      <div className="space-y-3 mb-5">
        {EARNINGS.map((card) => (
          <div
            key={card.label}
            className="rounded-[16px] px-7 py-5 flex items-center justify-between shadow-md"
            style={{ background: card.gradient }}
          >
            <IndianRupee size={28} className="text-white/40" strokeWidth={2.5} />
            <div className="text-right">
              <p className="text-white text-3xl font-extrabold leading-tight">{card.value}</p>
              <p className="text-white/80 text-[11px] font-semibold tracking-[1.5px] mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats 2x2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {STATS.map(({ label, value, icon: Icon, gradient }) => (
          <div
            key={label}
            className="rounded-[18px] p-6 flex flex-col gap-4 shadow-md"
            style={{ background: gradient }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.22)" }}
            >
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 text-[11px] font-bold tracking-[1.5px]">{label}</p>
              <p className="text-white text-2xl font-extrabold mt-1">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Transactions */}
      <div
        className="rounded-[16px] p-6 mb-5 border border-border-default"
        style={{ background: "linear-gradient(180deg, rgba(10,16,32,0.85) 0%, rgba(6,10,20,0.85) 100%)" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <History size={18} className="text-text-primary" />
          <h3 className="text-text-primary font-bold text-[15px]">Latest Transactions</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <Inbox size={30} className="text-text-muted" />
          </div>
          <p className="text-text-muted text-sm">No transactions found</p>
        </div>
      </div>

      {/* Available Balance / Withdraw */}
      <div
        className="rounded-[20px] p-7 flex flex-col items-center gap-4 mb-5 shadow-lg"
        style={{ background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <Wallet size={26} className="text-white" />
        </div>
        <div className="text-center">
          <p className="text-white/80 text-[11px] font-bold tracking-[2px]">AVAILABLE BALANCE</p>
          <p className="text-white text-4xl font-extrabold mt-1.5">₹0.00</p>
        </div>
        <Link
          href="/withdraw"
          className="w-full max-w-md flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-[15px] text-black transition-opacity hover:opacity-95"
          style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)" }}
        >
          <HandCoins size={18} />
          Withdraw Money →
        </Link>
      </div>

      {/* Suggest for you */}
      <div
        className="rounded-[16px] p-6 border border-border-default"
        style={{ background: "linear-gradient(180deg, rgba(10,16,32,0.85) 0%, rgba(6,10,20,0.85) 100%)" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb size={18} className="text-yellow-400" />
          <h3 className="text-text-primary font-bold text-[15px]">Suggest for you</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <FolderOpen size={30} className="text-text-muted" />
          </div>
          <p className="text-text-muted text-sm">No campaigns found</p>
        </div>
      </div>
    </PageWrapper>
  );
}
