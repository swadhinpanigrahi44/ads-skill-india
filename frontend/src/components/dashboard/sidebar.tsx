"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutGrid,
  Video,
  UserCircle2,
  GraduationCap,
  Users,
  Handshake,
  Award,
  Wallet,
  Trophy,
  Headphones,
  Lock,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavLeaf = {
  type: "leaf";
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  danger?: boolean;
};

type NavGroup = {
  type: "group";
  id: string;
  label: string;
  icon: ReactNode;
  children: { href: string; label: string; badge?: string }[];
};

type NavNode = NavLeaf | NavGroup;

const NAV: NavNode[] = [
  { type: "leaf", href: "/dashboard", label: "Dashboard", icon: <LayoutGrid size={16} /> },
  {
    type: "group",
    id: "ads",
    label: "Ads",
    icon: <Video size={16} />,
    children: [
      { href: "/ads/work", label: "Ads Work" },
      { href: "/ads/plans", label: "Ad Plans" },
    ],
  },
  { type: "leaf", href: "/account/kyc", label: "Account & KYC", icon: <UserCircle2 size={16} /> },
  {
    type: "group",
    id: "courses",
    label: "Courses",
    icon: <GraduationCap size={16} />,
    children: [
      { href: "/courses", label: "Courses" },
      { href: "/courses/packages", label: "Course Packages" },
    ],
  },
  {
    type: "group",
    id: "myTeam",
    label: "My Team",
    icon: <Users size={16} />,
    children: [
      { href: "/team/referral", label: "Referral Links" },
      { href: "/team/members", label: "Team Members" },
      { href: "/team/landing", label: "Landing Page", badge: "NEW" },
    ],
  },
  { type: "leaf", href: "/partner-program", label: "Partner Program", icon: <Handshake size={16} /> },
  { type: "leaf", href: "/certificates", label: "Certificates", icon: <Award size={16} /> },
  {
    type: "group",
    id: "withdraw",
    label: "Withdraw",
    icon: <Wallet size={16} />,
    children: [
      { href: "/withdraw", label: "Withdraw Money" },
      { href: "/withdraw/history", label: "Withdraw History" },
    ],
  },
  { type: "leaf", href: "/leaderboard", label: "Leaderboard", icon: <Trophy size={16} /> },
  { type: "leaf", href: "/support", label: "Customer Support", icon: <Headphones size={16} /> },
  { type: "leaf", href: "/settings/password", label: "Password Change", icon: <Lock size={16} /> },
  { type: "leaf", href: "/logout", label: "Logout", icon: <LogOut size={16} />, danger: true },
];

function isGroupActive(group: NavGroup, pathname: string) {
  return group.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/");
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    ads: true,
    courses: false,
    myTeam: false,
    withdraw: false,
  });

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      NAV.forEach((n) => {
        if (n.type === "group" && isGroupActive(n, pathname)) next[n.id] = true;
      });
      return next;
    });
  }, [pathname]);

  const toggle = (id: string) =>
    setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "sidebar-scroll border-r border-border-default flex flex-col h-screen overflow-y-auto overflow-x-hidden",
          "fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          width: 210,
          minWidth: 210,
          background:
            "linear-gradient(180deg, rgba(6,10,20,0.96) 0%, rgba(3,6,13,0.98) 100%)",
          backdropFilter: "blur(14px)",
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-[18px] pb-4 border-b border-[#1a2742] shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <Image
              src="/images/logo.png"
              alt="ADS Skill India"
              width={170}
              height={42}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 pt-2 pb-4">
          {NAV.map((node) => {
            if (node.type === "leaf") {
              const active = pathname === node.href || pathname.startsWith(node.href + "/");
              const isLogout = node.href === "/logout";
              return (
                <NavLeafItem
                  key={node.href}
                  href={node.href}
                  label={node.label}
                  icon={node.icon}
                  badge={node.badge}
                  active={active}
                  danger={node.danger}
                  onClick={isLogout ? handleLogout : onClose}
                  asButton={isLogout}
                />
              );
            }

            const isOpen = !!expanded[node.id];
            return (
              <div key={node.id}>
                <button
                  type="button"
                  onClick={() => toggle(node.id)}
                  className="flex items-center gap-2.5 w-[calc(100%-16px)] px-4 py-2.5 mx-2 my-px rounded-[7px] text-text-secondary text-[14px] font-semibold hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                >
                  <span className="opacity-90 flex items-center justify-center min-w-[18px]">
                    {node.icon}
                  </span>
                  <span className="flex-1 text-left">{node.label}</span>
                  <ChevronDown
                    size={12}
                    className={cn("opacity-60 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen &&
                  node.children.map((child) => {
                    const active =
                      pathname === child.href || pathname.startsWith(child.href + "/");
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2.5 px-4 py-2 pl-10 mx-2 my-px rounded-[7px] text-[14px] transition-colors",
                          active
                            ? "text-text-active-nav font-semibold border-l-2 border-accent"
                            : "text-text-secondary font-medium hover:bg-white/[0.06] hover:text-white"
                        )}
                        style={
                          active
                            ? {
                                background:
                                  "linear-gradient(90deg, rgba(45,125,255,0.22), rgba(45,125,255,0.04))",
                              }
                            : undefined
                        }
                      >
                        <span className="flex-1">{child.label}</span>
                        {child.badge && (
                          <span className="bg-accent text-white text-[9px] font-bold px-[5px] py-px rounded-[4px] tracking-wider">
                            {child.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function NavLeafItem({
  href,
  label,
  icon,
  badge,
  active,
  danger,
  onClick,
  asButton,
}: {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  active: boolean;
  danger?: boolean;
  onClick?: () => void;
  asButton?: boolean;
}) {
  const Wrapper: React.ElementType = asButton ? "button" : Link;
  const wrapperProps = asButton
    ? { type: "button" as const, onClick }
    : { href, onClick };
  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "flex items-center gap-2.5 px-4 py-2.5 mx-2 my-px rounded-[7px] text-[14px] transition-colors",
        asButton && "w-[calc(100%-16px)] text-left cursor-pointer",
        active
          ? "font-semibold text-text-active-nav"
          : danger
          ? "text-danger font-medium hover:bg-danger/10"
          : "text-text-secondary font-semibold hover:bg-white/[0.06] hover:text-white"
      )}
      style={
        active
          ? {
              background:
                "linear-gradient(90deg, rgba(45,125,255,0.22), rgba(45,125,255,0.04))",
              boxShadow: "inset 3px 0 0 #2d7dff",
            }
          : undefined
      }
    >
      {icon && (
        <span
          className={cn(
            "flex items-center justify-center min-w-[18px]",
            active ? "opacity-100" : "opacity-90"
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-accent text-white text-[9px] font-bold px-[5px] py-px rounded-[4px] tracking-wider">
          {badge}
        </span>
      )}
    </Wrapper>
  );
}
