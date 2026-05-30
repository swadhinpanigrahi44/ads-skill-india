import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: ReactNode;
  flush?: boolean;
}

export function Card({ className, children, flush = false }: CardProps) {
  return (
    <div
      className={cn(
        "border border-border-default rounded-[14px] relative overflow-hidden transition-all hover:border-[#25365a]",
        !flush && "px-6 py-5",
        className
      )}
      style={{
        background:
          "linear-gradient(180deg, rgba(10,16,32,0.85) 0%, rgba(6,10,20,0.85) 100%)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
      }}
    >
      {children}
    </div>
  );
}
