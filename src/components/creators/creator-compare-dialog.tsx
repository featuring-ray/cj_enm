"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleDashed, X } from "lucide-react";
import type { Creator } from "@/types/creator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CreatorCompareDialogProps {
  creators: Creator[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (creatorId: string) => void;
}

const TIER_COLORS: Record<string, string> = {
  S: "bg-purple-100 text-purple-700 border-purple-200",
  A: "bg-blue-100 text-blue-700 border-blue-200",
  B: "bg-green-100 text-green-700 border-green-200",
  C: "bg-yellow-100 text-yellow-700 border-yellow-200",
  D: "bg-gray-100 text-gray-600 border-gray-200",
};

function getTier(score: number) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

function formatKRW(amount: number) {
  if (amount >= 10000) return `${(amount / 10000).toFixed(0)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

const ROWS = [
  { key: "platform", label: "플랫폼" },
  { key: "followerCount", label: "팔로워" },
  { key: "engagementRate", label: "참여율" },
  { key: "score", label: "스코어 (등급)" },
  { key: "avgUnitPrice", label: "평균 객단가" },
  { key: "categories", label: "카테고리" },
  { key: "primaryBrand", label: "대표 브랜드" },
  { key: "isOntnerMember", label: "온트너" },
];

function getCellValue(creator: Creator, key: string): React.ReactNode {
  switch (key) {
    case "platform":
      return (
        <span className="capitalize">{creator.platform}</span>
      );
    case "followerCount":
      return <span className="font-semibold">{formatNumber(creator.followerCount)}</span>;
    case "engagementRate":
      return <span className="font-semibold">{creator.engagementRate.toFixed(1)}%</span>;
    case "score": {
      const tier = getTier(creator.score);
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-base">{creator.score}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${TIER_COLORS[tier]}`}>
            {tier}등급
          </span>
        </div>
      );
    }
    case "avgUnitPrice":
      return creator.avgUnitPrice ? (
        <span className="font-semibold">{formatKRW(creator.avgUnitPrice)}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    case "categories":
      return (
        <div className="flex flex-col gap-1 items-center">
          {creator.categories.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
      );
    case "primaryBrand": {
      const primary = creator.brands.find((b) => b.isPrimary) || creator.brands[0];
      return primary ? (
        <span className="text-sm">{primary.brandName}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    }
    case "isOntnerMember":
      return creator.isOntnerMember ? (
        <span className="flex items-center gap-1 text-xs text-emerald-600 justify-center">
          <CheckCircle2 className="w-3.5 h-3.5" />회원
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-muted-foreground justify-center">
          <CircleDashed className="w-3.5 h-3.5" />비회원
        </span>
      );
    default:
      return "-";
  }
}

export function CreatorCompareDialog({
  creators,
  open,
  onOpenChange,
  onSelect,
}: CreatorCompareDialogProps) {
  const [overlapRate] = useState(18.5); // mock overlap

  if (creators.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <DialogTitle>
            크리에이터 비교 ({creators.length}명 선택)
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-muted-foreground py-2 pr-4 w-28 sticky left-0 bg-background">
                      항목
                    </th>
                    {creators.map((c) => (
                      <th key={c.id} className="text-center py-2 px-3 min-w-36">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {c.displayName.charAt(0)}
                          </div>
                          <Link
                            href={`/ontrust/creators/${c.id}`}
                            className="font-semibold hover:underline text-sm"
                          >
                            {c.displayName}
                          </Link>
                          <span className="text-xs text-muted-foreground">@{c.username}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, idx) => (
                    <tr key={row.key} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <td className="py-3 pr-4 font-medium text-muted-foreground sticky left-0 bg-inherit">
                        {row.label}
                      </td>
                      {creators.map((c) => (
                        <td key={c.id} className="py-3 px-3 text-center">
                          {getCellValue(c, row.key)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* 팔로워 Overlap */}
                  {creators.length >= 2 && (
                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                      <td className="py-3 pr-4 font-medium text-blue-700 sticky left-0 bg-blue-50">
                        팔로워 중복률
                      </td>
                      <td
                        colSpan={creators.length}
                        className="py-3 px-3 text-center text-blue-700 font-semibold"
                      >
                        총 중복률: {overlapRate}% (Overlap 분석 기준)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 선정 버튼 */}
            {onSelect && (
              <div className="flex gap-3 mt-5 pt-4 border-t">
                <span className="text-sm text-muted-foreground self-center">선정:</span>
                {creators.map((c) => (
                  <Button
                    key={c.id}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onSelect(c.id);
                      onOpenChange(false);
                    }}
                  >
                    {c.displayName} 선정
                  </Button>
                ))}
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
