"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import deliveriesData from "@/data/mock/auto-dm-draft-deliveries.json";
import type { DraftDelivery } from "@/types/auto-dm-draft";

const deliveries = deliveriesData as DraftDelivery[];

const DELIVERY_STATUS_MAP: Record<string, { icon: typeof Clock; className: string }> = {
  "대기 중": { icon: Clock, className: "text-amber-600" },
  "수락": { icon: CheckCircle2, className: "text-blue-600" },
  "적용 완료": { icon: CheckCircle2, className: "text-green-600" },
  "거절": { icon: XCircle, className: "text-red-500" },
};

export default function AdminDmPage() {
  const [blacklistEnabled, setBlacklistEnabled] = useState(true);
  const [defaultFollowAMsg, setDefaultFollowAMsg] = useState(
    "아직 팔로우를 하지 않으셨네요! 팔로우하고 혜택을 받아보세요."
  );
  const [defaultFollowBMsg, setDefaultFollowBMsg] = useState(
    "팔로우 감사합니다! 아래 링크에서 혜택을 확인하세요."
  );
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="어드민 설정"
        description="자동 DM 초안 발송 이력 및 시스템 설정을 관리합니다"
      />

      <main className="flex-1 p-4 space-y-4">
        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">초안 발송 이력</TabsTrigger>
            <TabsTrigger value="settings">시스템 설정</TabsTrigger>
          </TabsList>

          {/* 초안 발송 이력 탭 */}
          <TabsContent value="history" className="mt-4">
            <div className="otr-section-marker">
              <FileText className="h-4 w-4" />
              ◆ 초안 발송 이력
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              어떤 초안이 어떤 크리에이터에게 언제 발송되었는지 조회합니다
            </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">초안명</TableHead>
                      <TableHead>캠페인</TableHead>
                      <TableHead>크리에이터</TableHead>
                      <TableHead>발송일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>수락/거절일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((d) => {
                      const statusInfo = DELIVERY_STATUS_MAP[d.status];
                      const Icon = statusInfo?.icon;
                      return (
                        <TableRow key={d.id}>
                          <TableCell className="pl-6 font-medium text-sm">
                            {d.draftName}
                          </TableCell>
                          <TableCell className="text-sm">
                            {d.campaignName.length > 20
                              ? d.campaignName.slice(0, 20) + "..."
                              : d.campaignName}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{d.creatorName}</p>
                              <p className="text-xs text-muted-foreground">
                                {d.creatorHandle}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(d.sentAt).toLocaleDateString("ko-KR")}
                          </TableCell>
                          <TableCell>
                            {statusInfo && Icon ? (
                              <span
                                className={`flex items-center gap-1 text-xs ${statusInfo.className}`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {d.status}
                              </span>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                {d.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {d.acceptedAt
                              ? new Date(d.acceptedAt).toLocaleDateString("ko-KR")
                              : d.rejectedAt
                              ? new Date(d.rejectedAt).toLocaleDateString("ko-KR")
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
          </TabsContent>

          {/* 시스템 설정 탭 */}
          <TabsContent value="settings" className="mt-4">
            <div className="max-w-2xl space-y-4">
              <div className="otr-section-marker">
                <Settings className="h-4 w-4" />
                ◆ 시스템 설정
              </div>
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>블랙리스트 필터 사용</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        브랜드 공식계정·연예인 계정 초안 발송 차단
                      </p>
                    </div>
                    <Switch
                      checked={blacklistEnabled}
                      onCheckedChange={setBlacklistEnabled}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>기본 팔로워 유도 메시지 (미팔로우)</Label>
                    <Input
                      value={defaultFollowAMsg}
                      onChange={(e) => setDefaultFollowAMsg(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>기본 팔로워 유도 메시지 (팔로우)</Label>
                    <Input
                      value={defaultFollowBMsg}
                      onChange={(e) => setDefaultFollowBMsg(e.target.value)}
                    />
                  </div>
              </div>

              <div className="flex justify-end">
                <Button className="otr-btn-primary" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  {savedAlert ? "저장 완료!" : "설정 저장"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
