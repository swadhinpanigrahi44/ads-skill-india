import { Trophy, Medal, Award } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";

export const metadata = { title: "Leaderboard — ADS Skill India" };

const LEADERS = [
  { rank: 1, name: "Prithviraj Sukumaran", earnings: "₹45,000" },
  { rank: 2, name: "Mahesh Babu",          earnings: "₹32,000" },
  { rank: 3, name: "Geeta Talreja",        earnings: "₹28,000" },
  { rank: 4, name: "Anuj Singhal",         earnings: "₹13,000" },
  { rank: 5, name: "Raj Jaiswal",          earnings: "₹9,500"  },
  { rank: 6, name: "Ananya Sharma",        earnings: "₹7,200"  },
  { rank: 7, name: "Vikram Reddy",         earnings: "₹6,400"  },
];

const RANK_ICON: Record<number, { icon: React.ReactNode; color: string }> = {
  1: { icon: <Trophy size={18} fill="currentColor" />, color: "#fbbf24" },
  2: { icon: <Medal  size={18} fill="currentColor" />, color: "#cbd5e1" },
  3: { icon: <Award  size={18} fill="currentColor" />, color: "#f59e0b" },
};

export default function LeaderboardPage() {
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
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-text-muted text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADERS.map((l) => {
                const top = RANK_ICON[l.rank];
                return (
                  <tr
                    key={l.rank}
                    className="border-b border-border-default last:border-b-0"
                  >
                    <td className="px-5 py-3.5">
                      {top ? (
                        <span
                          className="inline-flex items-center gap-2 font-bold text-[15px]"
                          style={{ color: top.color }}
                        >
                          {top.icon}
                          {l.rank}
                        </span>
                      ) : (
                        <span className="text-text-muted font-medium text-[14px]">
                          {l.rank}
                        </span>
                      )}
                    </td>
                    <td
                      className={
                        "px-5 py-3.5 text-text-primary text-[14px] " +
                        (l.rank <= 3 ? "font-bold" : "font-normal")
                      }
                    >
                      {l.name}
                    </td>
                    <td className="px-5 py-3.5 text-success text-[14px] font-bold">
                      {l.earnings}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
}
