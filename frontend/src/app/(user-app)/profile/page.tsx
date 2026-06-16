"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Info, ImageIcon } from "lucide-react";
import { PageWrapper } from "@/components/dashboard/page-wrapper";
import { Card } from "@/components/dashboard/card";
import { DashButton } from "@/components/dashboard/dash-button";
import { useAuthStore, AuthUser } from "@/store/authStore";
import { userService } from "@/lib/services";

function initialsOf(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "?";
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
}

interface Field {
  label: string;
  value: string;
}

export default function ProfileSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const fileRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(user?.avatarUrl ?? null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    // Refresh from server so details are always current.
    userService.getMe().then((me) => {
      setUser(me as unknown as AuthUser);
      setAvatar(me.avatarUrl);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setMsg({ ok: false, text: "Please choose an image file" });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setMsg({ ok: false, text: "Image must be under 5 MB" });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setMsg(null);
  };

  const upload = async () => {
    if (!file) {
      fileRef.current?.click();
      return;
    }
    setUploading(true);
    setMsg(null);
    try {
      const p = await userService.getAvatarUploadParams();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", p.apiKey);
      fd.append("timestamp", String(p.timestamp));
      fd.append("folder", p.folder);
      fd.append("signature", p.signature);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${p.cloudName}/image/upload`,
        { method: "POST", body: fd },
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error(data?.error?.message || "Upload failed");
      const updated = await userService.setAvatar(data.secure_url);
      setUser(updated as unknown as AuthUser);
      setAvatar(updated.avatarUrl);
      setPreview(null);
      setFile(null);
      setMsg({ ok: true, text: "Profile picture updated" });
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Upload failed. Image storage may not be configured.",
      });
    } finally {
      setUploading(false);
    }
  };

  const fields: Field[] = [
    { label: "ADS ID", value: user?.adsId ?? "—" },
    { label: "Full Name", value: user?.fullName ?? "—" },
    { label: "E-mail Address", value: user?.email ?? "—" },
    { label: "Mobile Number", value: user?.mobile ?? "—" },
    { label: "State", value: user?.state ?? "—" },
  ];

  const shown = preview ?? avatar;

  return (
    <PageWrapper title="Profile Settings">
      <Card className="flex items-start gap-3 mb-5">
        <Info size={18} className="text-accent shrink-0 mt-0.5" />
        <div>
          <div className="text-text-primary font-bold text-[14px]">Update Profile</div>
          <div className="text-text-muted text-[13px]">
            You can only update your profile picture here. To change other details, please contact the
            support team from your dashboard.
          </div>
        </div>
      </Card>

      {/* Avatar */}
      <Card className="flex flex-col items-center gap-3 mb-5">
        <div className="relative">
          <div
            className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {shown ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shown} alt="Avatar" className="w-full h-full object-cover" />
            ) : user?.fullName ? (
              <span className="text-white font-extrabold text-2xl">{initialsOf(user.fullName)}</span>
            ) : (
              <ImageIcon size={36} className="text-text-muted" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-lg hover:brightness-110"
            aria-label="Choose picture"
          >
            <Camera size={16} className="text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
        </div>
        <div className="text-text-primary font-extrabold text-[18px]">Hello, {user?.fullName ?? "User"}</div>
        {msg && (
          <div className={`text-[13px] ${msg.ok ? "text-success" : "text-danger"}`}>{msg.text}</div>
        )}
      </Card>

      {/* Read-only details */}
      <Card className="mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label}>
              <label className="text-text-muted text-[12px] font-semibold block mb-1.5">{f.label}</label>
              <input
                value={f.value}
                readOnly
                className="input-base w-full px-3 py-2.5 text-[14px] opacity-80 cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </Card>

      <DashButton variant="primary" fullWidth size="lg" disabled={uploading} onClick={upload}>
        {uploading ? "Uploading…" : file ? "Update Profile Picture" : "Choose Profile Picture"}
      </DashButton>
    </PageWrapper>
  );
}
