import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

export function PageWrapper({ title, subtitle, className, children }: PageWrapperProps) {
  return (
    <div className={cn("px-8 py-7 max-w-[1200px] mx-auto", className)}>
      {title && (
        <div className="mb-6">
          <h1 className="text-text-primary text-[22px] font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-text-muted text-[13px] mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
