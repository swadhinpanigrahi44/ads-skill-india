"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, UserCircle2, Lock, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  userName?: string;
  userInitials?: string;
  onMenuClick?: () => void;
}

export function Header({
  userName = "Raj Jaiswal",
  userInitials = "RJ",
  onMenuClick,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 h-[56px] border-b border-border-default flex items-center justify-between px-4 lg:px-6 shrink-0"
      style={{
        background: "rgba(6, 10, 20, 0.85)",
        backdropFilter: "blur(14px)",
      }}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden text-text-muted hover:text-text-primary"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90"
        >
          <span className="text-text-secondary text-[14px] font-medium hidden sm:inline">
            Hello, {userName}
          </span>
          <span
            className="rounded-full text-white font-extrabold text-[12px] flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #0a3a8a 0%, #1858d4 50%, #2d7dff 100%)",
              boxShadow: "0 4px 14px rgba(45, 125, 255, 0.4)",
            }}
          >
            {userInitials}
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "text-text-muted transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 top-[44px] min-w-[200px] bg-bg-card border border-border-input rounded-[10px] py-1.5 z-50 animate-fade-in-up"
            style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}
          >
            <Link
              href="/account/kyc"
              className="flex items-center gap-2.5 px-4 py-2.5 text-text-secondary text-[13px] hover:bg-white/[0.06] transition-colors"
              onClick={() => setOpen(false)}
            >
              <UserCircle2 size={15} className="opacity-80" />
              Account & KYC
            </Link>
            <Link
              href="/settings/password"
              className="flex items-center gap-2.5 px-4 py-2.5 text-text-secondary text-[13px] hover:bg-white/[0.06] transition-colors"
              onClick={() => setOpen(false)}
            >
              <Lock size={15} className="opacity-80" />
              Password Change
            </Link>
            <div className="my-1 mx-3 border-t border-border-default" />
            <button
              type="button"
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-danger text-[13px] hover:bg-danger/10 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
