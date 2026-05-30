"use client";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "primary-gradient"
  | "success"
  | "info"
  | "danger"
  | "muted"
  | "ghost-light";

interface DashButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "text-white hover:brightness-110 active:brightness-95 shadow-[0_6px_18px_rgba(45,125,255,0.35)]",
  "primary-gradient":
    "text-white hover:brightness-110 active:brightness-95 shadow-[0_6px_18px_rgba(45,125,255,0.35)]",
  success: "bg-success text-white hover:brightness-110 active:brightness-95",
  info: "bg-info text-white hover:brightness-110 active:brightness-95",
  danger: "bg-danger text-white hover:brightness-110 active:brightness-95",
  muted:
    "bg-border-input text-text-primary hover:bg-[#343d57] active:bg-[#2f3650]",
  "ghost-light":
    "bg-white/20 text-white border border-white/20 hover:bg-white/30",
};

const sizes = {
  sm: "px-3 py-1.5 text-[12px]",
  md: "px-4 py-2 text-[13px]",
  lg: "px-5 py-3 text-[14px]",
};

export const DashButton = forwardRef<HTMLButtonElement, DashButtonProps>(
  function DashButton(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      icon,
      rightIcon,
      children,
      className,
      style,
      ...rest
    },
    ref
  ) {
    const gradient =
      variant === "primary-gradient" || variant === "primary"
        ? { background: "linear-gradient(135deg, #1858d4 0%, #2d7dff 100%)" }
        : undefined;

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-[8px] font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        style={{ ...gradient, ...style }}
        {...rest}
      >
        {icon}
        {children}
        {rightIcon}
      </button>
    );
  }
);
