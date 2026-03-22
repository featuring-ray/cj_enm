"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DraftDelivery } from "@/types/auto-dm-draft";

interface DraftDeliveryTableProps {
  deliveries: DraftDelivery[];
}

const statusVariantMap: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  "대기 중": "secondary",
  "수락": "default",
  "거절": "destructive",
  "적용 완료": "outline",
};

export function DraftDeliveryTable({ deliveries }: DraftDeliveryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>크리에이터</TableHead>
            <TableHead>캠페인</TableHead>
            <TableHead>발송일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>수락일</TableHead>
            <TableHead>자동화 상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                발송 내역이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            deliveries.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{d.creatorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.creatorHandle}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {d.campaignName.length > 20
                    ? d.campaignName.slice(0, 20) + "..."
                    : d.campaignName}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(d.sentAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[d.status] ?? "secondary"}>
                    {d.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {d.acceptedAt
                    ? new Date(d.acceptedAt).toLocaleDateString("ko-KR")
                    : "-"}
                </TableCell>
                <TableCell>
                  {d.resultAutomationId ? (
                    <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                      실행 중
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
