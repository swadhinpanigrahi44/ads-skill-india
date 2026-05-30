"use client";

import { useState } from "react";
import { Wallet, Send, Banknote } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashButton } from "@/components/dashboard/dash-button";

export default function WithdrawMoneyPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");

  return (
    <PageWrapper title="Withdraw Money">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <StatCard
          icon={<Wallet size={16} />}
          label="Available Balance"
          value="₹0.00"
          accent="purple"
        />
        <StatCard
          icon={<Send size={16} />}
          label="Total Withdrawn"
          value="₹0.00"
          accent="green"
        />
      </div>

      <Card className="max-w-[500px]">
        <div className="flex items-center gap-2 mb-5">
          <Banknote size={16} className="text-accent" />
          <span className="text-text-primary font-bold">Withdraw Funds</span>
        </div>

        <div className="mb-4">
          <label className="text-text-muted text-[12px] font-semibold block mb-1.5">
            Amount (₹)
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="input-base w-full px-3 py-2.5 text-[14px]"
          />
        </div>

        <div className="mb-4">
          <label className="text-text-muted text-[12px] font-semibold block mb-1.5">
            Payment Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="input-base w-full px-3 py-2.5 text-[14px]"
          >
            <option>UPI</option>
            <option>Bank Transfer</option>
            <option>Paytm</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="text-text-muted text-[12px] font-semibold block mb-1.5">
            UPI ID / Account Details
          </label>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter UPI ID or account details"
            className="input-base w-full px-3 py-2.5 text-[14px]"
          />
        </div>

        <DashButton
          variant="primary"
          fullWidth
          size="lg"
          icon={<Send size={14} />}
        >
          Withdraw Now
        </DashButton>
      </Card>
    </PageWrapper>
  );
}
