"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { referralsService } from "@/lib/services";

interface Leader {
  rank: number;
  adsId: string;
  fullName: string;
  totalEarnedFormatted: string;
}

const RANK_ICON: Record<number, { icon: React.ReactNode; color: string }> = {
  1: { icon: <Trophy size={18} fill="currentColor" />, color: "#fbbf24" },
  2: { icon: <Medal size={18} fill="currentColor" />, color: "#cbd5e1" },
  3: { icon: <Award size={18} fill="currentColor" />, color: "#f59e0b" },
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referralsService
      .getLeaderboard(20)
      .then((data) => setLeaders(data as Leader[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Leaderboard">
      <Card flush className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
          <Trophy size={18} className="text-warning" />
          <span className="text-text-primary font-bold text-[15px]">Top Earners</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "#0d0f14" }}>
                {["Rank", "User", "Total Earnings"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-text-muted text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaders.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-text-muted text-[13px]">
                    {loading ? "Loading…" : "No earners yet"}
                  </td>
                </tr>
              ) : (
                leaders.map((l) => {
                  const top = RANK_ICON[l.rank];
                  return (
                    <tr key={l.rank} className="border-b border-border-default last:border-b-0">
                      <td className="px-5 py-3.5">
                        {top ? (
                          <span className="inline-flex items-center gap-2 font-bold text-[15px]" style={{ color: top.color }}>
                            {top.icon}
                            {l.rank}
                          </span>
                        ) : (
                          <span className="text-text-muted font-medium text-[14px]">{l.rank}</span>
                        )}
                      </td>
                      <td className={"px-5 py-3.5 text-text-primary text-[14px] " + (l.rank <= 3 ? "font-bold" : "font-normal")}>
                        {l.fullName} <span className="text-text-muted text-[12px]">({l.adsId})</span>
                      </td>
                      <td className="px-5 py-3.5 text-success text-[14px] font-bold">₹{l.totalEarnedFormatted}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
}
