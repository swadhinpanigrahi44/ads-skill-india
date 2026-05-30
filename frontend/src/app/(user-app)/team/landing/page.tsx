"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  Rocket,
  MessageCircle,
  Globe,
  Copy,
  Check,
  Phone,
  ExternalLink,
} from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { DashButton } from "@/components/dashboard/dash-button";

export default function LandingPagePage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  const copy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
  };

  return (
    <PageWrapper title="Landing Page">
      <Card className="mb-4 text-center py-6">
        <LinkIcon size={22} className="mx-auto mb-1.5 text-accent" />
        <div className="text-text-primary font-bold text-[18px] mb-1">Landing Page</div>
        <div className="text-text-muted text-[13px]">
          Share these automated landing pages with your clients to skyrocket your conversions!
        </div>
      </Card>

      {/* Direct Purchase */}
      <Card className="mb-4">
        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Rocket size={16} className="text-info" />
            <span className="text-info font-bold text-[15px]">
              Direct Purchase Landing Page
            </span>
          </div>
          <span
            className="text-success text-[10px] font-bold px-2 py-[3px] rounded-full flex items-center gap-1"
            style={{ background: "rgba(16,185,129,0.13)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            High Converting
          </span>
        </div>
        <div className="text-text-muted text-[12px] mb-3.5 leading-[1.55]">
          This single page has a Video, Timer, and direct checkout link that auto-locks you as
          the sponsor and applies today&apos;s active package and discount!
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div
            className="flex-1 min-w-[200px] rounded-[8px] px-3 py-2.5 text-text-muted text-[13px] flex items-center gap-2"
            style={{ background: "#0d0f14", border: "1px solid #2a3148" }}
          >
            <Globe size={14} className="shrink-0" />
            <span className="truncate">https://adsskillindia.in/offer/ADS15123</span>
          </div>
          <DashButton
            variant={copied === "direct" ? "success" : "primary"}
            icon={copied === "direct" ? <Check size={13} /> : <Copy size={13} />}
            onClick={() => copy("https://adsskillindia.in/offer/ADS15123", "direct")}
          >
            {copied === "direct" ? "Copied!" : "Copy Link"}
          </DashButton>
          <a
            href="#"
            className="text-info text-[12px] cursor-pointer whitespace-nowrap hover:underline flex items-center gap-1"
          >
            Test My Link <ExternalLink size={11} />
          </a>
        </div>
      </Card>

      {/* WhatsApp */}
      <Card>
        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-success" />
            <span className="text-success font-bold text-[15px]">
              WhatsApp Auto-Prospect Page
            </span>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-[3px] rounded-full flex items-center gap-1"
            style={{
              background: "rgba(124,111,247,0.13)",
              color: "#a89cff",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#a89cff" }} />
            Lead Generation
          </span>
        </div>
        <div className="text-text-muted text-[12px] mb-3.5 leading-[1.55]">
          This page asks users to click &ldquo;WhatsApp Now&rdquo;. When they click it, their
          pre-written inquiry message will be sent directly to your registered Mobile Number!
        </div>
        <div className="flex gap-2 items-center mb-3 flex-wrap">
          <div
            className="flex-1 min-w-[200px] rounded-[8px] px-3 py-2.5 text-text-muted text-[13px] flex items-center gap-2"
            style={{ background: "#0d0f14", border: "1px solid #2a3148" }}
          >
            <MessageCircle size={14} className="shrink-0 text-success" />
            <span className="truncate">https://adsskillindia.in/wa/ADS15123</span>
          </div>
          <DashButton
            variant={copied === "wa" ? "success" : "success"}
            icon={copied === "wa" ? <Check size={13} /> : <Copy size={13} />}
            onClick={() => copy("https://adsskillindia.in/wa/ADS15123", "wa")}
          >
            {copied === "wa" ? "Copied!" : "Copy Link"}
          </DashButton>
          <a
            href="#"
            className="text-info text-[12px] cursor-pointer whitespace-nowrap hover:underline flex items-center gap-1"
          >
            Test Page <ExternalLink size={11} />
          </a>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-text-muted text-[13px] whitespace-nowrap flex items-center gap-1.5">
            <Phone size={13} /> Custom Phone (Optional)
          </span>
          <div
            className="flex items-center gap-1 rounded-[8px] px-2.5 py-1.5"
            style={{ background: "#0d0f14", border: "1px solid #2a3148" }}
          >
            <span className="text-text-muted text-[13px]">+91</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter 10 digit number"
              className="bg-transparent outline-none text-text-primary text-[13px] w-[160px]"
            />
          </div>
        </div>
        <div className="text-text-muted text-[11px] mt-1.5">
          If your whatsapp number is different than registered number, add it here before
          copying.
        </div>
      </Card>
    </PageWrapper>
  );
}
