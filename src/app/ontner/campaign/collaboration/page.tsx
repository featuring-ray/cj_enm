"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mockApplicationsJson from "@/data/mock/campaign-applications.json";
import mockProposalsJson from "@/data/mock/campaign-proposals.json";
import mockCampaignsJson from "@/data/mock/campaigns.json";

/* 현재 로그인 크리에이터 (Mock) */
const CURRENT_CREATOR_ID = "creator-1";

type AppStatus = "대기" | "수락" | "거절" | "취소";
type Application = (typeof mockApplicationsJson)[0] & { status: AppStatus };
type Proposal = (typeof mockProposalsJson)[0] & { status: AppStatus };

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; icon: React.ElementType }> = {
  대기: { label: "검토 중", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  수락: { label: "수락됨", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  거절: { label: "거절됨", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  취소: { label: "취소됨", color: "bg-gray-50 text-gray-500 border-gray-200", icon: Ban },
};

function StatusBadge({ status }: { status: AppStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-medium ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
}

export default function OntnerCollaborationPage() {
  const [applications, setApplications] = useState<Application[]>(
    mockApplicationsJson
      .filter((a) => a.creatorId === CURRENT_CREATOR_ID)
      .map((a) => ({ ...a, status: a.status as AppStatus }))
  );
  const [proposals, setProposals] = useState<Proposal[]>(
    mockProposalsJson
      .filter((p) => p.creatorId === CURRENT_CREATOR_ID)
      .map((p) => ({ ...p, status: p.status as AppStatus }))
  );

  /* 확인 다이얼로그 상태 */
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmLabel: string;
    variant?: "destructive" | "default";
  }>({ open: false, title: "", description: "", onConfirm: () => {}, confirmLabel: "", variant: "default" });

  function openConfirm(opts: typeof confirmDialog) {
    setConfirmDialog(opts);
  }

  function cancelApplication(id: string, campaignName: string) {
    openConfirm({
      open: true,
      title: "신청을 취소하시겠어요?",
      description: `"${campaignName}" 캠페인 참여 신청을 취소합니다. 이 작업은 되돌릴 수 없습니다.`,
      confirmLabel: "취소하기",
      variant: "destructive",
      onConfirm: () => setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "취소" } : a))),
    });
  }

  function respondProposal(id: string, action: "수락" | "거절", campaignName: string) {
    if (action === "수락") {
      openConfirm({
        open: true,
        title: "제안을 수락하시겠어요?",
        description: `"${campaignName}" 캠페인 참여 제안을 수락합니다.`,
        confirmLabel: "수락하기",
        variant: "default",
        onConfirm: () => setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: "수락" } : p))),
      });
    } else {
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: "거절" } : p)));
    }
  }

  function getCampaign(id: string) {
    return mockCampaignsJson.find((c) => c.id === id);
  }

  return (
    <>
      <PageHeader
        title="캠페인 협업 관리"
        description="신청하거나 제안받은 캠페인의 진행 상태를 확인합니다"
      />

      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="applications">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">
              참여 신청한 캠페인
              {applications.filter((a) => a.status === "대기").length > 0 && (
                <span className="ml-1.5 rounded-full bg-violet-100 text-violet-700 text-[10px] px-1.5 py-0.5 font-semibold">
                  {applications.filter((a) => a.status === "대기").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="proposals">
              참여 제안받은 캠페인
              {proposals.filter((p) => p.status === "대기").length > 0 && (
                <span className="ml-1.5 rounded-full bg-violet-100 text-violet-700 text-[10px] px-1.5 py-0.5 font-semibold">
                  {proposals.filter((p) => p.status === "대기").length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* 참여 신청한 캠페인 */}
          <TabsContent value="applications" className="space-y-3">
            {applications.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">신청한 캠페인이 없습니다.</div>
            ) : (
              applications.map((app) => {
                const campaign = getCampaign(app.campaignId);
                if (!campaign) return null;
                return (
                  <Card key={app.id}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={app.status} />
                          <span className="text-xs text-muted-foreground">신청일 {formatDate(app.appliedAt)}</span>
                          {app.respondedAt && (
                            <span className="text-xs text-muted-foreground">· 응답일 {formatDate(app.respondedAt)}</span>
                          )}
                        </div>
                        <Link href={`/ontner/campaign/${campaign.id}`} className="group flex items-center gap-1">
                          <p className="text-sm font-semibold group-hover:text-violet-600 transition-colors">{campaign.name}</p>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{campaign.brand} · {campaign.brandCategory} · {campaign.reward}</p>
                        {app.message && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-1 bg-muted/50 rounded px-2 py-1">
                            &ldquo;{app.message}&rdquo;
                          </p>
                        )}
                      </div>
                      {app.status === "대기" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => cancelApplication(app.id, campaign.name)}
                        >
                          신청 취소
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* 참여 제안받은 캠페인 */}
          <TabsContent value="proposals" className="space-y-3">
            {proposals.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">수신된 제안이 없습니다.</div>
            ) : (
              proposals.map((prop) => {
                const campaign = getCampaign(prop.campaignId);
                if (!campaign) return null;
                return (
                  <Card key={prop.id}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={prop.status} />
                          <span className="text-xs text-muted-foreground">제안일 {formatDate(prop.proposedAt)}</span>
                          {prop.respondedAt && (
                            <span className="text-xs text-muted-foreground">· 응답일 {formatDate(prop.respondedAt)}</span>
                          )}
                        </div>
                        <Link href={`/ontner/campaign/${campaign.id}`} className="group flex items-center gap-1">
                          <p className="text-sm font-semibold group-hover:text-violet-600 transition-colors">{campaign.name}</p>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{campaign.brand} · {campaign.brandCategory} · {campaign.reward}</p>
                        {prop.message && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-violet-50 border border-violet-100 rounded px-2 py-1">
                            &ldquo;{prop.message}&rdquo;
                          </p>
                        )}
                      </div>
                      {prop.status === "대기" && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            size="sm"
                            className="bg-violet-600 hover:bg-violet-700 h-8"
                            onClick={() => respondProposal(prop.id, "수락", campaign.name)}
                          >
                            수락
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => respondProposal(prop.id, "거절", campaign.name)}
                          >
                            거절
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* 확인 다이얼로그 */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((d) => ({ ...d, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog((d) => ({ ...d, open: false }))}>
              취소
            </Button>
            <Button
              variant={confirmDialog.variant === "destructive" ? "destructive" : "default"}
              className={confirmDialog.variant !== "destructive" ? "bg-violet-600 hover:bg-violet-700" : ""}
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog((d) => ({ ...d, open: false }));
              }}
            >
              {confirmDialog.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
