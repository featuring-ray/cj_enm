"use client";

import { useState } from "react";
import {
  DollarSign,
  MousePointerClick,
  TrendingUp,
  FileText,
  Link2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";

const CAMPAIGNS = [
  { id: "all", name: "전체 캠페인" },
  { id: "campaign-1", name: "올리브영 봄 신상 공구" },
  { id: "campaign-2", name: "CJ제일제당 비비고 봄 캠페인" },
  { id: "campaign-4", name: "이니스프리 그린티 라인 완료" },
];

const mockContentPerformance = [
  {
    id: "c1",
    campaign: "올리브영 봄 신상 공구",
    type: "공구" as const,
    platform: "instagram",
    likes: 12400,
    comments: 890,
    saves: 2100,
    shares: 450,
    clicks: 3200,
    conversions: 128,
    revenue: 4480000,
    postedAt: "2026-03-01",
  },
  {
    id: "c2",
    campaign: "CJ제일제당 비비고 봄 캠페인",
    type: "공구" as const,
    platform: "instagram",
    likes: 9800,
    comments: 1230,
    saves: 1800,
    shares: 620,
    clicks: 2800,
    conversions: 95,
    revenue: 3325000,
    postedAt: "2026-03-02",
  },
  {
    id: "c3",
    campaign: "올리브영 봄 신상 공구",
    type: "리뷰" as const,
    platform: "youtube",
    likes: 15200,
    comments: 2100,
    saves: 3400,
    shares: 890,
    clicks: 5100,
    conversions: 204,
    revenue: 7140000,
    postedAt: "2026-02-28",
  },
  {
    id: "c4",
    campaign: "이니스프리 그린티 라인 완료",
    type: "공구" as const,
    platform: "instagram",
    likes: 10800,
    comments: 1120,
    saves: 2400,
    shares: 520,
    clicks: 3800,
    conversions: 152,
    revenue: 5320000,
    postedAt: "2026-01-15",
  },
];

const mockRewardLinks = [
  {
    id: "rl1",
    campaign: "올리브영 봄 신상 공구",
    link: "https://link.ontner.com/abc123",
    clicks: 8100,
    conversions: 332,
    revenue: 11620000,
  },
  {
    id: "rl2",
    campaign: "CJ제일제당 비비고 봄 캠페인",
    link: "https://link.ontner.com/def456",
    clicks: 2800,
    conversions: 95,
    revenue: 3325000,
  },
  {
    id: "rl3",
    campaign: "이니스프리 그린티 라인 완료",
    link: "https://link.ontner.com/ghi789",
    clicks: 3800,
    conversions: 152,
    revenue: 5320000,
  },
];

function formatKRW(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

export default function PerformancePage() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-03-11");
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  const filteredContent = mockContentPerformance.filter((c) => {
    if (selectedCampaign !== "all") {
      const campaignName = CAMPAIGNS.find((cm) => cm.id === selectedCampaign)?.name;
      if (campaignName && c.campaign !== campaignName) return false;
    }
    if (c.postedAt < startDate || c.postedAt > endDate) return false;
    return true;
  });

  const filteredRewardLinks =
    selectedCampaign === "all"
      ? mockRewardLinks
      : mockRewardLinks.filter((rl) => {
          const campaignName = CAMPAIGNS.find((cm) => cm.id === selectedCampaign)?.name;
          return rl.campaign === campaignName;
        });

  const totalRevenue = filteredContent.reduce((s, c) => s + c.revenue, 0);
  const totalClicks = filteredContent.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = filteredContent.reduce((s, c) => s + c.conversions, 0);
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0";

  return (
    <>
      <PageHeader
        title="성과조회"
        description="캠페인별 콘텐츠 성과 및 리워드 링크 현황"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>시작일</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>종료일</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>캠페인</Label>
                <Select
                  value={selectedCampaign}
                  onValueChange={setSelectedCampaign}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPAIGNS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="총 매출"
            value={formatKRW(totalRevenue)}
            description="선택 기간 합산"
            icon={DollarSign}
            trend={{ value: "+12%", positive: true }}
          />
          <StatsCard
            title="총 클릭"
            value={totalClicks.toLocaleString()}
            description="리워드 링크 포함"
            icon={MousePointerClick}
            trend={{ value: "+8%", positive: true }}
          />
          <StatsCard
            title="전환율"
            value={`${conversionRate}%`}
            description="클릭 대비 구매"
            icon={TrendingUp}
            trend={{ value: "+0.3%p", positive: true }}
          />
          <StatsCard
            title="콘텐츠 수"
            value={`${filteredContent.length}건`}
            description="선택 기간 게시"
            icon={FileText}
          />
        </div>

        {/* Content Engagement Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">콘텐츠 참여 현황</CardTitle>
            <CardDescription>
              콘텐츠별 참여 지표 및 매출
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>게시일</TableHead>
                  <TableHead>캠페인</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead className="text-right">좋아요</TableHead>
                  <TableHead className="text-right">댓글</TableHead>
                  <TableHead className="text-right">클릭</TableHead>
                  <TableHead className="text-right">전환</TableHead>
                  <TableHead className="text-right">매출</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-sm">{c.postedAt}</TableCell>
                    <TableCell className="text-sm font-medium max-w-[180px] truncate">
                      {c.campaign}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {c.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {c.likes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {c.comments.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {c.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {c.conversions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatKRW(c.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Reward Link Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              리워드 링크 성과
            </CardTitle>
            <CardDescription>
              캠페인별 리워드 링크 클릭 및 전환
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>캠페인</TableHead>
                  <TableHead>링크</TableHead>
                  <TableHead className="text-right">클릭</TableHead>
                  <TableHead className="text-right">전환</TableHead>
                  <TableHead className="text-right">매출</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRewardLinks.map((rl) => (
                  <TableRow key={rl.id}>
                    <TableCell className="text-sm font-medium max-w-[180px] truncate">
                      {rl.campaign}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {rl.link}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {rl.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {rl.conversions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatKRW(rl.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
