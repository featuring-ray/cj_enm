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
  AlertCircle,
  Search,
  FileText,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import creatorsData from "@/data/mock/creators.json";

// ─── 타입 ──────────────────────────────────────────

type ContactStatus = "접수" | "검토 중" | "컨택 진행" | "미진행" | "완료";

interface ContactRequest {
  id: string;
  mdId: string;
  mdName: string;
  creatorId: string;
  status: ContactStatus;
  reason: string;             // 요청 사유
  assignedTo?: string;        // 처리자
  note?: string;              // 비고
  createdAt: string;          // 요청일
  processedAt?: string;       // 처리일
}

// ─── Mock 데이터 ──────────────────────────────────────────

const mockContactRequests: ContactRequest[] = [
  {
    id: "CR-2026-001",
    mdId: "md-1",
    mdName: "김지영 MD",
    creatorId: "creator-1",
    status: "접수",
    reason: "뷰티 카테고리 TOP 크리에이터, 이전 캠페인 성과 우수하여 신규 캠페인 컨택 요청",
    createdAt: "2026-03-20T10:30:00",
  },
  {
    id: "CR-2026-002",
    mdId: "md-2",
    mdName: "박수진 MD",
    creatorId: "creator-5",
    status: "접수",
    reason: "팔로워 40만 이상, 뷰티/패션 카테고리 활성 크리에이터. 온트너 가입 유도 필요",
    createdAt: "2026-03-20T09:15:00",
  },
  {
    id: "CR-2026-003",
    mdId: "md-1",
    mdName: "김지영 MD",
    creatorId: "creator-2",
    status: "검토 중",
    assignedTo: "이민호 담당자",
    reason: "푸드 카테고리 캠페인 신규 참여 요청. 인게이지먼트율 상위 5%",
    createdAt: "2026-03-19T14:20:00",
  },
  {
    id: "CR-2026-004",
    mdId: "md-3",
    mdName: "이하은 MD",
    creatorId: "creator-3",
    status: "완료",
    assignedTo: "최유나 담당자",
    reason: "패션 카테고리 핵심 인플루언서. 가입 완료 후 캠페인 연결 진행",
    createdAt: "2026-03-18T11:00:00",
    processedAt: "2026-03-19T16:45:00",
    note: "컨택 완료. 온트너 가입 및 캠페인 참여 확정",
  },
  {
    id: "CR-2026-005",
    mdId: "md-2",
    mdName: "박수진 MD",
    creatorId: "creator-4",
    status: "컨택 진행",
    assignedTo: "이민호 담당자",
    reason: "리빙 카테고리 공구 콘텐츠 인게이지먼트 급상승. 캠페인 참여 제안 요청",
    createdAt: "2026-03-17T09:30:00",
    note: "담당자 전화 연락 예정 (3/22)",
  },
  {
    id: "CR-2026-006",
    mdId: "md-1",
    mdName: "김지영 MD",
    creatorId: "creator-6",
    status: "미진행",
    assignedTo: "최유나 담당자",
    reason: "뷰티 신규 크리에이터 발굴. 팔로워 대비 인게이지먼트 높음",
    createdAt: "2026-03-16T15:10:00",
    processedAt: "2026-03-17T11:30:00",
    note: "해당 크리에이터 이미 타 플랫폼 전속 계약 확인. 미진행 처리",
  },
  {
    id: "CR-2026-007",
    mdId: "md-3",
    mdName: "이하은 MD",
    creatorId: "creator-7",
    status: "컨택 진행",
    assignedTo: "이민호 담당자",
    reason: "디지털 카테고리 캠페인. 인게이지먼트율 상위 크리에이터",
    createdAt: "2026-03-19T16:45:00",
    note: "이메일 발송 완료, 회신 대기 중",
  },
  {
    id: "CR-2026-008",
    mdId: "md-2",
    mdName: "박수진 MD",
    creatorId: "creator-8",
    status: "접수",
    reason: "리빙 카테고리 크리에이터, 최근 공구 콘텐츠 인게이지먼트 급상승",
    createdAt: "2026-03-21T08:00:00",
  },
  {
    id: "CR-2026-009",
    mdId: "md-1",
    mdName: "김지영 MD",
    creatorId: "creator-9",
    status: "검토 중",
    assignedTo: "최유나 담당자",
    reason: "유튜브 구독자 30만, 뷰티 리뷰 전문. 크리에이터 풀 확대 목적",
    createdAt: "2026-03-21T10:00:00",
  },
  {
    id: "CR-2026-010",
    mdId: "md-3",
    mdName: "이하은 MD",
    creatorId: "creator-10",
    status: "완료",
    assignedTo: "최유나 담당자",
    reason: "건강식품 캠페인. 타깃 오디언스 매칭률 높음",
    createdAt: "2026-03-20T13:00:00",
    processedAt: "2026-03-22T09:00:00",
    note: "컨택 성공. 캠페인 참여 의향 확인 완료",
  },
];

