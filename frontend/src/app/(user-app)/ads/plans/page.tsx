"use client";

import { useState } from "react";
import {
  FileText,
  Info,
  Star,
  ShoppingCart,
} from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { CheckItem } from "@/components/dashboard/check-item";
import { DashButton } from "@/components/dashboard/dash-button";

const PLANS = [
  {
    name: "Starter Plan",
    price: "₹2,999.00",
    valid: "30 days (1 month)",
    ads: "25 ads per day",
    extra: "Standard Earning Plan",
    recommended: false,
  },
  {
    name: "Popular Plan",
    price: "₹4,999.00",
    valid: "60 days (2 months)",
    ads: "80 ads per day",
    extra: "Better ROI & Longer Validity",
    recommended: true,
  },
  {
    name: "Premium Plan",
    price: "₹7,499.00",
    valid: "180 days (6 months)",
    ads: "150 ads per day",
    extra: "High Profit & Half Yearly Access",
    recommended: false,
  },
  {
    name: "Elite Plan",
    price: "₹9,999.00",
    valid: "365 days (12 months)",
    ads: "300 ads per day",
    extra: "Maximum Returns & Full Year VIP Access",
    recommended: false,
  },
  {
    name: "Royal Plan",
    price: "₹14,999.00",
    valid: "365 days (12 months)",
    ads: "500 ads per day",
    extra: "Ultimate ROI & Full Year Royal",
    recommended: true,
  },
];

export default function AdPlansPage() {
  const [agreed, setAgreed] = useState(false);

  return (
    <PageWrapper title="Ad Plans">
      {/* Terms */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={15} className="text-accent" />
          <span className="text-text-primary font-bold">Terms Required</span>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer text-text-secondary text-[13px]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-3.5 h-3.5 accent-accent cursor-pointer"
          />
          <span>
            I agree with{" "}
            <a className="text-info cursor-pointer hover:underline">Terms</a> and{" "}
            <a className="text-info cursor-pointer hover:underline">Privacy Policy</a> before
            payment.
          </span>
        </label>
      </Card>

      {/* How it works */}
      <Card className="mb-6">
        <div className="flex gap-3">
          <span
            className="rounded-full flex items-center justify-center shrink-0 text-accent"
            style={{ background: "rgba(124,111,247,0.13)", width: 32, height: 32 }}
          >
            <Info size={16} />
          </span>
          <div>
            <div className="text-text-primary font-bold mb-1.5">How Ad Plans Work</div>
            {[
              "Each ad takes 1 minute to watch completely",
              "Higher plans = More ads per day = Higher daily revenue",
              "Flexible validity options ranging from 1 Month to 12 Months",
            ].map((t) => (
              <div key={t} className="text-text-secondary text-[13px] leading-[1.6]">
                {t}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Plans grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className="bg-bg-card rounded-[12px] overflow-hidden relative flex flex-col"
            style={{
              border: plan.recommended ? "1.5px solid #7c6ff7" : "1px solid #1e2535",
            }}
          >
            {plan.recommended && (
              <div
                className="text-black text-[10px] font-extrabold uppercase tracking-[0.5px] py-[5px] text-center flex items-center justify-center gap-1"
                style={{ background: "#f59e0b" }}
              >
                <Star size={10} fill="currentColor" /> RECOMMENDED
              </div>
            )}
            <div className="px-[18px] py-5 flex-1 flex flex-col">
              <div className="text-text-primary font-bold text-[15px] mb-1 text-center">
                {plan.name}
              </div>
              <div className="text-accent font-black text-[22px] mb-3.5 text-center">
                {plan.price}
              </div>
              <div className="flex-1">
                <CheckItem>
                  Valid: <strong>{plan.valid}</strong>
                </CheckItem>
                <CheckItem>{plan.ads}</CheckItem>
                <CheckItem>Instant reward after each ad</CheckItem>
                <CheckItem star>{plan.extra}</CheckItem>
              </div>
              <DashButton
                variant="muted"
                fullWidth
                className="mt-4"
                icon={<ShoppingCart size={13} />}
                onClick={() =>
                  !agreed && alert("Please agree to Terms & Privacy Policy first")
                }
              >
                Buy Now
              </DashButton>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
