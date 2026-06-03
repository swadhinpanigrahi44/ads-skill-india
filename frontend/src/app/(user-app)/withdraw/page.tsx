"use client";

import { useEffect, useState } from "react";
import { Wallet, Send, Banknote } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashButton } from "@/components/dashboard/dash-button";
import { walletService, withdrawalsService } from "@/lib/services";

const fmt = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

export default function WithdrawMoneyPage() {
  const [available, setAvailable] = useState(0);
  const [withdrawn, setWithdrawn] = useState(0);
  const [minPaise, setMinPaise] = useState(50000);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"UPI" | "BANK">("UPI");
  const [upiId, setUpiId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = () => {
    walletService.getWallet().then((w) => setAvailable(w.availableBalance)).catch(() => {});
    withdrawalsService
      .getMyRequests()
      .then((rows: { amount: number; status: string }[]) =>
        setWithdrawn(
          rows.filter((r) => r.status === "PAID").reduce((s, r) => s + r.amount, 0),
        ),
      )
      .catch(() => {});
    withdrawalsService.getConfig().then((c: { minAmount: number }) => setMinPaise(c.minAmount)).catch(() => {});
  };

  useEffect(load, []);

  const submit = async () => {
    setError(null);
    setSuccess(null);
    const rupees = parseFloat(amount);
    if (!rupees || rupees <= 0) return setError("Enter a valid amount");
    const paise = Math.round(rupees * 100);
    if (paise < minPaise) return setError(`Minimum withdrawal is ${fmt(minPaise)}`);
    if (paise > available) return setError("Amount exceeds available balance");
    if (method === "UPI" && !upiId) return setError("Enter your UPI ID");
    if (method === "BANK" && (!accountNumber || !ifscCode))
      return setError("Enter account number and IFSC");

    setSubmitting(true);
    try {
      await withdrawalsService.request({
        amount: paise,
        method,
        ...(method === "UPI"
          ? { upiId }
          : { accountHolderName, accountNumber, ifscCode, bankName }),
      });
      setSuccess("Withdrawal requested. Admin will process it shortly.");
      setAmount("");
      setUpiId("");
      setAccountNumber("");
      setIfscCode("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper title="Withdraw Money">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <StatCard icon={<Wallet size={16} />} label="Available Balance" value={fmt(available)} accent="purple" />
        <StatCard icon={<Send size={16} />} label="Total Withdrawn" value={fmt(withdrawn)} accent="green" />
      </div>

      <Card className="max-w-[500px]">
        <div className="flex items-center gap-2 mb-5">
          <Banknote size={16} className="text-accent" />
          <span className="text-text-primary font-bold">Withdraw Funds</span>
        </div>

        <div className="mb-4">
          <label className="text-text-muted text-[12px] font-semibold block mb-1.5">Amount (₹)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder={`Min ${fmt(minPaise)}`}
            className="input-base w-full px-3 py-2.5 text-[14px]"
          />
        </div>

        <div className="mb-4">
          <label className="text-text-muted text-[12px] font-semibold block mb-1.5">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "UPI" | "BANK")}
            className="input-base w-full px-3 py-2.5 text-[14px]"
          >
            <option value="UPI">UPI</option>
            <option value="BANK">Bank Transfer</option>
          </select>
        </div>

        {method === "UPI" ? (
          <div className="mb-5">
            <label className="text-text-muted text-[12px] font-semibold block mb-1.5">UPI ID</label>
            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="input-base w-full px-3 py-2.5 text-[14px]"
            />
          </div>
        ) : (
          <div className="mb-5 space-y-3">
            <input value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="Account holder name" className="input-base w-full px-3 py-2.5 text-[14px]" />
            <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account number" className="input-base w-full px-3 py-2.5 text-[14px]" />
            <input value={ifscCode} onChange={(e) => setIfscCode(e.target.value.toUpperCase())} placeholder="IFSC code" className="input-base w-full px-3 py-2.5 text-[14px]" />
            <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank name (optional)" className="input-base w-full px-3 py-2.5 text-[14px]" />
          </div>
        )}

        {error && <div className="text-danger text-[13px] mb-3">{error}</div>}
        {success && <div className="text-success text-[13px] mb-3">{success}</div>}

        <DashButton variant="primary" fullWidth size="lg" icon={<Send size={14} />} disabled={submitting} onClick={submit}>
          {submitting ? "Requesting…" : "Withdraw Now"}
        </DashButton>
      </Card>
    </PageWrapper>
  );
}
