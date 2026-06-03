"use client";

import { useState } from "react";
import { Lock, KeyRound, Eye, EyeOff, Check } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { authService } from "@/lib/services";

export default function PasswordChangePage() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || !newPass || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPass !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (newPass.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await authService.changePassword(current, newPass);
      setSuccess(true);
      setCurrent("");
      setNewPass("");
      setConfirm("");
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper title="Change Password">
      <Card className="max-w-[500px] mx-auto">
        <div className="flex items-center gap-2 mb-1.5">
          <Lock size={16} className="text-accent" />
          <span className="text-text-primary font-bold text-[15px]">Change Password</span>
        </div>
        <div className="text-text-muted text-[13px] mb-6">
          Update your account password. Use a strong password that you don&apos;t use elsewhere.
        </div>

        <form onSubmit={submit}>
          <PasswordField
            label="Current Password"
            value={current}
            onChange={setCurrent}
            placeholder="Enter your current password"
            show={show.current}
            onToggle={() => setShow((s) => ({ ...s, current: !s.current }))}
          />
          <PasswordField
            label="New Password"
            value={newPass}
            onChange={setNewPass}
            placeholder="Enter new password"
            show={show.new}
            onToggle={() => setShow((s) => ({ ...s, new: !s.new }))}
          />
          <PasswordField
            label="Confirm New Password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Confirm new password"
            show={show.confirm}
            onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            wrapperClassName="mb-6"
          />

          {error && (
            <div className="text-danger text-[13px] mb-3.5 text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-white font-bold rounded-[10px] py-3 text-[14px] flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: success
                ? "#10b981"
                : "linear-gradient(135deg,#7c6ff7,#5b4ecf)",
            }}
          >
            {success ? (
              <>
                <Check size={16} /> Password Changed!
              </>
            ) : (
              <>
                <KeyRound size={15} /> Change Password
              </>
            )}
          </button>
        </form>
      </Card>
    </PageWrapper>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
  wrapperClassName,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  wrapperClassName?: string;
}) {
  return (
    <div className={"mb-4 " + (wrapperClassName ?? "")}>
      <label className="text-text-primary text-[13px] font-semibold block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-base w-full px-3 py-3 pr-10 text-[14px]"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
