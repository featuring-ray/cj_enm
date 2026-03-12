"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  User,
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
import mockCreatorsJson from "@/data/mock/creators.json";

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

export default function OnttrustCollaborationPage() {
  const [applications, setApplications] = useState<Application[]>(
    mockApplicationsJson.map((a) => ({ ...a, status: a.status as AppStatus }))
  );
  const [proposals, setProposals] = useState<Proposal[]>(
    mockProposalsJson.map((p) => ({ ...p, status: p.status as AppStatus }))
  );

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmLabel: string;
    variant?: "destructive" | "default";
  }>({ open: false, title: "", description: "", onConfirm: () => {}, confirmLabel: "" });

  function openConfirm(opts: typeof confirmDialog) {
    setConfirmDialog(opts);
  }

  function respondApplication(id: string, action: "수락" | "거절", handle: string, campaignName: string) {
    if (action === "거절") {
      openConfirm({
        open: true,
        title: "신청을 거절하시겠어요?",
        description: `@${handle}의 "${campaignName}" 참여 신청을 거절합니다.`,
        confirmLabel: "거절하기",
        variant: "destructive",
        onConfirm: () => setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "거절" } : a))),
      });
    } else {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "수락" } : a)));
    }
  }

  function cancelProposal(id: string, handle: string, campaignName: string) {
    openConfirm({
      open: true,
      title: "제안을 취소하시겠어요?",
      description: `@${handle}에게 보낸 "${campaignName}" 참여 제안을 취소합니다.`,
      confirmLabel: "취소하기",
      variant: "destructive",
      onConfirm: () => setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: "취소" } : p))),
    });
  }

  function getCampaign(id: string) { return mockCampaignsJson.find((c) => c.id === id); }
  function getCreator(id: string) { return mockCreatorsJson.find((c) => c.id === id); }

  const pendingApps = applications.filter((a) => a.status === "대기").length;
  const pendingProps = proposals.filter((p) => p.status === "대기").length;

  return (
    <>
      <PageHeader
        title="캠페인 협업 관리"
        description="크리에이터 참여 신청 및 제안 발신 현황을 관리합니다"
      />

      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="applications">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">
              참여 신청건
              {pendingApps > 0 && (
                <Badge variant="destructive" className="ml-1.5 text-[10px] h-4 px-1.5">
                  {pendingApps}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="proposals">
              참여 제안건
              {pendingProps > 0 && (
                <Badge className="ml-1.5 text-[10px] h-4 px-1.5 bg-blue-500">
                  {pendingProps}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* 참여 신청건 (크리에이터→MD, MD가 수락/거절) */}
          <TabsContent value="applications" className="space-y-3">
            {applications.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">접수된 신청건이 없습니다.</div>
            ) : (
              applications.map((app) => {
                const campaign = getCampaign(app.campaignId);
                const creator = getCreator(app.creatorId);
                if (!campaign || !creator) return null;
                return (
                  <Card key={app.id}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={app.status} />
                          <span className="text-xs text-muted-foreground">신청일 {formatDate(app.appliedAt)}</span>
                          {app.respondedAt && (
                            <span className="text-xs text-muted-foreground">· 처리일 {formatDate(app.respondedAt)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">캠페인</p>
                          <p className="text-sm font-semibold">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">{campaign.brand} · {campaign.brandCategory}</p>
                        </div>
                        <Link href={`/ontrust/creator/${creator.id}`} className="group inline-flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">@{creator.handle}</span>
                          <span className="text-xs text-muted-foreground">팔로워 {creator.followers.toLocaleString()}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                        {app.message && (
                          <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 line-clamp-2">
                            &ldquo;{app.message}&rdquo;
                          </p>
                        )}
                      </div>
                      {app.status === "대기" && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 h-8"
                            onClick={() => respondApplication(app.id, "수락", creator.handle, campaign.name)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            수락
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => respondApplication(app.id, "거절", creator.handle, campaign.name)}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
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

          {/* 참여 제안건 (MD→크리에이터, MD가 취소 가능) */}
          <TabsContent value="proposals" className="space-y-3">
            {proposals.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">발신된 제안건이 없습니다.</div>
            ) : (
              proposals.map((prop) => {
                const campaign = getCampaign(prop.campaignId);
                const creator = getCreator(prop.creatorId);
                if (!campaign || !creator) return null;
                return (
                  <Card key={prop.id}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={prop.status} />
                          <span className="text-xs text-muted-foreground">발신일 {formatDate(prop.proposedAt)}</span>
                          {prop.respondedAt && (
                            <span className="text-xs text-muted-foreground">· 응답일 {formatDate(prop.respondedAt)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">캠페인</p>
                          <p className="text-sm font-semibold">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">{campaign.brand} · {campaign.brandCategory}</p>
                        </div>
                        <Link href={`/ontrust/creator/${creator.id}`} className="group inline-flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">@{creator.handle}</span>
                          <span className="text-xs text-muted-foreground">팔로워 {creator.followers.toLocaleString()}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                        {prop.message && (
                          <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 line-clamp-2">
                            &ldquo;{prop.message}&rdquo;
                          </p>
                        )}
                      </div>
                      {prop.status === "대기" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => cancelProposal(prop.id, creator.handle, campaign.name)}
                        >
                          제안 취소
                        </Button>
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
              유지하기
            </Button>
            <Button
              variant={confirmDialog.variant === "destructive" ? "destructive" : "default"}
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
