"use client";

import { ChevronDown, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface OntnFilterBarProps {
  campaignType: string;
  onCampaignTypeChange: (value: string) => void;
  settlementType: string;
  onSettlementTypeChange: (value: string) => void;
  benefit: string;
  onBenefitChange: (value: string) => void;
  hasSample: boolean;
  onHasSampleChange: (value: boolean) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  className?: string;
}

const CAMPAIGN_TYPES = ["전체", "공동구매", "제안", "리뷰", "광고"];
const SETTLEMENT_TYPES = ["전체", "수수료", "고정비", "혼합"];
const BENEFITS = ["전체", "샘플제공", "제품제공", "없음"];
const SORT_OPTIONS = ["최근 등록순", "마감임박순", "모집인원순"];

export function OntnFilterBar({
  campaignType,
  onCampaignTypeChange,
  settlementType,
  onSettlementTypeChange,
  benefit,
  onBenefitChange,
  hasSample,
  onHasSampleChange,
  sortBy,
  onSortByChange,
  className,
}: OntnFilterBarProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <Select value={campaignType} onValueChange={onCampaignTypeChange}>
        <SelectTrigger className="w-[120px] h-9 text-[13px]">
          <SelectValue placeholder="캠페인유형" />
        </SelectTrigger>
        <SelectContent>
          {CAMPAIGN_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t === "전체" ? "캠페인유형" : t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={settlementType} onValueChange={onSettlementTypeChange}>
        <SelectTrigger className="w-[110px] h-9 text-[13px]">
          <SelectValue placeholder="정산유형" />
        </SelectTrigger>
        <SelectContent>
          {SETTLEMENT_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t === "전체" ? "정산유형" : t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={benefit} onValueChange={onBenefitChange}>
        <SelectTrigger className="w-[120px] h-9 text-[13px]">
          <SelectValue placeholder="캠페인 혜택" />
        </SelectTrigger>
        <SelectContent>
          {BENEFITS.map((b) => (
            <SelectItem key={b} value={b}>
              {b === "전체" ? "캠페인 혜택" : b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={() => onHasSampleChange(!hasSample)}
        className={cn(
          "ontn-filter-dropdown",
          hasSample && "border-purple-400 text-purple-600"
        )}
      >
        {hasSample && <Check className="w-3.5 h-3.5" />}
        샘플제공
      </button>

      <div className="ml-auto">
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[130px] h-9 text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
