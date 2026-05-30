import { Check, Star } from "lucide-react";
import { ReactNode } from "react";

interface CheckItemProps {
  star?: boolean;
  children: ReactNode;
}

export function CheckItem({ star = false, children }: CheckItemProps) {
  return (
    <div className="flex items-start gap-2 mb-1.5 text-text-secondary text-[13px] leading-[1.5]">
      {star ? (
        <Star size={14} className="text-warning mt-0.5 shrink-0" fill="currentColor" />
      ) : (
        <Check size={14} className="text-success mt-0.5 shrink-0" strokeWidth={3} />
      )}
      <span>{children}</span>
    </div>
  );
}
