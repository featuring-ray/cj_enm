"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Zap,
  Send,
  MousePointerClick,
  Trash2,
  MessageSquare,
  Inbox,
  Eye,
  Check,
  X,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AutomationStatusBadge } from "@/components/auto-dm/automation-status-badge";
import { AccountLinkingGate } from "@/components/auto-dm/account-linking-gate";
import type { AutoDmAutomation } from "@/types/auto-dm";
import type { DraftDelivery, AutoDmDraft } from "@/types/auto-dm-draft";
import automationsData from "@/data/mock/auto-dm-automations.json";
import deliveriesData from "@/data/mock/auto-dm-draft-deliveries.json";
import draftsData from "@/data/mock/auto-dm-drafts.json";

const CURRENT_CREATOR_ID = "creator-1";

export default function AutoDmListPage() {
  const router = useRouter();
  const [mainTab, setMainTab] = useState("automations");
  const [automations, setAutomations] = useState<AutoDmAutomation[]>(
    automationsData as AutoDmAutomation[]
  );
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // MD 초안 상태
  const [deliveries, setDeliveries] = useState<DraftDelivery[]>(
    (deliveriesData as DraftDelivery[]).filter(
      (d) => d.creatorId === CURRENT_CREATOR_ID
    )
  );
  const [draftFilterTab, setDraftFilterTab] = useState("all");
  const [previewDelivery, setPreviewDelivery] = useState<DraftDelivery | null>(
    null
  );
  const [acceptTarget, setAcceptTarget] = useState<DraftDelivery | null>(null);
  const [rejectTarget, setRejectTarget] = useState<DraftDelivery | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // 자동화 통계
  const stats = {
    total: automations.length,
    running: automations.filter((a) => a.status === "실행 중").length,
    totalSent: automations.reduce((sum, a) => sum + a.sentCount, 0),
    totalClicks: automations.reduce((sum, a) => sum + a.clickCount, 0),
  };

  // 초안 필터링
  const pendingCount = deliveries.filter((d) => d.status === "대기 중").length;

  const filteredDeliveries = useMemo(() => {
    if (draftFilterTab === "all") return deliveries;
    const statusMap: Record<string, string> = {
      pending: "대기 중",
      accepted: "수락",
      rejected: "거절",
    };
    return deliveries.filter((d) => d.status === statusMap[draftFilterTab]);
  }, [deliveries, draftFilterTab]);

  const getDraft = (draftId: string): AutoDmDraft | undefined => {
    return (draftsData as AutoDmDraft[]).find((d) => d.id === draftId);
  };

  // 자동화 핸들러
  const handleDelete = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    setDeleteTarget(null);
  };

  const getTriggerSummary = (automation: AutoDmAutomation) => {
    if (automation.triggerMode === "all") return "모든 댓글";
    return automation.keywords.join(", ");
  };

  // 초안 핸들러
  const handleAccept = () => {
    if (!acceptTarget) return;
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === acceptTarget.id
          ? { ...d, status: "수락" as const, acceptedAt: new Date().toISOString() }
          : d
      )
    );
    setAcceptTarget(null);
    router.push("/ontner/dm/auto/new?fromDraft=true");
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === rejectTarget.id
          ? {
              ...d,
              status: "거절" as const,
              rejectedAt: new Date().toISOString(),
              rejectReason: rejectReason || null,
            }
          : d
      )
    );
    setRejectTarget(null);
    setRejectReason("");
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "대기 중":
        return "secondary" as const;
      case "수락":
        return "default" as const;
      case "거절":
        return "destructive" as const;
      case "적용 완료":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <AccountLinkingGate>
      <div className="p-6">
        <PageHeader
          title="댓글 자동 DM"
          description="댓글 트리거 기반 자동 DM 자동화를 관리합니다."
          actions={
            <Link href="/ontner/dm/auto/new">
              <Button>
                <Plus className="w-4 h-4 mr-1.5" />
                새 자동화 만들기
              </Button>
            </Link>
          }
        />

        {/* 메인 탭: 자동화 / 협업 템플릿 */}
        <Tabs value={mainTab} onValueChange={setMainTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="automations" className="gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              자동화 목록
            </TabsTrigger>
            <TabsTrigger value="drafts" className="gap-1.5">
              <Inbox className="h-3.5 w-3.5" />
              협업 템플릿 수신함
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r from-purple-500 to-teal-400 leading-none">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── 자동화 목록 탭 ── */}
          <TabsContent value="automations" className="space-y-4 mt-0">
            {/* 통계 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    전체 자동화
                  </div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    실행 중
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.running}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Send className="w-3.5 h-3.5" />
                    총 발송
                  </div>
                  <p className="text-2xl font-bold">
                    {stats.totalSent.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <MousePointerClick className="w-3.5 h-3.5" />
                    총 클릭
                  </div>
                  <p className="text-2xl font-bold">
                    {stats.totalClicks.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 자동화 테이블 */}
            {automations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    아직 생성된 자동화가 없습니다.
                  </p>
                  <Link href="/ontner/dm/auto/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-1.5" />
                      첫 자동화 만들기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>자동화 이름</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>트리거</TableHead>
                        <TableHead className="text-right">발송</TableHead>
                        <TableHead className="text-right">응답</TableHead>
                        <TableHead className="text-right">클릭</TableHead>
                        <TableHead className="text-right">생성일</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {automations.map((automation) => (
                        <TableRow
                          key={automation.id}
                          className="cursor-pointer"
                        >
                          <TableCell>
                            <Link
                              href={`/ontner/dm/auto/${automation.id}`}
                              className="font-medium hover:underline"
                            >
                              {automation.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <AutomationStatusBadge status={automation.status} />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {getTriggerSummary(automation)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {automation.sentCount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {automation.replyCount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {automation.clickCount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {new Date(automation.createdAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(automation.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* ── 협업 템플릿 수신함 탭 ── */}
          <TabsContent value="drafts" className="space-y-4 mt-0">
            {/* 요약 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Inbox className="w-3.5 h-3.5" />
                    전체 수신
                  </div>
                  <p className="text-2xl font-bold">{deliveries.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs mb-1 text-amber-600">
                    <Clock className="w-3.5 h-3.5" />
                    대기 중
                  </div>
                  <p className="text-2xl font-bold text-amber-600">
                    {deliveries.filter((d) => d.status === "대기 중").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs mb-1 text-green-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    수락
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {deliveries.filter((d) => d.status === "수락" || d.status === "적용 완료").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs mb-1 text-red-600">
                    <XCircle className="w-3.5 h-3.5" />
                    거절
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {deliveries.filter((d) => d.status === "거절").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 상태 필터 */}
            <Tabs value={draftFilterTab} onValueChange={setDraftFilterTab}>
              <TabsList>
                <TabsTrigger value="all">전체 ({deliveries.length})</TabsTrigger>
                <TabsTrigger value="pending">
                  대기 중 ({deliveries.filter((d) => d.status === "대기 중").length})
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  수락 ({deliveries.filter((d) => d.status === "수락" || d.status === "적용 완료").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  거절 ({deliveries.filter((d) => d.status === "거절").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 초안 카드 목록 */}
            {filteredDeliveries.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {draftFilterTab === "all"
                      ? "수신한 초안이 없습니다."
                      : "해당 상태의 초안이 없습니다."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <div className="divide-y">
                  {filteredDeliveries.map((delivery) => {
                    const draft = getDraft(delivery.draftId);

                    return (
                      <div
                        key={delivery.id}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors"
                      >
                        {/* 캠페인 라벨 */}
                        <div className="shrink-0 w-[180px]">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-md px-2 py-1 truncate max-w-full">
                            <Send className="h-3 w-3 shrink-0" />
                            {delivery.campaignName.length > 20
                              ? delivery.campaignName.slice(0, 20) + "…"
                              : delivery.campaignName}
                          </span>
                        </div>

                        {/* 템플릿 이름 + 메시지 요약 */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {delivery.draftName}
                          </p>
                          {draft && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {draft.dmMessageBody || "(메시지 미작성)"}
                            </p>
                          )}
                        </div>

                        {/* 트리거 뱃지 */}
                        {draft && (
                          <div className="hidden md:flex items-center gap-1 shrink-0">
                            <Badge variant="secondary" className="text-[10px]">
                              {draft.triggerMode === "keywords"
                                ? `키워드`
                                : "모든 댓글"}
                            </Badge>
                            {draft.followerFlow.enabled && (
                              <Badge variant="outline" className="text-[10px]">
                                팔로워 유도
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* 수신일 */}
                        <span className="hidden sm:block text-xs text-muted-foreground shrink-0 w-[80px] text-right">
                          {new Date(delivery.sentAt).toLocaleDateString("ko-KR")}
                        </span>

                        {/* 상태 */}
                        <Badge
                          variant={statusBadgeVariant(delivery.status)}
                          className="shrink-0 w-[60px] justify-center text-[11px]"
                        >
                          {delivery.status}
                        </Badge>

                        {/* 액션 */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="미리보기"
                            onClick={() => setPreviewDelivery(delivery)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {delivery.status === "대기 중" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="수락"
                                onClick={() => setAcceptTarget(delivery)}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="거절"
                                onClick={() => setRejectTarget(delivery)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>자동화를 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>
              삭제 시 해당 자동화와 연관된 대기 중 메시지도 함께 삭제됩니다.
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 미리보기 다이얼로그 */}
      <Dialog
        open={!!previewDelivery}
        onOpenChange={() => setPreviewDelivery(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>초안 미리보기</DialogTitle>
          </DialogHeader>
          {previewDelivery && (() => {
            const draft = getDraft(previewDelivery.draftId);
            if (!draft) return <p className="text-sm text-muted-foreground">초안 데이터를 찾을 수 없습니다.</p>;
            return (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">초안 이름</p>
                  <p className="text-sm font-medium">{draft.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">캠페인</p>
                  <p className="text-sm">{previewDelivery.campaignName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">DM 메시지</p>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap">
                    {draft.dmMessageBody}
                  </div>
                </div>
                {draft.buttons.some((b) => b.enabled) && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">CTA 버튼</p>
                    <div className="space-y-1.5">
                      {draft.buttons
                        .filter((b) => b.enabled)
                        .map((b, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-lg border p-2"
                          >
                            <span className="text-sm font-medium">{b.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                              {b.url}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {draft.followerFlow.enabled && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">팔로워 유도</p>
                    <div className="space-y-2 text-xs">
                      <div className="rounded-lg border border-red-200 bg-red-50 p-2">
                        <span className="font-medium text-red-700">미팔로우:</span>{" "}
                        {draft.followerFlow.actionAMessage}
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50 p-2">
                        <span className="font-medium text-green-700">팔로우:</span>{" "}
                        {draft.followerFlow.actionBMessage}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDelivery(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수락 확인 다이얼로그 */}
      <Dialog open={!!acceptTarget} onOpenChange={() => setAcceptTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>초안 수락</DialogTitle>
            <DialogDescription>
              이 초안을 수락하면 자동 DM 자동화로 생성됩니다. 실행 전 게시물을
              선택해야 합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptTarget(null)}>
              취소
            </Button>
            <Button onClick={handleAccept}>
              <Check className="h-4 w-4 mr-1.5" />
              수락
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 거절 다이얼로그 */}
      <Dialog open={!!rejectTarget} onOpenChange={() => {
        setRejectTarget(null);
        setRejectReason("");
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>초안 거절</DialogTitle>
            <DialogDescription>
              거절 사유를 입력해주세요. (선택사항)
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="거절 사유를 입력하세요..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setRejectTarget(null);
              setRejectReason("");
            }}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <X className="h-4 w-4 mr-1.5" />
              거절
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccountLinkingGate>
  );
}
