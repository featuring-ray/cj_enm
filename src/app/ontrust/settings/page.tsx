"use client";

import { useState } from "react";
import {
  Save,
  Plug,
  Users,
  UserPlus,
  Trash2,
  Shield,
  CheckCircle2,
  XCircle,
  CreditCard,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Integration statuses
interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  lastSync?: string;
  icon: string;
}

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "ig-1",
    name: "Instagram Graph API",
    description: "인스타그램 계정 연동 및 콘텐츠 데이터 수집",
    connected: true,
    lastSync: "2026-03-11 08:00",
    icon: "IG",
  },
  {
    id: "yt-1",
    name: "YouTube Data API",
    description: "유튜브 채널 데이터 및 분석 정보 연동",
    connected: true,
    lastSync: "2026-03-11 06:30",
    icon: "YT",
  },
  {
    id: "cj-1",
    name: "CJ ENM 내부 시스템",
    description: "CJ 매출/구매 데이터 연동",
    connected: true,
    lastSync: "2026-03-10 23:00",
    icon: "CJ",
  },
  {
    id: "ga-1",
    name: "Google Analytics 4",
    description: "웹사이트 유입 및 전환 데이터 연동",
    connected: false,
    icon: "GA",
  },
  {
    id: "slack-1",
    name: "Slack 알림",
    description: "Slack 채널로 알림 연동",
    connected: false,
    icon: "SL",
  },
  {
    id: "tt-1",
    name: "TikTok Business API",
    description: "틱톡 크리에이터 데이터 수집",
    connected: true,
    lastSync: "2026-03-11 07:15",
    icon: "TT",
  },
];

// Workspace members
interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: "관리자" | "매니저" | "뷰어";
  department: string;
  joinedAt: string;
  lastActive: string;
}

const generateMockMembers = (): WorkspaceMember[] => {
  const roles: WorkspaceMember["role"][] = ["관리자", "매니저", "뷰어"];
  const departments = ["마케팅", "MD", "데이터", "운영", "기획", "콘텐츠", "CS"];
  const names = [
    "김민지", "박서준", "이하나", "정우진", "최소연", "한지훈",
    "강민호", "윤서영", "오태현", "장미래", "임재현", "백소희",
    "신동우", "류미나", "고은비", "황준호", "문채원", "서영민",
    "안지우", "송다은",
  ];

  return names.map((name, idx) => ({
    id: `member-${idx + 1}`,
    name,
    email: `${name.replace(/\s/g, "").toLowerCase()}@cjenm.com`,
    role: idx === 0 ? "관리자" : roles[Math.floor(Math.random() * 3)],
    department: departments[idx % departments.length],
    joinedAt: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    lastActive: idx < 10 ? "2026-03-11" : `2026-03-${String(Math.floor(Math.random() * 10) + 1).padStart(2, "0")}`,
  }));
};

// License info
interface LicenseInfo {
  plan: string;
  maxMembers: number;
  currentMembers: number;
  maxCreators: number;
  currentCreators: number;
  maxCampaigns: number;
  currentCampaigns: number;
  expiresAt: string;
}

const MOCK_LICENSE: LicenseInfo = {
  plan: "Enterprise",
  maxMembers: 500,
  currentMembers: 20,
  maxCreators: 10000,
  currentCreators: 3842,
  maxCampaigns: 1000,
  currentCampaigns: 47,
  expiresAt: "2027-03-31",
};

