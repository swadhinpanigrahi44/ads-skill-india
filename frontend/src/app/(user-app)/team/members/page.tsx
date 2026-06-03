"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, CheckCircle2, BarChart3, Search } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { referralsService } from "@/lib/services";

interface Member {
  id: string;
  adsId: string;
  fullName: string;
  tier?: string | null;
  joinedAt: string;
  level: 1 | 2;
}

interface TeamResponse {
  level1Count: number;
  level2Count: number;
  level1: { id: string; adsId: string; fullName: string; tier: string | null; joinedAt: string }[];
  level2: { id: string; adsId: string; fullName: string; joinedAt: string }[];
}

export default function TeamMembersPage() {
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState<TeamResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referralsService
      .getMyTeam()
      .then((data) => setTeam(data as TeamResponse))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const members: Member[] = useMemo(() => {
    if (!team) return [];
    return [
      ...team.level1.map((m) => ({ ...m, level: 1 as const })),
      ...team.level2.map((m) => ({ ...m, tier: null, level: 2 as const })),
    ];
  }, [team]);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return !q || m.fullName.toLowerCase().includes(q) || m.adsId.toLowerCase().includes(q);
  });

  const total = (team?.level1Count ?? 0) + (team?.level2Count ?? 0);

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-[10px] p-2.5 flex items-center justify-center text-accent" style={{ background: "rgba(124,111,247,0.13)" }}>
            <Users size={20} />
          </div>
          <div>
            <div className="text-text-primary font-bold text-[17px]">Team Members</div>
            <div className="text-text-muted text-[12px]">Overview of your network and earnings</div>
          </div>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID…"
            className="input-base text-[13px] pl-9 pr-3.5 py-2.5 w-full md:w-[240px]"
            style={{ background: "#161b24", borderColor: "#1e2535" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatBox icon={<Users size={14} />} accentBg="rgba(124,111,247,0.13)" accentColor="#7c6ff7" label="Total Members" value={String(total)} />
        <StatBox icon={<CheckCircle2 size={14} />} accentBg="rgba(16,185,129,0.13)" accentColor="#10b981" label="Direct (L1)" value={String(team?.level1Count ?? 0)} />
        <StatBox icon={<BarChart3 size={14} />} accentBg="rgba(124,111,247,0.13)" accentColor="#7c6ff7" label="Indirect (L2)" value={String(team?.level2Count ?? 0)} />
      </div>

      <Card flush className="overflow-hidden">
        <div className="px-5 py-4 flex justify-between items-center border-b border-border-default">
          <span className="text-text-primary font-bold text-[14px]">Downline Members</span>
          <span className="text-text-muted text-[12px]">{filtered.length} Members Found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "#0d0f14" }}>
                {["User Details", "ADS ID", "Join Date", "Level", "Tier"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-text-muted text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-text-muted text-[13px]">
                    {loading ? "Loading…" : "No members found"}
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="border-b border-border-default last:border-b-0">
                    <td className="px-5 py-3.5 text-text-primary text-[13px] font-semibold">{m.fullName}</td>
                    <td className="px-5 py-3.5 text-text-muted text-[13px]">{m.adsId}</td>
                    <td className="px-5 py-3.5 text-text-muted text-[13px]">{new Date(m.joinedAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3.5 text-text-muted text-[13px]">L{m.level}</td>
                    <td className="px-5 py-3.5 text-text-muted text-[13px]">{m.tier ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
}

function StatBox({
  icon,
  accentBg,
  accentColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  accentBg: string;
  accentColor: string;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded-[6px] p-[5px] flex items-center justify-center" style={{ background: accentBg, color: accentColor }}>
          {icon}
        </span>
        <span className="text-text-muted text-[11px] font-bold uppercase tracking-[0.5px]">{label}</span>
      </div>
      <div className="text-text-primary text-[28px] font-black">{value}</div>
    </Card>
  );
}
