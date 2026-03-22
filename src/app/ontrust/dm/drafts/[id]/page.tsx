"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Calendar, Send } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DraftDeliveryTable } from "@/components/auto-dm/draft-delivery-table";
import draftsData from "@/data/mock/auto-dm-drafts.json";
import deliveriesData from "@/data/mock/auto-dm-draft-deliveries.json";
import type { AutoDmDraft } from "@/types/auto-dm-draft";
import type { DraftDelivery } from "@/types/auto-dm-draft";

export default function DraftDetailPage() {
  const params = useParams();
  const draftId = params.id as string;

  const draft = (draftsData as AutoDmDraft[]).find((d) => d.id === draftId);
  const deliveries = (deliveriesData as DraftDelivery[]).filter(
    (d) => d.draftId === draftId
  );

  const statusCounts = useMemo(() => {
    const counts = { total: deliveries.length, pending: 0, accepted: 0, rejected: 0, applied: 0 };
    deliveries.forEach((d) => {
      if (d.status === "대기 중") counts.pending++;
      else if (d.status === "수락") counts.accepted++;
      else if (d.status === "거절") counts.rejected++;
      else if (d.status === "적용 완료") counts.applied++;
    });
    return counts;
  }, [deliveries]);

  if (!draft) {
    return (
      <>
        <PageHeader title="초안을 찾을 수 없습니다" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              해당 초안이 존재하지 않습니다.
            </p>
            <Button variant="outline" asChild>
              <Link href="/ontrust/dm">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                돌아가기
              </Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="초안 발송 상세"
        description={draft.name}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/ontrust/dm">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              목록으로
            </Link>
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-4">
        {/* 초안 정보 */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{draft.name}</span>
                <Badge
                  variant={
                    draft.status === "발송 완료" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {draft.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                생성일:{" "}
                {new Date(draft.createdAt).toLocaleDateString("ko-KR")}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Send className="h-3.5 w-3.5" />
                발송 대상: {statusCounts.total}명
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 발송 현황 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-3 pb-3 text-center">
              <p className="text-xs text-muted-foreground">대기 중</p>
              <p className="text-lg font-bold text-amber-600">
                {statusCounts.pending}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-3 text-center">
              <p className="text-xs text-muted-foreground">수락</p>
              <p className="text-lg font-bold text-blue-600">
                {statusCounts.accepted}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-3 text-center">
              <p className="text-xs text-muted-foreground">적용 완료</p>
              <p className="text-lg font-bold text-green-600">
                {statusCounts.applied}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-3 text-center">
              <p className="text-xs text-muted-foreground">거절</p>
              <p className="text-lg font-bold text-red-600">
                {statusCounts.rejected}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 발송 현황 테이블 */}
        <DraftDeliveryTable deliveries={deliveries} />
      </main>
    </>
  );
}
