import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface InfoItem {
  label: string;
  value: ReactNode;
}

interface OntnInfoSectionProps {
  title: string;
  items: InfoItem[];
  className?: string;
}

export function OntnInfoSection({ title, items, className }: OntnInfoSectionProps) {
  return (
    <div className={cn("space-y-0", className)}>
      <h3 className="ontn-section-title">{title}</h3>
      <div className="ontn-info-table ontn-info-table-2col">
        {items.map((item, i) => (
          <div key={i} className="contents">
            <div className="ontn-info-label">{item.label}</div>
            <div className="ontn-info-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
