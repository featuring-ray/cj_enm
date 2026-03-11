"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Send,
  UserPlus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { featuringApi } from "@/lib/featuring-api";
import type { Campaign } from "@/types/campaign";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  draft: { label: "초안", variant: "outline" },
  proposed: { label: "제안됨", variant: "secondary" },
  in_progress: { label: "진행중", variant: "default" },
  completed: { label: "완료", variant: "secondary" },
  cancelled: { label: "취소", variant: "destructive" },
};

export default function CampaignManagementPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Propose modal
  const [proposeOpen, setProposeOpen] = useState(false);
  const [proposeStep, setProposeStep] = useState(1);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalCreatorIds, setProposalCreatorIds] = useState("");

  // Signup proposal modal
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupCreatorName, setSignupCreatorName] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await featuringApi.getAllCampaigns(
          statusFilter !== "all" ? { status: statusFilter } : undefined
        );
        setCampaigns(result.campaigns);
        setTotal(result.total);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter]);

  const filtered = campaigns.filter(
    (c) =>
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePropose = async () => {
    if (!selectedCampaignId || !proposalCreatorIds.trim()) return;
    const ids = proposalCreatorIds.split(",").map((s) => s.trim()).filter(Boolean);
    await featuringApi.proposeCampaign(selectedCampaignId, ids, proposalMessage);
    alert("캠페인 제안이 발송되었습니다.");
    setProposeOpen(false);
    setProposeStep(1);
    setSelectedCampaignId("");
    setProposalMessage("");
    setProposalCreatorIds("");
  };

  const handleSignup = () => {
    alert(`${signupCreatorName}에게 회원가입 제안을 발송했습니다.`);
    setSignupOpen(false);
    setSignupCreatorName("");
    setSignupMessage("");
  };

  return (
    <>
      <PageHeader
        title="캠페인 관리"
        description="전체 캠페인을 관리하고 크리에이터에게 제안을 발송합니다"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSignupOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              회원가입 제안
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setProposeStep(1); setProposeOpen(true); }}>
              <Send className="h-4 w-4 mr-1.5" />
              캠페인 제안
            </Button>
            <Button size="sm" onClick={() => router.push("/ontrust/campaign/new")}>
              <Plus className="h-4 w-4 mr-1.5" />
              캠페인 등록
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="캠페인명 또는 브랜드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="draft">초안</SelectItem>
              <SelectItem value="proposed">제안됨</SelectItem>
              <SelectItem value="in_progress">진행중</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="cancelled">취소</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">총 {total}건</span>
        </div>

        {/* Campaign Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>캠페인명</TableHead>
                    <TableHead>브랜드</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>크리에이터</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>예산</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                        검색 결과가 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((campaign) => {
                      const statusMeta = STATUS_LABELS[campaign.status] || {
                        label: campaign.status,
                        variant: "outline" as const,
                      };
                      return (
                        <TableRow
                          key={campaign.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/ontrust/campaigns/${campaign.id}`)}
                        >
                          <TableCell className="font-medium text-sm">
                            {campaign.title}
                          </TableCell>
                          <TableCell className="text-sm">{campaign.brandName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {campaign.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusMeta.variant} className="text-xs">
                              {statusMeta.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {campaign.creators.length}명
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(campaign.startDate).toLocaleDateString("ko-KR")} ~{" "}
                            {new Date(campaign.endDate).toLocaleDateString("ko-KR")}
                          </TableCell>
                          <TableCell className="text-sm">
                            {(campaign.budget / 10000).toFixed(0)}만원
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Campaign Propose Modal (2 steps) */}
      <Dialog open={proposeOpen} onOpenChange={setProposeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              캠페인 제안 {proposeStep === 1 ? "(1/2) 캠페인 선택" : "(2/2) 제안 작성"}
            </DialogTitle>
          </DialogHeader>

          {proposeStep === 1 && (
            <div className="space-y-3">
              <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                <SelectTrigger>
                  <SelectValue placeholder="캠페인을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title} ({c.brandName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {proposeStep === 2 && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">크리에이터 ID (쉼표 구분)</label>
                <Input
                  placeholder="creator-1, creator-2"
                  value={proposalCreatorIds}
                  onChange={(e) => setProposalCreatorIds(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">제안 메시지</label>
                <Textarea
                  placeholder="크리에이터에게 보낼 메시지를 입력하세요..."
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {proposeStep === 2 && (
              <Button variant="outline" onClick={() => setProposeStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                이전
              </Button>
            )}
            {proposeStep === 1 ? (
              <Button
                onClick={() => setProposeStep(2)}
                disabled={!selectedCampaignId}
              >
                다음
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handlePropose} disabled={!proposalCreatorIds.trim()}>
                <Send className="h-4 w-4 mr-1.5" />
                제안 발송
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signup Proposal Modal */}
      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>회원가입 제안</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">크리에이터명 / 계정</label>
              <Input
                placeholder="@username 또는 크리에이터명"
                value={signupCreatorName}
                onChange={(e) => setSignupCreatorName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">안내 메시지</label>
              <Textarea
                placeholder="온트너 가입 안내 메시지..."
                value={signupMessage}
                onChange={(e) => setSignupMessage(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignupOpen(false)}>취소</Button>
            <Button onClick={handleSignup} disabled={!signupCreatorName.trim()}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              발송
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
