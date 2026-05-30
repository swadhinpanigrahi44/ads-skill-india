import { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { WithdrawalToast } from "@/components/dashboard/withdrawal-toast";

export const metadata = {
  title: "Dashboard — ADS Skill India",
  description: "Earn, learn, and grow with ADS Skill India.",
};

export default function UserAppLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell>
      {children}
      <WithdrawalToast />
    </DashboardShell>
  );
}