export default function SettingsPage() {
  const [integrations] = useState(MOCK_INTEGRATIONS);
  const [members, setMembers] = useState(generateMockMembers);
  const [memberSearch, setMemberSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceMember["role"]>("뷰어");
  const [inviteDept, setInviteDept] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState("");

  const filteredMembers = members.filter(
    (m) =>
      !memberSearch ||
      m.name.includes(memberSearch) ||
      m.email.includes(memberSearch) ||
      m.department.includes(memberSearch)
  );

  const handleInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const newMember: WorkspaceMember = {
      id: `member-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      department: inviteDept || "미지정",
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: new Date().toISOString().slice(0, 10),
    };
    setMembers((prev) => [newMember, ...prev]);
    setInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("뷰어");
    setInviteDept("");
  };

  const handleDelete = () => {
    setMembers((prev) => prev.filter((m) => m.id !== deleteMemberId));
    setDeleteConfirmOpen(false);
    setDeleteMemberId("");
  };

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <>
      <PageHeader
        title="시스템 설정"
        description="워크스페이스 통합, 멤버 관리 및 라이선스 현황"
      />

      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="integrations">
          <TabsList>
            <TabsTrigger value="integrations" className="gap-1.5">
              <Plug className="h-3.5 w-3.5" />
              연동 상태
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              멤버 관리
            </TabsTrigger>
            <TabsTrigger value="license" className="gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              라이선스
            </TabsTrigger>
          </TabsList>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {connectedCount}/{integrations.length} 연동됨
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                        {integration.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold truncate">
                            {integration.name}
                          </span>
                          {integration.connected ? (
                            <Badge className="bg-green-100 text-green-800 border-0 text-xs gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              연동됨
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 border-0 text-xs gap-1">
                              <XCircle className="h-3 w-3" />
                              미연동
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {integration.description}
                        </p>
                        {integration.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            마지막 동기화: {integration.lastSync}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 w-64"
                    placeholder="이름, 이메일, 부서 검색..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>
                <Badge variant="outline">
                  {members.length}명 / {MOCK_LICENSE.maxMembers}명
                </Badge>
              </div>
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus className="h-4 w-4 mr-1.5" />
                멤버 초대
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>부서</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead>가입일</TableHead>
                      <TableHead>마지막 활동</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px]">
                                {member.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {member.email}
                        </TableCell>
                        <TableCell className="text-sm">{member.department}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.role === "관리자"
                                ? "default"
                                : member.role === "매니저"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {member.joinedAt}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {member.lastActive}
                        </TableCell>
                        <TableCell>
                          {member.role !== "관리자" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive"
                              onClick={() => {
                                setDeleteMemberId(member.id);
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* License Tab */}
          <TabsContent value="license" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      라이선스 현황
                    </CardTitle>
                    <CardDescription>현재 활성화된 플랜 정보</CardDescription>
                  </div>
                  <Badge className="text-sm px-3 py-1">{MOCK_LICENSE.plan}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Members */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">워크스페이스 멤버</span>
                      <span className="font-medium">
                        {MOCK_LICENSE.currentMembers} / {MOCK_LICENSE.maxMembers}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${(MOCK_LICENSE.currentMembers / MOCK_LICENSE.maxMembers) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {MOCK_LICENSE.maxMembers - MOCK_LICENSE.currentMembers}명 추가 가능
                    </p>
                  </div>

                  {/* Creators */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">크리에이터 DB</span>
                      <span className="font-medium">
                        {MOCK_LICENSE.currentCreators.toLocaleString()} /{" "}
                        {MOCK_LICENSE.maxCreators.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{
                          width: `${(MOCK_LICENSE.currentCreators / MOCK_LICENSE.maxCreators) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(MOCK_LICENSE.maxCreators - MOCK_LICENSE.currentCreators).toLocaleString()}명 추가 가능
                    </p>
                  </div>

                  {/* Campaigns */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">캠페인 관리</span>
                      <span className="font-medium">
                        {MOCK_LICENSE.currentCampaigns} / {MOCK_LICENSE.maxCampaigns}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{
                          width: `${(MOCK_LICENSE.currentCampaigns / MOCK_LICENSE.maxCampaigns) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {MOCK_LICENSE.maxCampaigns - MOCK_LICENSE.currentCampaigns}건 추가 가능
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">라이선스 만료일</p>
                    <p className="text-xs text-muted-foreground">
                      {MOCK_LICENSE.expiresAt}까지 유효
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.ceil(
                      (new Date(MOCK_LICENSE.expiresAt).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}
                    일 남음
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>멤버 초대</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>이름</Label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="홍길동"
              />
            </div>
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@cjenm.com"
              />
            </div>
            <div className="space-y-2">
              <Label>부서</Label>
              <Input
                value={inviteDept}
                onChange={(e) => setInviteDept(e.target.value)}
                placeholder="마케팅"
              />
            </div>
            <div className="space-y-2">
              <Label>역할</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as WorkspaceMember["role"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="관리자">관리자</SelectItem>
                  <SelectItem value="매니저">매니저</SelectItem>
                  <SelectItem value="뷰어">뷰어</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>취소</Button>
            <Button onClick={handleInvite} disabled={!inviteName.trim() || !inviteEmail.trim()}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              초대
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>멤버 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            이 멤버를 워크스페이스에서 삭제하시겠습니까? 삭제된 멤버는 더 이상 시스템에 접근할 수 없습니다.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
