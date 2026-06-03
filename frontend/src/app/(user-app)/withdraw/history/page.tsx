"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { withdrawalsService } from "@/lib/services";

interface WithdrawalRow {
  id: string;
  amount: number;
  amountFormatted: string;
  method: string;
  status: string;
  requestedAt: string;
  transactionRef: string | null;
}

const STATUS_COLOR: Record<string, string> = {
  REQUESTED: "#fbbf24",
  APPROVED: "#38bdf8",
  PAID: "#10b981",
  REJECTED: "#ef4444",
};

export default function WithdrawHistoryPage() {
  const [rows, setRows] = useState<WithdrawalRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    withdrawalsService
      .getMyRequests()
      .then((data) => setRows(data as WithdrawalRow[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Withdraw History">
      <Card flush className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border-default">
          <span className="text-text-primary font-bold text-[14px]">Transaction History</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "#0d0f14" }}>
                {["Date", "Amount", "Method", "Status", "Transaction ID"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-text-muted text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-text-muted text-[13px]">
                    {loading ? "Loading…" : "No withdrawal history found"}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-border-default last:border-b-0">
                    <td className="px-5 py-3.5 text-text-muted text-[13px] whitespace-nowrap">
                      {new Date(r.requestedAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-text-primary text-[13px] font-bold">₹{r.amountFormatted}</td>
                    <td className="px-5 py-3.5 text-text-muted text-[13px]">{r.method}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] font-bold" style={{ color: STATUS_COLOR[r.status] ?? "#94a3b8" }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-text-muted text-[12px]">{r.transactionRef ?? "—"}</td>
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
