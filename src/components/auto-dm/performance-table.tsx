"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AutoDmPerformanceRow } from "@/types/auto-dm-draft";

interface PerformanceTableProps {
  data: AutoDmPerformanceRow[];
}

export function PerformanceTable({ data }: PerformanceTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead className="min-w-[160px]">인플루언서 계정</TableHead>
            <TableHead className="min-w-[140px]">캠페인명</TableHead>
            <TableHead className="text-right">좋아요</TableHead>
            <TableHead className="text-right">댓글</TableHead>
            <TableHead className="text-right">저장</TableHead>
            <TableHead className="text-right">리포스트</TableHead>
            <TableHead className="text-right">공유</TableHead>
            <TableHead className="text-right">수신 인원</TableHead>
            <TableHead className="text-right">클릭 인원</TableHead>
            <TableHead className="text-right">클릭률</TableHead>
            <TableHead className="text-right">팔로우 전환</TableHead>
            <TableHead className="text-right">팔로우 전환율</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                성과 데이터가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const isExpanded = expandedRows.has(row.id);
              const hasButtons = row.buttonPerformance.length > 0;

              return (
                <>
                  <TableRow
                    key={row.id}
                    className={hasButtons ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => hasButtons && toggleRow(row.id)}
                  >
                    <TableCell className="w-8 px-2">
                      {hasButtons &&
                        (isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        ))}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={row.influencerAvatar} />
                          <AvatarFallback className="text-xs">
                            {row.influencerName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {row.influencerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {row.influencerHandle}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.campaignName.length > 20
                        ? row.campaignName.slice(0, 20) + "..."
                        : row.campaignName}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.contentMetrics.likeCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.contentMetrics.commentCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.contentMetrics.saveCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.contentMetrics.repostCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.contentMetrics.shareCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.uniqueRecipients.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.uniqueClickers.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold">
                      {row.ctr.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {row.followConversions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold">
                      {row.followConversionRate.toFixed(1)}%
                    </TableCell>
                  </TableRow>

                  {/* 버튼별 성과 서브테이블 */}
                  {isExpanded && hasButtons && (
                    <TableRow key={`${row.id}-buttons`}>
                      <TableCell colSpan={13} className="bg-muted/30 p-0">
                        <div className="px-8 py-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            버튼별 성과
                          </p>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">No</TableHead>
                                <TableHead className="text-xs">버튼명</TableHead>
                                <TableHead className="text-xs">URL</TableHead>
                                <TableHead className="text-xs text-right">
                                  클릭 인원
                                </TableHead>
                                <TableHead className="text-xs text-right">
                                  총 클릭 횟수
                                </TableHead>
                                <TableHead className="text-xs text-right">
                                  CTR
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.buttonPerformance.map((bp) => (
                                <TableRow key={bp.slotNo}>
                                  <TableCell className="text-xs">
                                    {bp.slotNo}
                                  </TableCell>
                                  <TableCell className="text-xs font-medium">
                                    {bp.buttonName}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                                    {bp.url}
                                  </TableCell>
                                  <TableCell className="text-xs text-right font-mono">
                                    {bp.uniqueClickers.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-xs text-right font-mono">
                                    {bp.totalClicks.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-xs text-right font-mono font-semibold">
                                    {bp.ctr.toFixed(1)}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
