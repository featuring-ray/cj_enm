"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { featuringApi } from "@/lib/featuring-api";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "대기": "default",
  "수락": "secondary",
  "거절": "destructive",
};

// Recommended brands based on past campaigns / affiliate categories
const RECOMMENDED_BRANDS = [
  { name: "올리브영", reason: "과거 캠페인 이력" },
  { name: "이니스프리", reason: "뷰티 카테고리 적합" },
  { name: "에뛰드", reason: "뷰티 카테고리 적합" },
];

const ALL_BRANDS = [
  "올리브영",
  "이니스프리",
  "에뛰드",
  "무신사",
  "CJ제일제당",
  "CJ더마켓",
  "LG전자",
  "아모레퍼시픽",
  "네이처리퍼블릭",
  "쿠팡",
];

export default function CounterProposalPage() {
  const [proposals, setProposals] = useState<
    { id: string; brandName: string; proposedAt: string; status: "대기" | "수락" | "거절"; content: string }[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [proposalContent, setProposalContent] = useState("");

  useEffect(() => {
    featuringApi.getCounterProposals("creator-1").then(setProposals);
  }, []);

  const handleSubmit = () => {
    if (!selectedBrand || !proposalContent.trim()) return;
    const newProposal = {
      id: `cp-${Date.now()}`,
      brandName: selectedBrand,
      proposedAt: new Date().toISOString().slice(0, 10),
      status: "대기" as const,
      content: proposalContent.trim(),
    };
    setProposals((prev) => [newProposal, ...prev]);
    setSelectedBrand("");
    setProposalContent("");
    setDialogOpen(false);
  };

  return (
    <>
      <PageHeader
        title="역제안"
        description="브랜드에 직접 캠페인을 제안하세요"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5 mr-1" />
                제안하기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>새 역제안 작성</DialogTitle>
                <DialogDescription>
                  브랜드를 선택하고 제안 내용을 작성하세요.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>브랜드 선택</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="브랜드를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          추천 브랜드
                        </SelectLabel>
                        {RECOMMENDED_BRANDS.map((b) => (
                          <SelectItem key={b.name} value={b.name}>
                            {b.name}
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({b.reason})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>전체 브랜드</SelectLabel>
                        {ALL_BRANDS.filter(
                          (b) => !RECOMMENDED_BRANDS.some((r) => r.name === b)
                        ).map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>제안 내용</Label>
                  <Textarea
                    value={proposalContent}
                    onChange={(e) => setProposalContent(e.target.value)}
                    rows={4}
                    placeholder="캠페인 내용, 희망 조건 등을 자유롭게 작성하세요..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  취소
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedBrand || !proposalContent.trim()}
                >
                  제안 보내기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Brand Recommendation Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              추천 브랜드
            </CardTitle>
            <CardDescription>
              과거 캠페인 이력 및 제휴 카테고리 기반 추천
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RECOMMENDED_BRANDS.map((brand) => (
                <div
                  key={brand.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{brand.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {brand.reason}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBrand(brand.name);
                      setDialogOpen(true);
                    }}
                  >
                    제안
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proposal List Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              역제안 목록
            </CardTitle>
            <CardDescription>
              총 {proposals.length}건의 역제안
            </CardDescription>
          </CardHeader>
          <CardContent>
            {proposals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                역제안 이력이 없습니다.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제안일</TableHead>
                    <TableHead>브랜드</TableHead>
                    <TableHead>제안 내용</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{p.proposedAt}</TableCell>
                      <TableCell className="text-sm font-medium">
                        {p.brandName}
                      </TableCell>
                      <TableCell className="text-sm max-w-[300px] truncate">
                        {p.content}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANTS[p.status] || "outline"}>
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