// ─── 유틸리티 ──────────────────────────────────────────

function getCreator(id: string) {
  return (creatorsData as Record<string, unknown>[]).find(
    (c) => (c as { id: string }).id === id
  ) as { id: string; handle: string; name: string; profileImage: string; followers: number; category: string[]; isOntnerMember: boolean; contactEmail?: string } | undefined;
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

const statusConfig: Record<ContactStatus, { label: string; color: string; icon: React.ElementType }> = {
  접수: { label: "접수", color: "bg-gray-100 text-gray-800", icon: FileText },
  "검토 중": { label: "검토 중", color: "bg-yellow-100 text-yellow-800", icon: Search },
  "컨택 진행": { label: "컨택 진행", color: "bg-blue-100 text-blue-800", icon: ArrowRight },
  미진행: { label: "미진행", color: "bg-red-100 text-red-800", icon: XCircle },
  완료: { label: "완료", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
};

// 상태 전이 규칙: 접수 → 검토 중 → 컨택 진행 / 미진행, 컨택 진행 → 완료
const allowedTransitions: Record<ContactStatus, ContactStatus[]> = {
  접수: ["검토 중"],
  "검토 중": ["컨택 진행", "미진행"],
  "컨택 진행": ["완료"],
  미진행: [],
  완료: [],
};

// ─── 컴포넌트 ──────────────────────────────────────────

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>(mockContactRequests);
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusDialog, setBulkStatusDialog] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<string>("");
  const [newRequestDialog, setNewRequestDialog] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [detailDialog, setDetailDialog] = useState<ContactRequest | null>(null);

  // 필터링된 목록
  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "전체" && r.status !== statusFilter) return false;
      if (searchQuery) {
        const creator = getCreator(r.creatorId);
        const q = searchQuery.toLowerCase();
        const matchCreator = creator?.name.toLowerCase().includes(q) || creator?.handle.toLowerCase().includes(q);
        const matchMd = r.mdName.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q);
        if (!matchCreator && !matchMd && !matchId) return false;
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  // 통계
  const stats = useMemo(() => ({
    total: requests.length,
    접수: requests.filter((r) => r.status === "접수").length,
    "검토 중": requests.filter((r) => r.status === "검토 중").length,
    "컨택 진행": requests.filter((r) => r.status === "컨택 진행").length,
    완료: requests.filter((r) => r.status === "완료").length,
    미진행: requests.filter((r) => r.status === "미진행").length,
  }), [requests]);

  // 상태 변경 (운영 부서 담당자만 가능)
  function handleStatusChange(id: string, newStatus: ContactStatus) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const allowed = allowedTransitions[r.status];
        if (!allowed.includes(newStatus)) return r;
        return {
          ...r,
          status: newStatus,
          processedAt: ["완료", "미진행"].includes(newStatus) ? new Date().toISOString() : r.processedAt,
          assignedTo: r.assignedTo || "현재 담당자",
        };
      })
    );
  }

  // 일괄 상태 변경
  function handleBulkStatusChange() {
    if (!bulkTargetStatus || selectedIds.length === 0) return;
    const targetStatus = bulkTargetStatus as ContactStatus;
    setRequests((prev) =>
      prev.map((r) => {
        if (!selectedIds.includes(r.id)) return r;
        const allowed = allowedTransitions[r.status];
        if (!allowed.includes(targetStatus)) return r;
        return {
          ...r,
          status: targetStatus,
          processedAt: ["완료", "미진행"].includes(bulkTargetStatus) ? new Date().toISOString() : r.processedAt,
          assignedTo: r.assignedTo || "현재 담당자",
        };
      })
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

  // 일괄 변경 가능한 상태 목록 계산
  const bulkAvailableStatuses = useMemo(() => {
    if (selectedIds.length === 0) return [];
    const selectedRequests = requests.filter((r) => selectedIds.includes(r.id));
    // 모든 선택 항목이 전이 가능한 상태만 표시
    const allStatuses: ContactStatus[] = ["접수", "검토 중", "컨택 진행", "미진행", "완료"];
    return allStatuses.filter((s) =>
      selectedRequests.some((r) => allowedTransitions[r.status].includes(s))
    );
  }, [selectedIds, requests]);

  return (
    <>
      <PageHeader
        title="컨택 요청 관리"
        description="T-A-15 · MD가 발송한 크리에이터 컨택 요청 건을 확인하고 처리 상태를 관리합니다. 운영 부서 담당자만 상태 변경이 가능합니다."
        actions={
          <Button size="sm" className="otr-btn-primary" onClick={() => setNewRequestDialog(true)}>
            <UserPlus className="mr-1.5 h-4 w-4" />
            컨택 요청 발송
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* ─── 통계 카드 ─── */}
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: "전체", value: stats.total, color: "text-gray-900", bg: "bg-white" },
            { label: "접수", value: stats["접수"], color: "text-gray-600", bg: "bg-gray-50" },
            { label: "검토 중", value: stats["검토 중"], color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "컨택 진행", value: stats["컨택 진행"], color: "text-blue-600", bg: "bg-blue-50" },
            { label: "완료", value: stats["완료"], color: "text-green-600", bg: "bg-green-50" },
            { label: "미진행", value: stats["미진행"], color: "text-red-600", bg: "bg-red-50" },
          ].map((s) => (
            <Card key={s.label} className={s.bg}>
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── 필터 및 액션 바 ─── */}
        <div className="otr-search-panel flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">필터:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 상태</SelectItem>
              <SelectItem value="접수">접수</SelectItem>
              <SelectItem value="검토 중">검토 중</SelectItem>
              <SelectItem value="컨택 진행">컨택 진행</SelectItem>
              <SelectItem value="완료">완료</SelectItem>
              <SelectItem value="미진행">미진행</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="요청ID / 크리에이터 / MD 검색..."
            className="w-[260px] h-8 text-xs"
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
                  className="otr-btn-secondary h-8 text-xs"
                  onClick={() => setBulkStatusDialog(true)}
                >
                  일괄 상태 변경
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ─── 상태 전이 안내 ─── */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
          <span className="font-medium">상태 흐름:</span>
          <span className="inline-flex items-center gap-1">
            <Badge variant="secondary" className="text-[9px] bg-gray-100 text-gray-700 px-1.5 py-0">접수</Badge>
            <ArrowRight className="h-2.5 w-2.5" />
            <Badge variant="secondary" className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0">검토 중</Badge>
            <ArrowRight className="h-2.5 w-2.5" />
            <Badge variant="secondary" className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0">컨택 진행</Badge>
            <span className="mx-0.5">/</span>
            <Badge variant="secondary" className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0">미진행</Badge>
          </span>
          <span className="mx-1">|</span>
          <span className="inline-flex items-center gap-1">
            <Badge variant="secondary" className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0">컨택 진행</Badge>
            <ArrowRight className="h-2.5 w-2.5" />
            <Badge variant="secondary" className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0">완료</Badge>
          </span>
        </div>

        {/* ─── 테이블: 요청ID | 요청자 | 크리에이터 | 요청일 | 상태 | 처리자 | 처리일 | 비고 ─── */}
        <div>
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
                  <TableHead className="w-[120px]">요청ID</TableHead>
                  <TableHead className="w-[100px]">요청자</TableHead>
                  <TableHead className="min-w-[220px]">크리에이터</TableHead>
                  <TableHead className="w-[140px]">요청일</TableHead>
                  <TableHead className="w-[100px]">상태</TableHead>
                  <TableHead className="w-[110px]">처리자</TableHead>
                  <TableHead className="w-[140px]">처리일</TableHead>
                  <TableHead className="min-w-[200px]">비고</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                      조건에 맞는 컨택 요청이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((req) => {
                    const creator = getCreator(req.creatorId);
                    const stConf = statusConfig[req.status];
                    const nextStatuses = allowedTransitions[req.status];
                    return (
                      <TableRow key={req.id} className="group">
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(req.id)}
                            onCheckedChange={() => toggleSelect(req.id)}
                          />
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {req.id}
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
                                      {copiedEmail === creator.contactEmail ? "복사됨!" : creator.contactEmail}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(req.createdAt)}
                        </TableCell>
                        <TableCell>
                          {nextStatuses.length > 0 ? (
                            <Select
                              value={req.status}
                              onValueChange={(v) => handleStatusChange(req.id, v as ContactStatus)}
                            >
                              <SelectTrigger className="h-6 w-[90px] text-[10px] px-2 border-0 bg-transparent">
                                <Badge variant="secondary" className={`text-[10px] ${stConf.color}`}>
                                  {stConf.label}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={req.status} disabled>{req.status} (현재)</SelectItem>
                                {nextStatuses.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="secondary" className={`text-[10px] ${stConf.color}`}>
                              {stConf.label}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {req.assignedTo || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {req.processedAt ? formatDate(req.processedAt) : "-"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <span className="line-clamp-2">{req.note || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDetailDialog(req)}>
                                <FileText className="mr-2 h-3.5 w-3.5" />
                                요청 상세 보기
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                크리에이터 상세 (T-A-02)
                              </DropdownMenuItem>
                              {creator?.contactEmail && (
                                <DropdownMenuItem onClick={() => copyEmail(creator.contactEmail!)}>
                                  <Copy className="mr-2 h-3.5 w-3.5" />
                                  컨택 이메일 복사
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
        </div>

        {/* ─── 요청 사유 영역: 선택된 항목이 1개일 때 ─── */}
        {selectedIds.length === 1 && (() => {
          const req = requests.find((r) => r.id === selectedIds[0]);
          if (!req) return null;
          const creator = getCreator(req.creatorId);
          return (
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">요청 사유</span>
                  <Badge variant="secondary" className="text-[10px]">{req.id}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{creator?.name}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{req.reason}</p>
                {req.note && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-muted-foreground"><span className="font-medium">비고:</span> {req.note}</p>
                  </div>
                )}
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
              현재 상태에서 전이 가능한 항목만 변경됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-sm">변경할 상태</Label>
            <Select value={bulkTargetStatus} onValueChange={setBulkTargetStatus}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                {bulkAvailableStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {bulkAvailableStatuses.length === 0 && (
              <p className="text-xs text-red-500 mt-2">선택한 항목들은 상태 변경이 불가합니다.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="otr-btn-secondary" onClick={() => setBulkStatusDialog(false)}>
              취소
            </Button>
            <Button className="otr-btn-primary" onClick={handleBulkStatusChange} disabled={!bulkTargetStatus}>
              변경 적용
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── 요청 상세 다이얼로그 ─── */}
      <Dialog open={!!detailDialog} onOpenChange={() => setDetailDialog(null)}>
        {detailDialog && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>컨택 요청 상세</DialogTitle>
              <DialogDescription>요청 ID: {detailDialog.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {(() => {
                const creator = getCreator(detailDialog.creatorId);
                const stConf = statusConfig[detailDialog.status];
                return (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">요청자</p>
                        <p className="font-medium">{detailDialog.mdName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">요청일</p>
                        <p>{formatDate(detailDialog.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">상태</p>
                        <Badge variant="secondary" className={stConf.color}>{stConf.label}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">처리자</p>
                        <p>{detailDialog.assignedTo || "-"}</p>
                      </div>
                      {detailDialog.processedAt && (
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">처리일</p>
                          <p>{formatDate(detailDialog.processedAt)}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">크리에이터</p>
                      <div className="flex items-center gap-2 p-2 bg-gray-50">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                            {creator?.name.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{creator?.name}</p>
                          <p className="text-xs text-muted-foreground">@{creator?.handle} · {creator ? formatNumber(creator.followers) : "-"}</p>
                        </div>
                        {creator?.contactEmail && (
                          <button
                            className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            onClick={() => copyEmail(creator.contactEmail!)}
                          >
                            <Mail className="h-3 w-3" />
                            {copiedEmail === creator.contactEmail ? "복사됨!" : creator.contactEmail}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">요청 사유</p>
                      <p className="text-sm">{detailDialog.reason}</p>
                    </div>
                    {detailDialog.note && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">비고</p>
                        <p className="text-sm">{detailDialog.note}</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <DialogFooter>
              <Button variant="outline" className="otr-btn-secondary" onClick={() => setDetailDialog(null)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ─── 신규 컨택 요청 발송 다이얼로그 ─── */}
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

// ─── 신규 컨택 요청 발송 다이얼로그 ────────────────────────────

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
  const [reason, setReason] = useState("");

  const matchingCreators = useMemo(() => {
    if (!creatorSearch) return [];
    const q = creatorSearch.toLowerCase();
    return (creatorsData as { id: string; name: string; handle: string }[])
      .filter((c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q))
      .slice(0, 5);
  }, [creatorSearch]);

  function handleSubmit() {
    if (!selectedCreator || !reason.trim()) return;
    const count = Math.floor(Math.random() * 900) + 100;
    onSubmit({
      id: `CR-2026-${count}`,
      mdId: "md-1",
      mdName: "김지영 MD",
      creatorId: selectedCreator,
      status: "접수",
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    });
    // reset
    setCreatorSearch("");
    setSelectedCreator("");
    setReason("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>컨택 요청 발송</DialogTitle>
          <DialogDescription>
            크리에이터에 대한 컨택 요청을 CJ 내부 파트너사업부에 발송합니다.
            발송된 요청은 온트러스트 시스템 내에 목록으로 축적됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* 크리에이터 선택 */}
          <div className="space-y-2">
            <Label className="text-sm">대상 크리에이터 *</Label>
            {selectedCreator ? (
              <div className="flex items-center gap-2 p-2 bg-gray-50">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {getCreator(selectedCreator)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{getCreator(selectedCreator)?.name}</span>
                <span className="text-xs text-muted-foreground">@{getCreator(selectedCreator)?.handle}</span>
                {getCreator(selectedCreator)?.contactEmail && (
                  <span className="text-xs text-blue-600 flex items-center gap-0.5">
                    <Mail className="h-2.5 w-2.5" />
                    {getCreator(selectedCreator)?.contactEmail}
                  </span>
                )}
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
                  <div className="border max-h-[160px] overflow-auto">
                    {matchingCreators.map((c) => {
                      const full = getCreator(c.id);
                      return (
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
                          {full?.contactEmail && (
                            <span className="text-[10px] text-blue-500 ml-auto">{full.contactEmail}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 요청 사유 */}
          <div className="space-y-2">
            <Label className="text-sm">요청 사유 *</Label>
            <Textarea
              placeholder="컨택 요청 사유를 입력해주세요. (예: 뷰티 카테고리 인게이지먼트 상위 크리에이터, 캠페인 참여 제안 목적)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>

          {/* API 안내 */}
          <div className="text-[10px] text-muted-foreground bg-gray-50 p-2 space-y-0.5">
            <p className="font-medium">API: CJ 자체 API (피처링 API 아님)</p>
            <p>POST /contact-request — 요청 생성</p>
            <p>데이터 저장: CJ 온트러스트 DB</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="otr-btn-secondary" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button className="otr-btn-primary" onClick={handleSubmit} disabled={!selectedCreator || !reason.trim()}>
            <Send className="mr-1.5 h-4 w-4" />
            컨택 요청 발송
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
