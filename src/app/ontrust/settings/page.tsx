"use client";

import { useState } from "react";
import {
  Settings,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  Shield,
  Key,
  Plus,
  Trash2,
  Search,
  Crown,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// ──────────── Mock 데이터 ────────────

interface IntegrationAccount {
  id: string;
  platform: "instagram" | "youtube";
  handle: string;
  connectedAt: string;
  status: "connected" | "error" | "pending";
  lastSync: string;
  followerCount: number;
}

interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
  lastActive: string;
  status: "active" | "invited";
}

const MOCK_ACCOUNTS: IntegrationAccount[] = [
  { id: "a1", platform: "instagram", handle: "@onstyle_official", connectedAt: "2025-01-10", status: "connected", lastSync: "2025-03-12 09:23", followerCount: 182000 },
  { id: "a2", platform: "instagram", handle: "@cj_beauty", connectedAt: "2025-01-15", status: "connected", lastSync: "2025-03-12 09:20", followerCount: 97000 },
  { id: "a3", platform: "instagram", handle: "@cj_fashion", connectedAt: "2025-02-01", status: "error", lastSync: "2025-03-10 14:05", followerCount: 64000 },
  { id: "a4", platform: "youtube", handle: "@OnStyle_Official", connectedAt: "2025-01-20", status: "connected", lastSync: "2025-03-12 08:45", followerCount: 235000 },
  { id: "a5", platform: "instagram", handle: "@onstyle_living", connectedAt: "2025-02-10", status: "pending", lastSync: "-", followerCount: 0 },
];

const MOCK_MEMBERS: WorkspaceMember[] = [
  { id: "m1", name: "김지수", email: "jisoo.kim@cjenm.com", role: "owner", joinedAt: "2024-10-01", lastActive: "2025-03-12", status: "active" },
  { id: "m2", name: "이민준", email: "minjun.lee@cjenm.com", role: "admin", joinedAt: "2024-10-05", lastActive: "2025-03-12", status: "active" },
  { id: "m3", name: "박서연", email: "seoyeon.park@cjenm.com", role: "member", joinedAt: "2024-11-01", lastActive: "2025-03-11", status: "active" },
  { id: "m4", name: "최도현", email: "dohyun.choi@cjenm.com", role: "member", joinedAt: "2024-11-15", lastActive: "2025-03-10", status: "active" },
  { id: "m5", name: "정하은", email: "haeun.jung@cjenm.com", role: "member", joinedAt: "2024-12-01", lastActive: "2025-03-09", status: "active" },
  { id: "m6", name: "강민서", email: "minseo.kang@cjenm.com", role: "member", joinedAt: "2025-01-10", lastActive: "2025-03-08", status: "active" },
  { id: "m7", name: "윤지호", email: "jiho.yoon@cjenm.com", role: "member", joinedAt: "2025-01-20", lastActive: "2025-03-07", status: "active" },
  { id: "m8", name: "장수아", email: "sua.jang@cjenm.com", role: "member", joinedAt: "2025-02-01", lastActive: "2025-03-05", status: "active" },
  { id: "m9", name: "오태양", email: "taeyang.oh@cjenm.com", role: "member", joinedAt: "2025-02-15", lastActive: "2025-02-28", status: "active" },
  { id: "m10", name: "한채원", email: "chaewon.han@cjenm.com", role: "admin", joinedAt: "2025-02-20", lastActive: "2025-03-11", status: "active" },
  { id: "m11", name: "(초대 대기)", email: "newmd1@cjenm.com", role: "member", joinedAt: "-", lastActive: "-", status: "invited" },
  { id: "m12", name: "(초대 대기)", email: "newmd2@partner.com", role: "member", joinedAt: "-", lastActive: "-", status: "invited" },
];

const LICENSE_LIMIT = 500;
const LICENSE_USED = MOCK_MEMBERS.filter((m) => m.status === "active").length;
const ACCOUNT_LIMIT = 20;

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString("ko-KR");
}

