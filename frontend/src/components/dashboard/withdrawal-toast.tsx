"use client";

import { useEffect, useState } from "react";
import { X, BadgeIndianRupee } from "lucide-react";

const SAMPLE_NAMES = [
  "Prithviraj Sukumaran",
  "Mahesh Babu",
  "Geeta Talreja",
  "Anuj Singhal",
  "Ananya Sharma",
  "Vikram Reddy",
];
const SAMPLE_AMOUNTS = ["₹9,500", "₹12,400", "₹6,800", "₹3,250", "₹15,000"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function WithdrawalToast() {
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState({
    name: "Prithviraj Sukumaran",
    amount: "₹9,500",
    time: "2 mins ago",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({ name: pick(SAMPLE_NAMES), amount: pick(SAMPLE_AMOUNTS), time: "just now" });
      setVisible(true);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="hidden md:flex fixed bottom-6 left-[200px] items-center gap-2.5 z-40 animate-toast"
      style={{
        background: "#1e2535",
        border: "1px solid #2a3148",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="rounded-full bg-success flex items-center justify-center shrink-0"
        style={{ width: 32, height: 32 }}
      >
        <BadgeIndianRupee size={16} className="text-white" />
      </div>
      <div className="pr-1">
        <div className="text-success text-[11px] font-semibold">Recent Withdrawal</div>
        <div className="text-text-secondary text-[12px]">
          <strong className="text-text-primary">{data.name}</strong> just withdrew{" "}
          <strong className="text-text-primary">{data.amount}</strong>
        </div>
        <div className="text-text-muted text-[11px]">{data.time}</div>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="text-text-muted hover:text-text-primary ml-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
