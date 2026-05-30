"use client";

import { useState } from "react";
import {
  Gift,
  Megaphone,
  Eye,
  Clock,
  IdCard,
  ShoppingCart,
  Play,
  Check,
  Lock,
  LayoutGrid,
  Video,
} from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { DashButton } from "@/components/dashboard/dash-button";

const TOTAL_ADS = 2;

export default function AdsWorkPage() {
  const [watched, setWatched] = useState(0);
  const [playing, setPlaying] = useState(false);

  const playAd = () => {
    if (watched >= 1 || playing) return;
    setPlaying(true);
    setTimeout(() => {
      setWatched(1);
      setPlaying(false);
    }, 1500);
  };

  return (
    <PageWrapper title="Ads Work">
      {/* Offer banner */}
      <div
        className="relative overflow-hidden rounded-[12px] mb-5 px-7 py-[22px]"
        style={{ background: "linear-gradient(135deg,#5b4ecf,#7c6ff7)" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-2 text-white">
            <Gift size={18} />
            <span className="text-[17px] font-bold">Offer: New User Offer</span>
          </div>
          <p className="text-white/80 text-[13px] mb-3.5">
            <strong>Welcome!</strong> Watch {TOTAL_ADS} ads to earn ₹10,000. Each ad{" "}
            <strong>30 min</strong>. Then buy a plan to earn daily.
          </p>
          <div className="flex flex-wrap gap-2 mb-3.5">
            <Pill icon={<Megaphone size={12} />} label="Ads" value={TOTAL_ADS} />
            <Pill icon={<Eye size={12} />}        label="Watched" value={watched} />
            <Pill icon={<Clock size={12} />}      label="Rem"     value={TOTAL_ADS - watched} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <DashButton variant="ghost-light" size="sm" icon={<IdCard size={14} />}>
              KYC
            </DashButton>
            <DashButton variant="danger" size="sm" icon={<ShoppingCart size={14} />}>
              Plans
            </DashButton>
          </div>
        </div>
      </div>

      {/* Ads grid */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-accent" />
              <span className="text-text-primary font-bold text-[15px]">Ads Grid</span>
            </div>
            <div className="text-text-muted text-[12px] mt-0.5">
              Watch ads in sequence to unlock more.
            </div>
          </div>
          <div className="flex gap-2">
            <span className="bg-border-default text-text-secondary text-[12px] font-semibold rounded-[6px] px-2.5 py-1 flex items-center gap-1.5">
              <Video size={12} /> {TOTAL_ADS} Ads
            </span>
            <span
              className="text-[12px] font-semibold rounded-[6px] px-2.5 py-1"
              style={
                watched >= TOTAL_ADS
                  ? { background: "#10b981", color: "#fff" }
                  : { background: "rgba(16,185,129,0.13)", color: "#10b981" }
              }
            >
              {watched} Done
            </span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Active ad */}
          <button
            type="button"
            onClick={playAd}
            disabled={watched >= 1 || playing}
            className="rounded-[10px] flex items-center justify-center relative overflow-hidden bg-bg-input transition cursor-pointer disabled:cursor-default"
            style={{
              width: 140,
              height: 90,
              border: watched >= 1 ? "2px solid #10b981" : "1px solid #2a3148",
            }}
          >
            {playing ? (
              <span className="text-accent text-[12px]">Loading…</span>
            ) : watched >= 1 ? (
              <Check size={28} className="text-success" strokeWidth={3} />
            ) : (
              <span
                className="rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)", width: 40, height: 40 }}
              >
                <Play size={18} className="text-white ml-0.5" fill="currentColor" />
              </span>
            )}
          </button>

          {/* Locked ad */}
          <div
            className="rounded-[10px] flex flex-col items-center justify-center gap-1.5 bg-bg-input"
            style={{ width: 140, height: 90, border: "1px solid #2a3148" }}
          >
            <Lock size={20} className="text-text-muted" />
            <span className="text-text-muted text-[11px] font-semibold tracking-[1px] uppercase">
              Locked
            </span>
          </div>
        </div>
      </Card>
    </PageWrapper>
  );
}

function Pill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <span
      className="rounded-[6px] text-white text-[12px] font-semibold px-2.5 py-1 flex items-center gap-1.5"
      style={{ background: "rgba(255,255,255,0.14)" }}
    >
      {icon}
      {label}: {value}
    </span>
  );
}