const ROLE_LABELS: Record<string, string> = { owner: "오너", admin: "관리자", member: "멤버" };
const ROLE_COLORS: Record<string, string> = {
  owner: "bg-yellow-100 text-yellow-800 border-yellow-300",
  admin: "bg-purple-100 text-purple-800 border-purple-300",
  member: "bg-gray-100 text-gray-700 border-gray-200",
};
const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-100 text-pink-700 border-pink-200",
  youtube: "bg-red-100 text-red-700 border-red-200",
};

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<IntegrationAccount[]>(MOCK_ACCOUNTS);
  const [members, setMembers] = useState<WorkspaceMember[]>(MOCK_MEMBERS);
  const [memberSearch, setMemberSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [deleteMember, setDeleteMember] = useState<WorkspaceMember | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  const filteredMembers = members.filter(
    (m) =>
      m.name.includes(memberSearch) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const connectedCount = accounts.filter((a) => a.status === "connected").length;
  const errorCount = accounts.filter((a) => a.status === "error").length;

  function handleSync(accountId: string) {
    setSyncing(accountId);
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountId
            ? { ...a, status: "connected", lastSync: new Date().toLocaleString("ko-KR") }
            : a
        )
      );
      setSyncing(null);
    }, 1800);
  }

  function handleInvite() {
    if (!inviteEmail.trim()) return;
    const newMember: WorkspaceMember = {
      id: `m${Date.now()}`,
      name: "(초대 대기)",
      email: inviteEmail.trim(),
      role: inviteRole,
      joinedAt: "-",
      lastActive: "-",
      status: "invited",
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setInviteRole("member");
    setInviteOpen(false);
  }

  function handleDeleteMember() {
    if (!deleteMember) return;
    setMembers((prev) => prev.filter((m) => m.id !== deleteMember.id));
    setDeleteMember(null);
  }

  const activeMemberCount = members.filter((m) => m.status === "active").length;
  const licensePercent = Math.round((activeMemberCount / LICENSE_LIMIT) * 100);

  return (
    <>
      <PageHeader
        title="피처링 계정 연계"
        description="피처링 SNS 계정 연동 상태 및 워크스페이스 멤버를 관리합니다"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="연동 계정"
            value={`${connectedCount}개`}
            icon={LinkIcon}
            description={`총 ${accounts.length}개 중`}
          />
          <StatsCard
            title="오류 계정"
            value={`${errorCount}개`}
            icon={AlertCircle}
            description="재연동 필요"
          />
          <StatsCard
            title="워크스페이스 멤버"
            value={`${activeMemberCount}명`}
            icon={Users}
            description={`라이선스 ${LICENSE_LIMIT}명 중`}
          />
          <StatsCard
            title="라이선스 사용률"
            value={`${licensePercent}%`}
            icon={Shield}
            description={`${activeMemberCount} / ${LICENSE_LIMIT}명`}
          />
        </div>

        <Tabs defaultValue="accounts">
          <TabsList>
            <TabsTrigger value="accounts">연동 계정 관리</TabsTrigger>
            <TabsTrigger value="members">멤버 관리</TabsTrigger>
            <TabsTrigger value="license">라이선스</TabsTrigger>
          </TabsList>

          {/* ── 연동 계정 탭 ── */}
          <TabsContent value="accounts" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">피처링 SNS 계정</CardTitle>
                    <CardDescription className="mt-1">
                      DM 발송 및 콘텐츠 트래킹에 사용되는 피처링 연동 계정 목록입니다
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {accounts.length} / {ACCOUNT_LIMIT}개
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>플랫폼</TableHead>
                      <TableHead>계정</TableHead>
                      <TableHead>팔로워</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>마지막 동기화</TableHead>
                      <TableHead>연동일</TableHead>
                      <TableHead className="text-right">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${PLATFORM_COLORS[account.platform]}`}
                          >
                            {account.platform === "instagram" ? "인스타그램" : "유튜브"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-sm">{account.handle}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {account.followerCount > 0 ? formatNumber(account.followerCount) : "-"}
                        </TableCell>
                        <TableCell>
                          {account.status === "connected" && (
                            <span className="flex items-center gap-1 text-emerald-600 text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5" /> 연결됨
                            </span>
                          )}
                          {account.status === "error" && (
                            <span className="flex items-center gap-1 text-red-600 text-xs">
                              <XCircle className="h-3.5 w-3.5" /> 오류
                            </span>
                          )}
                          {account.status === "pending" && (
                            <span className="flex items-center gap-1 text-amber-600 text-xs">
                              <RefreshCw className="h-3.5 w-3.5" /> 대기 중
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {account.lastSync}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {account.connectedAt}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={syncing === account.id || account.status === "pending"}
                            onClick={() => handleSync(account.id)}
                          >
                            <RefreshCw
                              className={`h-3.5 w-3.5 mr-1 ${syncing === account.id ? "animate-spin" : ""}`}
                            />
                            {syncing === account.id ? "동기화 중" : "동기화"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {errorCount > 0 && (
                  <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      {errorCount}개 계정에 연동 오류가 발생했습니다. 동기화 버튼을 눌러 재연동해 주세요.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── 멤버 관리 탭 ── */}
          <TabsContent value="members" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">워크스페이스 멤버</CardTitle>
                    <CardDescription className="mt-1">
                      온트러스트 접근 권한이 있는 멤버를 관리합니다 (최대 {LICENSE_LIMIT}명)
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setInviteOpen(true)}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    멤버 초대
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="이름 또는 이메일로 검색..."
                    className="pl-9"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>가입일</TableHead>
                      <TableHead>마지막 활동</TableHead>
                      <TableHead className="text-right">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {member.role === "owner" && (
                              <Crown className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                            )}
                            <span className="font-medium text-sm">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {member.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${ROLE_COLORS[member.role]}`}
                          >
                            {ROLE_LABELS[member.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.status === "active" ? (
                            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                              활성
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                              초대 대기
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {member.joinedAt}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {member.lastActive}
                        </TableCell>
                        <TableCell className="text-right">
                          {member.role !== "owner" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeleteMember(member)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <p className="text-xs text-muted-foreground text-right">
                  총 {filteredMembers.length}명 표시 중 (전체 {members.length}명)
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── 라이선스 탭 ── */}
          <TabsContent value="license" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">라이선스 사용 현황</CardTitle>
                <CardDescription>현재 구독 플랜과 사용량을 확인합니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Info */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">온트러스트 엔터프라이즈</p>
                      <p className="text-xs text-muted-foreground">CJ ENM 전사 플랜 · 갱신일: 2026-01-01</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">활성</Badge>
                </div>

                <Separator />

                {/* License Usage */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">워크스페이스 멤버 라이선스</span>
                    <span className="text-muted-foreground">
                      {activeMemberCount} / {LICENSE_LIMIT}명
                    </span>
                  </div>
                  <Progress value={licensePercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {LICENSE_LIMIT - activeMemberCount}명 추가 초대 가능
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">피처링 연동 계정</span>
                    <span className="text-muted-foreground">
                      {accounts.length} / {ACCOUNT_LIMIT}개
                    </span>
                  </div>
                  <Progress value={Math.round((accounts.length / ACCOUNT_LIMIT) * 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {ACCOUNT_LIMIT - accounts.length}개 추가 연동 가능
                  </p>
                </div>

                <Separator />

                {/* Feature List */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">플랜 포함 기능</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "크리에이터 탐색 (전체)",
                      "팔로워 유사도 분석",
                      "캠페인 제안 관리",
                      "DM 자동화 발송",
                      "인사이트 리포트",
                      "북마크 그룹 관리",
                      "파트너 포털 접근",
                      "API 데이터 연동",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── 멤버 초대 모달 ── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>멤버 초대</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="invite-email">이메일 주소</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="example@cjenm.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>역할</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as "admin" | "member")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">관리자 — 멤버 관리 권한 포함</SelectItem>
                  <SelectItem value="member">멤버 — 기본 조회/실행 권한</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              초대 이메일이 발송됩니다. 수신자가 수락하면 워크스페이스에 합류됩니다.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              취소
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
              초대 발송
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 멤버 삭제 확인 모달 ── */}
      <Dialog open={!!deleteMember} onOpenChange={(open) => !open && setDeleteMember(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>멤버 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            <strong>{deleteMember?.email}</strong> 멤버를 워크스페이스에서 제거하시겠습니까?
            해당 멤버는 더 이상 온트러스트에 접근할 수 없습니다.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteMember(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
