"use client";

import { cn } from "@/lib/utils";

interface OtrTextareaCounterProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
  value: string;
}

export function OtrTextareaCounter({
  maxLength,
  value,
  className,
  ...props
}: OtrTextareaCounterProps) {
  return (
    <div className="otr-textarea-wrapper">
      <textarea
        className={cn("w-full border border-[var(--otr-border)] p-2", className)}
        style={{ fontSize: "var(--otr-font-body)", minHeight: 120 }}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      <span className="otr-textarea-counter">
        {value.length} / {maxLength.toLocaleString()}자
      </span>
    </div>
  );
}
