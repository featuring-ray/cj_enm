import { cn } from "@/lib/utils";

type TierLevel = "purple" | "pink" | "green" | "blue" | "black";

const tierLabels: Record<TierLevel, string> = {
  purple: "퍼플 (평균매출 3억이상)",
  pink: "핑트 (평균매출 1억이상)",
  green: "그린 (평균매출 5천이상)",
  blue: "블루 (평균매출 5천미만)",
  black: "블랙 (평균매출 1천미만)",
};

const tierShortLabels: Record<TierLevel, string> = {
  purple: "퍼플",
  pink: "핑트",
  green: "그린",
  blue: "블루",
  black: "블랙",
};

interface OtrTierBadgeProps {
  tier: TierLevel;
  label?: string;
  long?: boolean;
  className?: string;
}

export function OtrTierBadge({ tier, label, long = false, className }: OtrTierBadgeProps) {
  const text = label ?? (long ? tierLabels[tier] : tierShortLabels[tier]);
  return (
    <span className={cn("otr-badge", `otr-badge-${tier}`, className)}>
      {text}
    </span>
  );
}
