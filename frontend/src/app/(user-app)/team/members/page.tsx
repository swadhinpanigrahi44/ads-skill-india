"use client";

import { useState } from "react";
import { Users, CheckCircle2, BarChart3, Search } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";

export default function TeamMembersPage() {
  const [search, setSearch] = useState("");

  return (
    <PageWrapper>
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="rounded-[10px] p-2.5 flex items-center justify-center text-accent"
            style={{ background: "rgba(124,111,247,0.13)" }}
          >
            <Users size={20} />
          </div>
          <div>
            <div className="text-text-primary font-bold text-[17px]">Team Members</div>
            <div className="text-text-muted text-[12px]">
              Overview of your network and earnings
            </div>
          </div>
        </div>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or email…"
            className="input-base text-[13px] pl-9 pr-3.5 py-2.5 w-full md:w-[240px]"
            style={{ background: "#161b24", borderColor: "#1e2535" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatBox
          icon={<Users size={14} />}
          accentBg="rgba(124,111,247,0.13)"
          accentColor="#7c6ff7"
          label="Total Members"
          value="0"
        />
        <StatBox
          icon={<CheckCircle2 size={14} />}
          accentBg="rgba(16,185,129,0.13)"
          accentColor="#10b981"
          label="Active Members"
          value="0"
        />
        <StatBox
          icon={<BarChart3 size={14} />}
          accentBg="rgba(124,111,247,0.13)"
          accentColor="#7c6ff7"
          label="Team Earning"
          value="₹0.00"
        />
      </div>

      {/* Downline table */}
      <Card flush className="overflow-hidden">
        <div className="px-5 py-4 flex justify-between items-center border-b border-border-default">
          <span className="text-text-primary font-bold text-[14px]">Downline Members</span>
          <span className="text-text-muted text-[12px]">0 Members Found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "#0d0f14" }}>
                {["User Details", "Contact Info", "Join Date", "Status", "Earning"].map((h) => (
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
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-text-muted text-[13px]"
                >
                  No members found
                </td>
              </tr>
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
        <span
          className="rounded-[6px] p-[5px] flex items-center justify-center"
          style={{ background: accentBg, color: accentColor }}
        >
          {icon}
        </span>
        <span className="text-text-muted text-[11px] font-bold uppercase tracking-[0.5px]">
          {label}
        </span>
      </div>
      <div className="text-text-primary text-[28px] font-black">{value}</div>
    </Card>
  );
}
