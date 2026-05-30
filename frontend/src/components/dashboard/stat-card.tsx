import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: "purple" | "green" | "cyan" | "amber" | "red";
  className?: string;
}

const accentMap = {
  purple: {
    bg: "rgba(45,125,255,0.16)",
    color: "#5fa3ff",
    cardBg:
      "linear-gradient(135deg, rgba(45,125,255,0.10) 0%, rgba(10,16,32,0.85) 100%)",
    border: "rgba(45,125,255,0.30)",
  },
  green: {
    bg: "rgba(16,185,129,0.16)",
    color: "#10b981",
    cardBg:
      "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(10,16,32,0.85) 100%)",
    border: "rgba(16,185,129,0.25)",
  },
  cyan: {
    bg: "rgba(6,182,212,0.16)",
    color: "#06b6d4",
    cardBg:
      "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(10,16,32,0.85) 100%)",
    border: "rgba(6,182,212,0.25)",
  },
  amber: {
    bg: "rgba(245,158,11,0.16)",
    color: "#f59e0b",
    cardBg:
      "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(10,16,32,0.85) 100%)",
    border: "rgba(245,158,11,0.25)",
  },
  red: {
    bg: "rgba(239,68,68,0.16)",
    color: "#ef4444",
    cardBg:
      "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(10,16,32,0.85) 100%)",
    border: "rgba(239,68,68,0.25)",
  },
};

export function StatCard({ icon, label, value, accent = "purple", className }: StatCardProps) {
  const { bg, color, cardBg, border } = accentMap[accent];
  return (
    <div
      className={cn(
        "rounded-[14px] px-[22px] py-5 flex flex-col gap-2.5 relative overflow-hidden transition-all hover:scale-[1.01]",
        className
      )}
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-[8px] p-[7px] flex items-center justify-center"
          style={{ background: bg, color }}
        >
          {icon}
        </span>
        <span className="text-text-muted text-[12px] font-bold uppercase tracking-[0.5px]">
          {label}
        </span>
      </div>
      <div className="text-text-primary text-[26px] font-extrabold tracking-tight">{value}</div>
    </div>
  );
}
