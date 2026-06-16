"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldOff, Mail } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { DashButton } from "@/components/dashboard/dash-button";
import { authService, userService } from "@/lib/services";
import { useAuthStore, AuthUser } from "@/store/authStore";

export default function TwoFactorPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [enabled, setEnabled] = useState(!!user?.twoFAEnabled);
  const [stage, setStage] = useState<"idle" | "otp">("idle");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    userService.getMe().then((me) => {
      setUser(me as unknown as AuthUser);
      setEnabled(me.twoFAEnabled);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEnable = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await authService.request2FA();
      setStage("otp");
      setMsg({ ok: true, text: "We sent a 6-digit code to your email." });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Could not send OTP (email service may not be configured)" });
    } finally {
      setBusy(false);
    }
  };

  const confirmEnable = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await authService.enable2FA(otp.trim());
      setEnabled(true);
      setStage("idle");
      setOtp("");
      setMsg({ ok: true, text: "Two-factor authentication is now enabled." });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Invalid OTP" });
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await authService.disable2FA();
      setEnabled(false);
      setMsg({ ok: true, text: "Two-factor authentication disabled." });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Failed to disable" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageWrapper title="Two-Factor Authentication">
      <Card className="max-w-[520px]">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: enabled ? "rgba(16,185,129,0.15)" : "rgba(124,111,247,0.15)" }}
          >
            {enabled ? (
              <ShieldCheck size={20} className="text-success" />
            ) : (
              <ShieldOff size={20} className="text-accent" />
            )}
          </div>
          <div>
            <div className="text-text-primary font-bold text-[15px]">Email OTP Authentication</div>
            <div className={`text-[12.5px] font-semibold ${enabled ? "text-success" : "text-text-muted"}`}>
              {enabled ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>

        <p className="text-text-muted text-[13px] leading-[1.7] mb-5">
          Add an extra layer of security. When enabled, a 6-digit code will be sent to your email
          ({user?.email ?? "your address"}) each time you log in.
        </p>

        {msg && (
          <div className={`text-[13px] mb-4 ${msg.ok ? "text-success" : "text-danger"}`}>{msg.text}</div>
        )}

        {enabled ? (
          <DashButton variant="danger" size="lg" disabled={busy} onClick={disable} icon={<ShieldOff size={15} />}>
            {busy ? "Please wait…" : "Disable 2FA"}
          </DashButton>
        ) : stage === "idle" ? (
          <DashButton variant="primary" size="lg" disabled={busy} onClick={startEnable} icon={<Mail size={15} />}>
            {busy ? "Sending code…" : "Enable 2FA"}
          </DashButton>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-text-muted text-[12px] font-semibold block mb-1.5">
                Enter the 6-digit code from your email
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="······"
                className="input-base w-full px-3 py-2.5 text-[16px] tracking-[6px] text-center"
              />
            </div>
            <DashButton variant="primary" fullWidth size="lg" disabled={busy || otp.length !== 6} onClick={confirmEnable}>
              {busy ? "Verifying…" : "Confirm & Enable"}
            </DashButton>
            <button
              type="button"
              onClick={startEnable}
              disabled={busy}
              className="text-accent text-[12.5px] font-semibold hover:underline"
            >
              Resend code
            </button>
          </div>
        )}
      </Card>
    </PageWrapper>
  );
}
