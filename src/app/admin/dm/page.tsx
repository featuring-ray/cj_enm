"use client";

import { useState } from "react";
import {
  Settings,
  Send,
  Users,
  AlertTriangle,
  BarChart3,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  Clock,
  XCircle,
  Save,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// ─── Mock 데이터 ──────────────────────────────────────────
const mockDmAccounts = [
  {
    id: "acct-1",
    handle: "@onstyle_official",
    platform: "instagram",
    status: "active",
    dailyLimit: 200,
    sentToday: 87,
    isDefault: true,
  },
  {
    id: "acct-2",
    handle: "@cjenm_partner",
    platform: "instagram",
    status: "active",
    dailyLimit: 150,
    sentToday: 43,
    isDefault: false,
  },
  {
    id: "acct-3",
    handle: "@onstyle_creator",
    platform: "instagram",
    status: "inactive",
    dailyLimit: 100,
    sentToday: 0,
    isDefault: false,
  },
];

const mockPolicies = {
  dailyLimitPerMd: 50,
  cooldownHours: 72,
  maxRetries: 2,
  autoResend: false,
  blacklistEnabled: true,
};

const mockStats = {
  totalSent: 12480,
  successRate: 94.2,
  readRate: 68.5,
  failedCount: 724,
  thisMonth: 3241,
  lastMonth: 2987,
};

const mockDmHistory = [
  {
    id: "h-1",
    sender: "admin@cjenm.com",
    recipient: "@beauty_jiyeon",
    template: "캠페인 참여 제안",
    sentAt: "2026-03-14 14:32",
    status: "read",
  },
  {
    id: "h-2",
    sender: "md01@cjenm.com",
    recipient: "@fashion_mina",
    template: "온트너 가입 제안",
    sentAt: "2026-03-14 13:15",
    status: "sent",
  },
  {
    id: "h-3",
    sender: "md02@cjenm.com",
    recipient: "@food_hana",
    template: "캠페인 참여 제안",
    sentAt: "2026-03-13 11:00",
    status: "failed",
  },
  {
    id: "h-4",
    sender: "admin@cjenm.com",
    recipient: "@lifestyle_soo",
    template: "온트너 가입 제안",
    sentAt: "2026-03-13 09:45",
    status: "read",
  },
  {
    id: "h-5",
    sender: "md03@cjenm.com",
    recipient: "@tech_yuna",
    template: "캠페인 참여 제안",
    sentAt: "2026-03-12 17:20",
    status: "sent",
  },
];

const STATUS_MAP = {
  active: { label: "활성", variant: "default" as const },
  inactive: { label: "비활성", variant: "secondary" as const },
};

const DM_STATUS_MAP = {
  sent: {
    label: "발송",
    icon: Clock,
    className: "text-blue-600",
  },
  read: {
    label: "읽음",
    icon: CheckCircle2,
    className: "text-green-600",
  },
  failed: {
    label: "실패",
    icon: XCircle,
    className: "text-red-500",
  },
};

// ─── 컴포넌트 ─────────────────────────────────────────────
export default function AdminDmPage() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [newHandle, setNewHandle] = useState("");
  const [newDailyLimit, setNewDailyLimit] = useState("100");
  const [accounts, setAccounts] = useState(mockDmAccounts);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSavePolicies = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleAddAccount = () => {
    if (!newHandle.trim()) return;
    setAccounts((prev) => [
      ...prev,
      {
        id: `acct-${Date.now()}`,
        handle: newHandle.startsWith("@") ? newHandle : `@${newHandle}`,
        platform: "instagram",
        status: "active",
        dailyLimit: parseInt(newDailyLimit) || 100,
        sentToday: 0,
        isDefault: false,
      },
    ]);
    setNewHandle("");
    setNewDailyLimit("100");
    setAddAccountOpen(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <>
      <PageHeader
        title="DM 어드민 설정"
        description="DM 발송 계정 관리 및 발송 정책을 설정합니다"
        actions={
          <Badge variant="outline" className="text-xs">
            A-A-01
          </Badge>
        }
      />

      <main className="flex-1 p-6 space-y-6">
        {/* 통계 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "총 발송",
              value: mockStats.totalSent.toLocaleString(),
              icon: Send,
              color: "text-blue-600",
            },
            {
              label: "성공률",
              value: `${mockStats.successRate}%`,
              icon: CheckCircle2,
              color: "text-green-600",
            },
            {
              label: "읽음률",
              value: `${mockStats.readRate}%`,
              icon: Users,
              color: "text-purple-600",
            },
            {
              label: "실패",
              value: mockStats.failedCount.toLocaleString(),
              icon: XCircle,
              color: "text-red-500",
            },
            {
              label: "이번 달",
              value: mockStats.thisMonth.toLocaleString(),
              icon: BarChart3,
              color: "text-orange-500",
            },
            {
              label: "지난 달",
              value: mockStats.lastMonth.toLocaleString(),
              icon: BarChart3,
              color: "text-gray-500",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                    <div>
                      <p className="text-lg font-bold leading-tight">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="accounts">
          <TabsList>
            <TabsTrigger value="accounts">발송 계정 관리</TabsTrigger>
            <TabsTrigger value="policy">발송 정책</TabsTrigger>
            <TabsTrigger value="history">발송 이력</TabsTrigger>
          </TabsList>

          {/* 발송 계정 관리 탭 */}
          <TabsContent value="accounts" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">DM 발송 계정</CardTitle>
                    <CardDescription className="mt-1">
                      온트러스트 MD가 DM 발송 시 사용할 인스타그램 계정을 관리합니다
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setAddAccountOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    계정 추가
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">계정</TableHead>
                      <TableHead>플랫폼</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">일일 한도</TableHead>
                      <TableHead className="text-right">오늘 발송</TableHead>
                      <TableHead className="text-center">기본 계정</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => {
                      const statusInfo = STATUS_MAP[account.status as keyof typeof STATUS_MAP];
                      const usageRate = (account.sentToday / account.dailyLimit) * 100;
                      return (
                        <TableRow key={account.id}>
                          <TableCell className="pl-6 font-medium">
                            {account.handle}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              Instagram
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {statusInfo && (
                              <Badge variant={statusInfo.variant}>
                                {statusInfo.label}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {account.dailyLimit}건
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                usageRate > 80
                                  ? "text-orange-600 font-medium"
                                  : ""
                              }
                            >
                              {account.sentToday}건
                            </span>
                            {usageRate > 80 && (
                              <AlertTriangle className="inline h-3 w-3 text-orange-500 ml-1" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {account.isDefault ? (
                              <Badge variant="default" className="text-[10px]">
                                기본
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleDeleteAccount(account.id)}
                                disabled={account.isDefault}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 발송 정책 탭 */}
          <TabsContent value="policy" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    발송 제한 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>MD별 일일 발송 한도</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={policies.dailyLimitPerMd}
                        onChange={(e) =>
                          setPolicies({
                            ...policies,
                            dailyLimitPerMd: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">건 / 일</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      MD 1명이 하루에 발송할 수 있는 최대 DM 수
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>동일 수신자 재발송 대기 시간</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={policies.cooldownHours}
                        onChange={(e) =>
                          setPolicies({
                            ...policies,
                            cooldownHours: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">시간</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      같은 크리에이터에게 다시 DM 발송 가능한 최소 대기 시간
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>발송 실패 시 재시도 횟수</Label>
                    <Select
                      value={String(policies.maxRetries)}
                      onValueChange={(v) =>
                        setPolicies({ ...policies, maxRetries: parseInt(v) })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}회
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    추가 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>자동 재발송</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        실패한 DM을 자동으로 재발송
                      </p>
                    </div>
                    <Switch
                      checked={policies.autoResend}
                      onCheckedChange={(v) =>
                        setPolicies({ ...policies, autoResend: v })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>블랙리스트 필터 사용</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        브랜드 공식계정·연예인 계정 발송 차단
                      </p>
                    </div>
                    <Switch
                      checked={policies.blacklistEnabled}
                      onCheckedChange={(v) =>
                        setPolicies({ ...policies, blacklistEnabled: v })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>등급별 팔로워 유사도 분석 횟수</Label>
                    <div className="space-y-2 text-sm">
                      {[
                        { tier: "GOLD", limit: 10 },
                        { tier: "SILVER", limit: 5 },
                        { tier: "BRONZE", limit: 2 },
                      ].map((item) => (
                        <div
                          key={item.tier}
                          className="flex items-center justify-between"
                        >
                          <span className="text-muted-foreground">
                            {item.tier}
                          </span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              defaultValue={item.limit}
                              className="w-16 h-7 text-xs"
                            />
                            <span className="text-xs text-muted-foreground">
                              회/월
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleSavePolicies}>
                <Save className="h-4 w-4 mr-1" />
                {savedAlert ? "저장 완료!" : "설정 저장"}
              </Button>
            </div>
          </TabsContent>

          {/* 발송 이력 탭 */}
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">전체 DM 발송 이력</CardTitle>
                <CardDescription>
                  시스템 전체의 DM 발송 기록을 조회합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">발신자</TableHead>
                      <TableHead>수신자</TableHead>
                      <TableHead>템플릿</TableHead>
                      <TableHead>발송 일시</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDmHistory.map((item) => {
                      const statusInfo = DM_STATUS_MAP[item.status as keyof typeof DM_STATUS_MAP];
                      const Icon = statusInfo?.icon;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="pl-6 text-sm">
                            {item.sender}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {item.recipient}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              {item.template}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.sentAt}
                          </TableCell>
                          <TableCell>
                            {statusInfo && Icon && (
                              <span
                                className={`flex items-center gap-1 text-xs ${statusInfo.className}`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {statusInfo.label}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* 계정 추가 다이얼로그 */}
      <Dialog open={addAccountOpen} onOpenChange={setAddAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>발송 계정 추가</DialogTitle>
            <DialogDescription>
              DM 발송에 사용할 인스타그램 계정을 추가합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>인스타그램 핸들</Label>
              <Input
                placeholder="@계정명"
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>일일 발송 한도</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newDailyLimit}
                  onChange={(e) => setNewDailyLimit(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">건 / 일</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAccountOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddAccount} disabled={!newHandle.trim()}>
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
