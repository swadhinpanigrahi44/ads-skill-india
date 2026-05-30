"use client";

import { useState } from "react";
import {
  Headphones,
  Send,
  ShieldAlert,
  MessageSquare,
  Ticket,
  Paperclip,
  ArrowRight,
} from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { DashButton } from "@/components/dashboard/dash-button";

export default function CustomerSupportPage() {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");

  return (
    <PageWrapper title="Customer Support">
      {/* Header card */}
      <Card className="mb-4">
        <div className="flex items-center gap-2.5">
          <span
            className="rounded-[8px] p-2 flex items-center justify-center text-accent"
            style={{ background: "rgba(124,111,247,0.13)" }}
          >
            <Headphones size={18} />
          </span>
          <div>
            <div className="text-text-primary font-bold">Customer Support</div>
            <div className="text-text-muted text-[13px]">
              Get help via Telegram or live chat. We&apos;re here to assist you.
            </div>
          </div>
        </div>
      </Card>

      {/* Fraud alert */}
      <div
        className="rounded-[12px] px-5 py-4 mb-5"
        style={{
          background: "rgba(245,158,11,0.07)",
          border: "1px solid rgba(245,158,11,0.27)",
        }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <ShieldAlert size={16} className="text-warning" />
          <span className="text-warning font-bold text-[14px]">Important Fraud Alert</span>
        </div>
        <div className="text-text-secondary text-[13px] mb-2 leading-[1.55]">
          ADS SKILL INDIA Support Team kabhi bhi aapse personal UPI, bank account, ya admin ke
          naam par payment nahi mangta hai.
        </div>
        <div className="flex gap-2 mb-1 items-start">
          <span className="text-warning text-[14px] shrink-0 leading-none mt-1">●</span>
          <div className="text-text-secondary text-[13px]">
            Agar koi support agent ya sponsor alag se paise mange toh{" "}
            <strong>turant support ticket raise karein</strong>.
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <span className="text-danger text-[14px] shrink-0 leading-none mt-1">●</span>
          <div className="text-text-secondary text-[13px]">
            Website ke bahar ki gayi kisi bhi payment ke liye company{" "}
            <span className="text-success font-bold">zimmedar nahi hogi</span>.
          </div>
        </div>
      </div>

      {/* Telegram + Live Chat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Card className="text-center py-7">
          <div
            className="rounded-[16px] mx-auto mb-3.5 flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              background: "linear-gradient(135deg,#06b6d4,#0891b2)",
            }}
          >
            <Send size={22} className="text-white -rotate-12" />
          </div>
          <div className="text-text-primary font-bold mb-1">Telegram Support</div>
          <div className="text-text-muted text-[12px] mb-4">
            Get instant help via Telegram
          </div>
          <DashButton variant="info" fullWidth icon={<Send size={14} />}>
            Join Telegram
          </DashButton>
        </Card>
        <Card className="text-center py-7">
          <div
            className="rounded-[16px] mx-auto mb-3.5 flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              background: "linear-gradient(135deg,#7c6ff7,#5b4ecf)",
            }}
          >
            <MessageSquare size={22} className="text-white" />
          </div>
          <div className="text-text-primary font-bold mb-1">Live Chat</div>
          <div className="text-text-muted text-[12px] mb-4">24/7 live chat support</div>
          <DashButton variant="primary" fullWidth icon={<MessageSquare size={14} />}>
            Start Live Chat
          </DashButton>
        </Card>
      </div>

      {/* Support Ticket */}
      <Card>
        <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Ticket size={16} className="text-accent" />
            <span className="text-text-primary font-bold">Submit a Support Ticket</span>
          </div>
          <a
            href="#"
            className="text-info text-[13px] cursor-pointer hover:underline flex items-center gap-1"
          >
            View My Tickets <ArrowRight size={12} />
          </a>
        </div>
        <div className="text-text-muted text-[12px] mb-5">
          Fill the form and submit. Our team will reply in your ticket inbox.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3.5">
          <div>
            <label className="text-text-muted text-[12px] font-semibold block mb-1.5">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief subject"
              className="input-base w-full px-3 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="text-text-muted text-[12px] font-semibold block mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-base w-full px-3 py-2.5 text-[13px]"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>

        <div className="mb-3.5">
          <label className="text-text-muted text-[12px] font-semibold block mb-1.5">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue…"
            rows={5}
            className="input-base w-full px-3 py-2.5 text-[13px] resize-y font-sans"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <label className="text-text-muted text-[12px] font-semibold flex items-center gap-1.5">
              <Paperclip size={12} /> Attachments (optional){" "}
              <span className="font-normal">max 5 files · 2MB each</span>
            </label>
            <DashButton variant="muted" size="sm" icon={<Paperclip size={12} />}>
              Add File
            </DashButton>
          </div>
          <div className="text-text-muted text-[12px]">No files attached.</div>
        </div>

        <DashButton variant="primary" fullWidth size="lg" icon={<Send size={14} />}>
          Submit Ticket
        </DashButton>
      </Card>
    </PageWrapper>
  );
}
