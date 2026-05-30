import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";

export const metadata = { title: "Withdraw History — ADS Skill India" };

export default function WithdrawHistoryPage() {
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
                  No withdrawal history found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
}
