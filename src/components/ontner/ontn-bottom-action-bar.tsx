"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface OntnBottomActionBarProps {
  onApply: () => void;
  onBookmark: () => void;
  bookmarked: boolean;
  disabled?: boolean;
  applyLabel?: string;
  className?: string;
}

export function OntnBottomActionBar({
  onApply,
  onBookmark,
  bookmarked,
  disabled = false,
  applyLabel = "신청하기",
  className,
}: OntnBottomActionBarProps) {
  return (
    <div className={cn("ontn-bottom-bar", className)}>
      <button
        onClick={onBookmark}
        className={cn("ontn-heart-btn", bookmarked && "ontn-heart-btn-active")}
      >
        <Heart
          className={cn("w-5 h-5", bookmarked && "fill-current")}
        />
      </button>
      <button
        onClick={onApply}
        disabled={disabled}
        className="ontn-apply-btn"
      >
        {applyLabel}
      </button>
    </div>
  );
}
