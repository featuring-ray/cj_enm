"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  BarChart3,
  FileText,
  Users,
  MousePointerClick,
  TrendingUp,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PerformanceTable } from "@/components/auto-dm/performance-table";
import { DraftCard } from "@/components/auto-dm/draft-card";
import { DraftFormDialog } from "@/components/auto-dm/draft-form-dialog";
import { DraftSendDialog } from "@/components/auto-dm/draft-send-dialog";
import draftsData from "@/data/mock/auto-dm-drafts.json";
import performanceData from "@/data/mock/auto-dm-performance.json";
import campaignsData from "@/data/mock/campaigns.json";
import type { AutoDmDraft } from "@/types/auto-dm-draft";
import type { AutoDmPerformanceRow } from "@/types/auto-dm-draft";

export default function DmPage() {
  // ── 성과 탭 상태 ──
  const [perfCampaignFilter, setPerfCampaignFilter] = useState("all");
  const [perfSearch, setPerfSearch] = useState("");
  const perfData = performanceData as AutoDmPerformanceRow[];

  const filteredPerf = useMemo(() => {
    let result = perfData;
    if (perfCampaignFilter !== "all") {
      result = result.filter((r) => r.campaignId === perfCampaignFilter);
    }
    if (perfSearch.trim()) {
      const q = perfSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.influencerHandle.toLowerCase().includes(q) ||
          r.influencerName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [perfData, perfCampaignFilter, perfSearch]);

  // 요약 카드 데이터
  const summaryCards = useMemo(() => {
    const totalActive = filteredPerf.length;
    const totalRecipients = filteredPerf.reduce(
      (s, r) => s + r.uniqueRecipients,
      0
    );
    const totalClickers = filteredPerf.reduce(
      (s, r) => s + r.uniqueClickers,
      0
    );
    const avgCtr =
      totalRecipients > 0
        ? ((totalClickers / totalRecipients) * 100).toFixed(1)
        : "0.0";
    const totalFollow = filteredPerf.reduce(
      (s, r) => s + r.followConversions,
      0
    );
    return { totalActive, totalRecipients, avgCtr, totalFollow };
  }, [filteredPerf]);

  // 캠페인 필터 옵션 (성과 데이터에 있는 캠페인만)
  const campaignOptions = useMemo(() => {
    const ids = [...new Set(perfData.map((r) => r.campaignId))];
    return ids
      .map((id) => {
        const c = campaignsData.find((c) => c.id === id);
        return c ? { id: c.id, name: c.name } : null;
      })
      .filter(Boolean) as { id: string; name: string }[];
  }, [perfData]);

  // ── 초안 관리 탭 상태 ──
  const [drafts, setDrafts] = useState<AutoDmDraft[]>(
    draftsData as AutoDmDraft[]
  );
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<AutoDmDraft | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendingDraft, setSendingDraft] = useState<AutoDmDraft | null>(null);
  const [previewDraft, setPreviewDraft] = useState<AutoDmDraft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AutoDmDraft | null>(null);

  const handleSaveDraft = (data: Partial<AutoDmDraft>) => {
    if (data.id) {
      // 수정
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === data.id
            ? {
                ...d,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : d
        )
      );
    } else {
      // 생성
      const newDraft: AutoDmDraft = {
        id: `draft-${Date.now()}`,
        name: data.name || "",
        status: "작성 중",
        triggerMode: data.triggerMode || "keywords",
        keywords: data.keywords || [],
        autoReplyEnabled: data.autoReplyEnabled || false,
        replyTexts: data.replyTexts || ["", "", ""],
        dmMessageBody: data.dmMessageBody || "",
        dmImageUrl: null,
        buttons: data.buttons || [
          { enabled: false, name: "", url: "" },
          { enabled: false, name: "", url: "" },
          { enabled: false, name: "", url: "" },
        ],
        followerFlow: data.followerFlow || {
          enabled: false,
          actionAMessage: "",
          actionAButtonName: "",
          actionBMessage: "",
          actionBButtonName: "",
        },
        createdBy: "md-001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDrafts((prev) => [newDraft, ...prev]);
    }
  };

  const handleDuplicateDraft = (draft: AutoDmDraft) => {
    const dup: AutoDmDraft = {
      ...draft,
      id: `draft-${Date.now()}`,
      name: `${draft.name} (복사본)`,
      status: "작성 중",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDrafts((prev) => [dup, ...prev]);
  };

  const handleDeleteDraft = () => {
    if (!deleteTarget) return;
    setDrafts((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleSendDraft = (campaignId: string, creatorIds: string[]) => {
    if (!sendingDraft) return;
    // Mock: 상태를 발송 완료로 변경
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === sendingDraft.id
          ? { ...d, status: "발송 완료" as const }
          : d
      )
    );
    alert(
      `"${sendingDraft.name}" 초안이 ${creatorIds.length}명의 크리에이터에게 발송되었습니다.`
    );
    setSendingDraft(null);
  };

  return (
    <>
      <PageHeader
        title="자동 DM 관리"
        description="자동 DM 성과 조회 및 초안을 관리합니다"
      />

      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="performance">
          <TabsList>
            <TabsTrigger value="performance" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              성과 대시보드
            </TabsTrigger>
            <TabsTrigger value="drafts" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              초안 관리
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: 성과 대시보드 ── */}
          <TabsContent value="performance" className="space-y-4 mt-4">
            {/* 요약 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center gap-3 pt-4 pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      총 활성 자동화
                    </p>
                    <p className="text-xl font-bold">
                      {summaryCards.totalActive}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 pt-4 pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      총 DM 수신 인원
                    </p>
                    <p className="text-xl font-bold">
                      {summaryCards.totalRecipients.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 pt-4 pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                    <MousePointerClick className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      평균 클릭률
                    </p>
                    <p className="text-xl font-bold">
                      {summaryCards.avgCtr}%
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 pt-4 pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      팔로우 전환 인원
                    </p>
                    <p className="text-xl font-bold">
                      {summaryCards.totalFollow.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 필터 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={perfCampaignFilter}
                onValueChange={setPerfCampaignFilter}
              >
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="캠페인 전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">캠페인 전체</SelectItem>
                  {campaignOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name.length > 25 ? c.name.slice(0, 25) + "..." : c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="인플루언서 검색..."
                  value={perfSearch}
                  onChange={(e) => setPerfSearch(e.target.value)}
                />
              </div>
            </div>

            {/* 성과 테이블 */}
            <PerformanceTable data={filteredPerf} />
          </TabsContent>

          {/* ── Tab 2: 초안 관리 ── */}
          <TabsContent value="drafts" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  setEditingDraft(null);
                  setFormDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                새 초안 만들기
              </Button>
            </div>

            {drafts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    생성된 초안이 없습니다.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setEditingDraft(null);
                      setFormDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    첫 초안 만들기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drafts.map((draft) => (
                  <DraftCard
                    key={draft.id}
                    draft={draft}
                    onEdit={(d) => {
                      setEditingDraft(d);
                      setFormDialogOpen(true);
                    }}
                    onDuplicate={handleDuplicateDraft}
                    onDelete={setDeleteTarget}
                    onPreview={setPreviewDraft}
                    onSend={(d) => {
                      setSendingDraft(d);
                      setSendDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* 초안 생성/수정 다이얼로그 */}
      <DraftFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        draft={editingDraft}
        onSave={handleSaveDraft}
      />

      {/* 초안 발송 다이얼로그 */}
      {sendingDraft && (
        <DraftSendDialog
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
          draftName={sendingDraft.name}
          onSend={handleSendDraft}
        />
      )}

      {/* 미리보기 다이얼로그 */}
      <Dialog
        open={!!previewDraft}
        onOpenChange={() => setPreviewDraft(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>초안 미리보기</DialogTitle>
          </DialogHeader>
          {previewDraft && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">초안 이름</p>
                <p className="text-sm font-medium">{previewDraft.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">DM 메시지</p>
                <div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap">
                  {previewDraft.dmMessageBody || "(메시지 미작성)"}
                </div>
              </div>
              {previewDraft.buttons.some((b) => b.enabled) && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">CTA 버튼</p>
                  <div className="space-y-1.5">
                    {previewDraft.buttons
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDraft(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>초안 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            &quot;{deleteTarget?.name}&quot; 초안을 삭제하시겠습니까?
            <br />이 작업은 되돌릴 수 없습니다.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteDraft}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
