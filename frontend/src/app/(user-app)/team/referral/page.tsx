"use client";

import { useState } from "react";
import { Link as LinkIcon, Gift, Wallet, IndianRupee, Copy, Check } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { DashButton } from "@/components/dashboard/dash-button";

const PLAN_LINKS = [
  {
    name: "AdsLite",
    price: "₹1,499.00",
    url: "https://adsskillindia.in/register?ref=ADS15123&pkg=1",
  },
  {
    name: "AdsPro",
    price: "₹2,999.00",
    url: "https://adsskillindia.in/register?ref=ADS15123&pkg=2",
  },
  {
    name: "AdsSupreme",
    price: "₹8,999.00",
    url: "https://adsskillindia.in/register?ref=ADS15123&pkg=3",
  },
  {
    name: "AdsPremium",
    price: "₹9,989.00",
    url: "https://adsskillindia.in/register?ref=ADS15123&pkg=4",
  },
];

export default function ReferralLinksPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
  };

  return (
    <PageWrapper title="My Team / Referral">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
        {/* Main column */}
        <div className="flex flex-col gap-4">
          {/* General link */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon size={16} className="text-accent" />
              <span className="text-text-primary font-bold text-[15px]">General Link</span>
            </div>
            <LinkRow
              url="https://adsskillindia.in/register?ref=ADS15123"
              copyKey="general"
              copied={copied}
              onCopy={copy}
            />
            <div className="mt-2.5 text-text-muted text-[13px]">
              Code:{" "}
              <span
                className="text-accent font-bold text-[12px] rounded-[5px] px-2 py-0.5"
                style={{ background: "#1e2535" }}
              >
                ADS15123
              </span>
            </div>
          </Card>

          {/* Plan-specific links */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Gift size={16} className="text-accent" />
              <span className="text-text-primary font-bold text-[15px]">
                Plan-Specific Links
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              {PLAN_LINKS.map((pl) => (
                <div key={pl.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-text-primary font-semibold text-[13px]">
                      {pl.name}
                    </span>
                    <span className="text-text-muted text-[12px]">Price: {pl.price}</span>
                  </div>
                  <LinkRow
                    url={pl.url}
                    copyKey={pl.name}
                    copied={copied}
                    onCopy={copy}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-3.5">
          <Card>
            <div className="flex items-center gap-2 mb-3.5">
              <Wallet size={16} className="text-success" />
              <span className="text-text-primary font-bold text-[14px]">Affiliate Wallet</span>
            </div>
            <DashButton variant="primary" fullWidth className="mb-2" size="sm">
              View Affiliate Dashboard
            </DashButton>
            <DashButton variant="success" fullWidth className="mb-2" size="sm">
              Withdraw Affiliate Income
            </DashButton>
            <div className="text-text-muted text-[12px] text-center">KYC (Required)</div>
          </Card>

          {/* Referral earning */}
          <div className="rounded-[12px] p-[18px]" style={{ background: "#7c6ff7" }}>
            <div className="flex justify-between items-center mb-3.5">
              <span className="text-white font-bold text-[14px]">Referral Earning</span>
              <IndianRupee size={16} className="text-white/80" />
            </div>
            {[
              ["TODAY EARNING", "₹0.00"],
              ["THIS MONTH", "₹0.00"],
              ["TOTAL EARNING", "₹0.00"],
            ].map(([label, val]) => (
              <div key={label} className="mb-2.5 last:mb-0">
                <div className="text-white/65 text-[10px] font-bold tracking-[0.5px]">
                  {label}
                </div>
                <div className="text-white text-[18px] font-extrabold">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function LinkRow({
  url,
  copyKey,
  copied,
  onCopy,
}: {
  url: string;
  copyKey: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  const isCopied = copied === copyKey;
  return (
    <div className="flex gap-2 items-center">
      <div
        className="flex-1 rounded-[8px] px-3 py-2.5 text-text-muted text-[12px] truncate"
        style={{ background: "#0d0f14", border: "1px solid #2a3148" }}
      >
        {url}
      </div>
      <DashButton
        variant={isCopied ? "success" : "muted"}
        size="sm"
        onClick={() => onCopy(url, copyKey)}
        icon={isCopied ? <Check size={13} /> : <Copy size={13} />}
      >
        {isCopied ? "Copied" : "Copy"}
      </DashButton>
    </div>
  );
}
