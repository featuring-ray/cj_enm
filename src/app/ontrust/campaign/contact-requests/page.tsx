"use client";

import { useState, useMemo } from "react";
import {
  Send,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import creatorsData from "@/data/mock/creators.json";
import campaignsData from "@/data/mock/campaigns.json";

// ─── Mock 데이터 ──────────────────────────────────────────

interface ContactRequest {
  id: string;
  mdId: string;
  mdName: string;
  creatorId: string;
  campaignId?: string;
  requestType: "캠페인참여" | "가입제안" | "가입+캠페인";
  status: "대기" | "처리중" | "완료" | "반려";
  assignedTo?: string;
  note?: string;
  channel: "DM" | "이메일" | "전화";
  createdAt: string;
  processedAt?: string;
}

const mockContactRequests: ContactRequest[] = [
  {
    id: "cr-001",
    mdId: "md-1",
    mdName: "김지영 MD",
    creatorId: "creator-1",
    campaignId: "campaign-1",
    requestType: "캠페인참여",
    status: "대기",
    channel: "DM",
    note: "뷰티 카테고리 TOP 크리에이터, 이전 캠페인 성과 우수",
    createdAt: "2026-03-20T10:30:00",
  },
  {
    id: "cr-002",
    mdId: "md-2",
    mdName: "박수진 MD",
    creatorId: "creator-5",
    requestType: "가입제안",
    status: "대기",
    channel: "이메일",
    note: "팔로워 40만 이상, 뷰티/패션 카테고리 활성 크리에이터",
    createdAt: "2026-03-20T09:15:00",
  },
  {
    id: "cr-003",
    mdId: "md-1",
    mdName: "김지영 MD",
    creatorId: "creator-2",
    campaignId: "campaign-3",
    requestType: "캠페인참여",
    status: "처리중",
    assignedTo: "이민호 담당자",
    channel: "DM",
    note: "푸드 카테고리 캠페인 신규 참여 요청",
    createdAt: "2026-03-19T14:20:00",
  },
  {
    id: "cr-004",
    mdId: "md-3",
    mdName: "이하은 MD",
    creatorId: "creator-3",
    campaignId: "campaign-2",
    requestType: "가입+캠페인",
    status: "완료",
    assignedTo: "최유나 담당자",
    channel: "전화",
    note: "패션 카테고리 핵심 인플루언서. 가입 완료 후 캠페인 연결 진행",
    createdAt: "2026-03-18T11:00:00",
    processedAt: "2026-03-19T16:45:00",
  },
  {
    id: "cr-005",
    mdId: "md-2",
    mdName: "박수진 MD",
    creatorId: "creator-4",
    campaignId: "campaign-4",
    requestType: "캠페인참여",
    status: "완료",
    assignedTo: "이민호 담당자",
    channel: "DM",
    createdAt: "2026-03-17T09:30:00",
    processedAt: "2026-03-18T10:20:00",
  },
  {
    id: "cr-006",
    mdId: "md-1",
    mdName: "김지영 MD",
    creatorId: "creator-6",
    requestType: "가입제안",
    status: "반려",
    assignedTo: "최유나 담당자",
    channel: "이메일",
    note: "해당 크리에이터 이미 타 플랫폼 전속 계약 확인",
    createdAt: "2026-03-16T15:10:00",
    processedAt: "2026-03-17T11:30:00",
  },
  {
    id: "cr-007",
    mdId: "md-3",
    mdName: "이하은 MD",
    creatorId: "creator-7",
    campaignId: "campaign-5",
    requestType: "캠페인참여",
    status: "처리중",
    assignedTo: "이민호 담당자",
    channel: "DM",
    note: "디지털 카테고리 캠페인. 인게이지먼트율 상위 크리에이터",
    createdAt: "2026-03-19T16:45:00",
  },
  {
    id: "cr-008",
    mdId: "md-2",
    mdName: "박수진 MD",
    creatorId: "creator-8",
    campaignId: "campaign-1",
    requestType: "가입+캠페인",
    status: "대기",
    channel: "전화",
    note: "리빙 카테고리 크리에이터, 최근 공구 콘텐츠 인게이지먼트 급상승",
    createdAt: "2026-03-21T08:00:00",
  },
  {
    id: "cr-009",
    mdId: "md-1",
    mdName: "김지영 MD",
    creatorId: "creator-9",
    requestType: "가입제안",
    status: "대기",
    channel: "DM",
    note: "유튜브 구독자 30만, 뷰티 리뷰 전문",
    createdAt: "2026-03-21T10:00:00",
  },
  {
    id: "cr-010",
    mdId: "md-3",
    mdName: "이하은 MD",
    creatorId: "creator-10",
    campaignId: "campaign-6",
    requestType: "캠페인참여",
    status: "처리중",
    assignedTo: "최유나 담당자",
    channel: "이메일",
    note: "건강식품 캠페인. 타깃 오디언스 매칭률 높음",
    createdAt: "2026-03-20T13:00:00",
  },
];

// ─── 유틸리티 ──────────────────────────────────────────

function getCreator(id: string) {
  return (creatorsData as Record<string, unknown>[]).find(
    (c) => (c as { id: string }).id === id
  ) as { id: string; handle: string; name: string; profileImage: string; followers: number; category: string[]; isOntnerMember: boolean; contactEmail?: string } | undefined;
}

function getCampaign(id: string) {
  return (campaignsData as Record<string, unknown>[]).find(
    (c) => (c as { id: string }).id === id
  ) as { id: string; name: string; brand: string } | undefined;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return String(n);
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  대기: { label: "대기", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  처리중: { label: "처리중", color: "bg-blue-100 text-blue-800", icon: Send },
  완료: { label: "완료", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  반려: { label: "반려", color: "bg-red-100 text-red-800", icon: XCircle },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  캠페인참여: { label: "캠페인참여", color: "bg-purple-100 text-purple-800" },
  가입제안: { label: "가입제안", color: "bg-cyan-100 text-cyan-800" },
  "가입+캠페인": { label: "가입+캠페인", color: "bg-indigo-100 text-indigo-800" },
};

const channelIcon: Record<string, React.ElementType> = {
  DM: MessageSquare,
  이메일: Mail,
  전화: Phone,
};

// ─── 컴포넌트 ──────────────────────────────────────────

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>(mockContactRequests);
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [typeFilter, setTypeFilter] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusDialog, setBulkStatusDialog] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<string>("");
  const [newRequestDialog, setNewRequestDialog] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // 필터링된 목록
  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "전체" && r.status !== statusFilter) return false;
      if (typeFilter !== "전체" && r.requestType !== typeFilter) return false;
      if (searchQuery) {
        const creator = getCreator(r.creatorId);
        const campaign = r.campaignId ? getCampaign(r.campaignId) : null;
        const q = searchQuery.toLowerCase();
        const matchCreator = creator?.name.toLowerCase().includes(q) || creator?.handle.toLowerCase().includes(q);
        const matchCampaign = campaign?.name.toLowerCase().includes(q);
        const matchMd = r.mdName.toLowerCase().includes(q);
        if (!matchCreator && !matchCampaign && !matchMd) return false;
      }
      return true;
    });
  }, [requests, statusFilter, typeFilter, searchQuery]);

  // 통계
  const stats = useMemo(() => ({
    total: requests.length,
    waiting: requests.filter((r) => r.status === "대기").length,
    processing: requests.filter((r) => r.status === "처리중").length,
    completed: requests.filter((r) => r.status === "완료").length,
    rejected: requests.filter((r) => r.status === "반려").length,
  }), [requests]);

  // 상태 변경
  function handleStatusChange(id: string, newStatus: string) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus as ContactRequest["status"],
              processedAt: ["완료", "반려"].includes(newStatus) ? new Date().toISOString() : r.processedAt,
              assignedTo: r.assignedTo || "현재 담당자",
            }
          : r
      )
    );
  }

  // 일괄 상태 변경
  function handleBulkStatusChange() {
    if (!bulkTargetStatus || selectedIds.length === 0) return;
    setRequests((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id)
          ? {
              ...r,
              status: bulkTargetStatus as ContactRequest["status"],
              processedAt: ["완료", "반려"].includes(bulkTargetStatus) ? new Date().toISOString() : r.processedAt,
              assignedTo: r.assignedTo || "현재 담당자",
            }
          : r
      )
    );
    setSelectedIds([]);
    setBulkStatusDialog(false);
    setBulkTargetStatus("");
  }

  // 이메일 복사
  function copyEmail(email: string) {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  }

  // 체크박스 토글
  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  }

  return (
    <>
      <PageHeader
        title="컨택 요청 관리"
        description="T-A-15 · MD가 발송한 크리에이터 컨택 요청 건을 확인하고 처리 상태를 관리합니다."
        actions={
          <Button size="sm" onClick={() => setNewRequestDialog(true)}>
            <UserPlus className="mr-1.5 h-4 w-4" />
            신규 요청 등록
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* ─── 통계 카드 ─── */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "전체 요청", value: stats.total, color: "text-gray-900" },
            { label: "대기", value: stats.waiting, color: "text-yellow-600" },
            { label: "처리중", value: stats.processing, color: "text-blue-600" },
            { label: "완료", value: stats.completed, color: "text-green-600" },
            { label: "반려", value: stats.rejected, color: "text-red-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── 필터 및 액션 바 ─── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">필터:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 상태</SelectItem>
              <SelectItem value="대기">대기</SelectItem>
              <SelectItem value="처리중">처리중</SelectItem>
              <SelectItem value="완료">완료</SelectItem>
              <SelectItem value="반려">반려</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="요청 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 유형</SelectItem>
              <SelectItem value="캠페인참여">캠페인참여</SelectItem>
              <SelectItem value="가입제안">가입제안</SelectItem>
              <SelectItem value="가입+캠페인">가입+캠페인</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="크리에이터 / 캠페인 / MD 검색..."
            className="w-[240px] h-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="ml-auto flex items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <span className="text-xs text-muted-foreground">
                  {selectedIds.length}건 선택
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setBulkStatusDialog(true)}
                >
                  일괄 상태 변경
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ─── 테이블 ─── */}
        <Card>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[140px]">요청일</TableHead>
                  <TableHead className="w-[100px]">요청자</TableHead>
                  <TableHead className="min-w-[200px]">크리에이터</TableHead>
                  <TableHead className="w-[160px]">캠페인</TableHead>
                  <TableHead className="w-[100px]">요청 유형</TableHead>
                  <TableHead className="w-[70px]">채널</TableHead>
                  <TableHead className="w-[80px]">상태</TableHead>
                  <TableHead className="w-[110px]">처리자</TableHead>
                  <TableHead className="w-[140px]">처리일</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                      조건에 맞는 컨택 요청이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((req) => {
                    const creator = getCreator(req.creatorId);
                    const campaign = req.campaignId ? getCampaign(req.campaignId) : null;
                    const stConf = statusConfig[req.status];
                    const tConf = typeConfig[req.requestType];
                    const ChIcon = channelIcon[req.channel];
                    return (
                      <TableRow key={req.id} className="group">
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(req.id)}
                            onCheckedChange={() => toggleSelect(req.id)}
                          />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(req.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs font-medium">{req.mdName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700">
                                {creator?.name.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium truncate">
                                  {creator?.name || req.creatorId}
                                </span>
                                {creator?.isOntnerMember && (
                                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-green-50 text-green-700">
                                    회원
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <span>@{creator?.handle}</span>
                                <span>·</span>
                                <span>{creator ? formatNumber(creator.followers) : "-"}</span>
                                {creator?.contactEmail && (
                                  <>
                                    <span>·</span>
                                    <button
                                      className="flex items-center gap-0.5 text-blue-600 hover:underline"
                                      onClick={() => copyEmail(creator.contactEmail!)}
                                    >
                                      <Mail className="h-2.5 w-2.5" />
                                      {copiedEmail === creator.contactEmail ? "복사됨!" : "이메일"}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {campaign ? (
                            <div className="text-xs">
                              <span className="font-medium truncate block max-w-[140px]">{campaign.name}</span>
                              <span className="text-[10px] text-muted-foreground">{campaign.brand}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-[10px] ${tConf.color}`}>
                            {tConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {ChIcon && <ChIcon className="h-3 w-3" />}
                            {req.channel}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={req.status}
                            onValueChange={(v) => handleStatusChange(req.id, v)}
                          >
                            <SelectTrigger className="h-6 w-[80px] text-[10px] px-2 border-0 bg-transparent">
                              <Badge variant="secondary" className={`text-[10px] ${stConf.color}`}>
                                {stConf.label}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="대기">대기</SelectItem>
                              <SelectItem value="처리중">처리중</SelectItem>
                              <SelectItem value="완료">완료</SelectItem>
                              <SelectItem value="반려">반려</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {req.assignedTo || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {req.processedAt ? formatDate(req.processedAt) : "-"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                크리에이터 상세
                              </DropdownMenuItem>
                              {campaign && (
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                  캠페인 상세
                                </DropdownMenuItem>
                              )}
                              {req.note && (
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-3.5 w-3.5" />
                                  메모 보기
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {/* 페이지 정보 */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              총 {filtered.length}건 {selectedIds.length > 0 && `(${selectedIds.length}건 선택)`}
            </p>
            <p className="text-xs text-muted-foreground">1 / 1 페이지</p>
          </div>
        </Card>

        {/* ─── 메모 영역: 선택된 항목이 1개일 때 ─── */}
        {selectedIds.length === 1 && (() => {
          const req = requests.find((r) => r.id === selectedIds[0]);
          if (!req?.note) return null;
          const creator = getCreator(req.creatorId);
          return (
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">요청 메모</span>
                  <Badge variant="secondary" className="text-[10px]">{creator?.name}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{req.note}</p>
              </CardContent>
            </Card>
          );
        })()}
      </div>

      {/* ─── 일괄 상태 변경 다이얼로그 ─── */}
      <Dialog open={bulkStatusDialog} onOpenChange={setBulkStatusDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>일괄 상태 변경</DialogTitle>
            <DialogDescription>
              선택한 {selectedIds.length}건의 컨택 요청 상태를 일괄 변경합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-sm">변경할 상태</Label>
            <Select value={bulkTargetStatus} onValueChange={setBulkTargetStatus}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="대기">대기</SelectItem>
                <SelectItem value="처리중">처리중</SelectItem>
                <SelectItem value="완료">완료</SelectItem>
                <SelectItem value="반려">반려</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkStatusDialog(false)}>
              취소
            </Button>
            <Button onClick={handleBulkStatusChange} disabled={!bulkTargetStatus}>
              변경 적용
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── 신규 요청 등록 다이얼로그 ─── */}
      <NewRequestDialog
        open={newRequestDialog}
        onOpenChange={setNewRequestDialog}
        onSubmit={(req) => {
          setRequests((prev) => [req, ...prev]);
          setNewRequestDialog(false);
        }}
      />
    </>
  );
}

// ─── 신규 요청 등록 다이얼로그 ────────────────────────────

function NewRequestDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (req: ContactRequest) => void;
}) {
  const [creatorSearch, setCreatorSearch] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [requestType, setRequestType] = useState<string>("캠페인참여");
  const [channel, setChannel] = useState<string>("DM");
  const [note, setNote] = useState("");

  const matchingCreators = useMemo(() => {
    if (!creatorSearch) return [];
    const q = creatorSearch.toLowerCase();
    return (creatorsData as { id: string; name: string; handle: string }[])
      .filter((c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q))
      .slice(0, 5);
  }, [creatorSearch]);

  function handleSubmit() {
    if (!selectedCreator) return;
    onSubmit({
      id: `cr-${Date.now()}`,
      mdId: "md-1",
      mdName: "김지영 MD",
      creatorId: selectedCreator,
      campaignId: selectedCampaign || undefined,
      requestType: requestType as ContactRequest["requestType"],
      status: "대기",
      channel: channel as ContactRequest["channel"],
      note: note || undefined,
      createdAt: new Date().toISOString(),
    });
    // reset
    setCreatorSearch("");
    setSelectedCreator("");
    setSelectedCampaign("");
    setRequestType("캠페인참여");
    setChannel("DM");
    setNote("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>신규 컨택 요청 등록</DialogTitle>
          <DialogDescription>
            크리에이터에 대한 컨택 요청을 내부 운영팀에 발송합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* 크리에이터 선택 */}
          <div className="space-y-2">
            <Label className="text-sm">크리에이터 *</Label>
            {selectedCreator ? (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {getCreator(selectedCreator)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{getCreator(selectedCreator)?.name}</span>
                <span className="text-xs text-muted-foreground">@{getCreator(selectedCreator)?.handle}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-6 text-xs"
                  onClick={() => setSelectedCreator("")}
                >
                  변경
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                <Input
                  placeholder="크리에이터 이름 또는 핸들 검색..."
                  value={creatorSearch}
                  onChange={(e) => setCreatorSearch(e.target.value)}
                  className="h-8 text-sm"
                />
                {matchingCreators.length > 0 && (
                  <div className="border rounded-md max-h-[160px] overflow-auto">
                    {matchingCreators.map((c) => (
                      <button
                        key={c.id}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                        onClick={() => {
                          setSelectedCreator(c.id);
                          setCreatorSearch("");
                        }}
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[9px]">{c.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {c.name}
                        <span className="text-xs text-muted-foreground">@{c.handle}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 캠페인 선택 */}
          <div className="space-y-2">
            <Label className="text-sm">관련 캠페인 (선택)</Label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="캠페인 선택 (선택사항)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                {(campaignsData as { id: string; name: string; brand: string }[]).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.brand})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 요청 유형, 채널 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">요청 유형</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="캠페인참여">캠페인참여</SelectItem>
                  <SelectItem value="가입제안">가입제안</SelectItem>
                  <SelectItem value="가입+캠페인">가입+캠페인</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">컨택 채널</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DM">DM</SelectItem>
                  <SelectItem value="이메일">이메일</SelectItem>
                  <SelectItem value="전화">전화</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label className="text-sm">요청 메모</Label>
            <Textarea
              placeholder="요청 사유, 특이사항 등을 입력해주세요..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedCreator}>
            <Send className="mr-1.5 h-4 w-4" />
            요청 발송
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
