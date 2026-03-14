"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CampaignRecommendModule } from "@/components/ontner/campaign-recommend-module";
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
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const CAMPAIGNS = [
  { id: "campaign-1", name: "올리브영 봄 신상 공구" },
  { id: "campaign-2", name: "CJ제일제당 비비고 봄 캠페인" },
  { id: "campaign-4", name: "이니스프리 그린티 라인 완료" },
];

const PIE_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];

// Mock data per campaign
const mockEngagementTop5: Record<string, { name: string; score: number }[]> = {
  "campaign-1": [
    { name: "봄 스킨케어 루틴", score: 94.2 },
    { name: "올영 세일 하울", score: 91.8 },
    { name: "신상 마스크팩 리뷰", score: 88.5 },
    { name: "봄 메이크업 룩", score: 85.3 },
    { name: "뷰티 아이템 추천", score: 82.1 },
  ],
  "campaign-2": [
    { name: "비비고 만두 레시피", score: 91.5 },
    { name: "간편식 리뷰", score: 88.2 },
    { name: "봄 국물요리 추천", score: 85.7 },
    { name: "비비고 신메뉴 먹방", score: 83.4 },
    { name: "집밥 레시피", score: 80.1 },
  ],
  "campaign-4": [
    { name: "그린티 세럼 리뷰", score: 90.8 },
    { name: "스킨케어 루틴", score: 87.4 },
    { name: "이니스프리 하울", score: 84.2 },
    { name: "수분크림 비교", score: 81.6 },
    { name: "그린티 라인 전체 리뷰", score: 78.9 },
  ],
};

const mockContentTypePerf: Record<string, { name: string; value: number }[]> = {
  "campaign-1": [
    { name: "공구", value: 45 },
    { name: "리뷰", value: 30 },
    { name: "일반", value: 15 },
    { name: "광고", value: 10 },
  ],
  "campaign-2": [
    { name: "공구", value: 40 },
    { name: "리뷰", value: 25 },
    { name: "일반", value: 20 },
    { name: "광고", value: 15 },
  ],
  "campaign-4": [
    { name: "공구", value: 50 },
    { name: "리뷰", value: 35 },
    { name: "일반", value: 10 },
    { name: "광고", value: 5 },
  ],
};

const mockTimeTrend = [
  { date: "03/01", engagement: 82, clicks: 320, conversions: 12 },
  { date: "03/02", engagement: 88, clicks: 410, conversions: 18 },
  { date: "03/03", engagement: 75, clicks: 280, conversions: 10 },
  { date: "03/04", engagement: 92, clicks: 520, conversions: 24 },
  { date: "03/05", engagement: 96, clicks: 610, conversions: 28 },
  { date: "03/06", engagement: 85, clicks: 450, conversions: 20 },
  { date: "03/07", engagement: 91, clicks: 550, conversions: 25 },
  { date: "03/08", engagement: 88, clicks: 490, conversions: 22 },
  { date: "03/09", engagement: 94, clicks: 580, conversions: 27 },
  { date: "03/10", engagement: 90, clicks: 530, conversions: 23 },
];

// CJ data (mock)
const mockCjTopCampaigns = [
  { rank: 1, name: "올리브영 봄 신상 공구", revenue: 234000000 },
  { rank: 2, name: "CJ제일제당 비비고 봄", revenue: 189000000 },
  { rank: 3, name: "무신사 봄 컬렉션", revenue: 156000000 },
  { rank: 4, name: "이니스프리 그린티", revenue: 128000000 },
  { rank: 5, name: "LG전자 스타일러", revenue: 98000000 },
];

const mockCjTopProducts = [
  { rank: 1, name: "그린티 시드 세럼", sales: 15200 },
  { rank: 2, name: "비비고 만두 세트", sales: 12800 },
  { rank: 3, name: "올영 스킨케어 세트", sales: 11500 },
  { rank: 4, name: "무신사 봄 재킷", sales: 9800 },
  { rank: 5, name: "스타일러 신모델", sales: 3200 },
];

function formatKRW(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

export default function CampaignInsightPage() {
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-03-11");
  const [selectedCampaign, setSelectedCampaign] = useState("campaign-1");

  const engagementData = mockEngagementTop5[selectedCampaign] || mockEngagementTop5["campaign-1"];
  const contentTypeData = mockContentTypePerf[selectedCampaign] || mockContentTypePerf["campaign-1"];
  const campaignName = CAMPAIGNS.find((c) => c.id === selectedCampaign)?.name || "";

  // Dynamic template text
  const topContentName = engagementData[0]?.name || "-";
  const topContentScore = engagementData[0]?.score || 0;
  const topType = contentTypeData[0]?.name || "-";
  const topTypePercent = contentTypeData[0]?.value || 0;
  const avgEngagement = Math.round(
    mockTimeTrend.reduce((s, t) => s + t.engagement, 0) / mockTimeTrend.length
  );
  const totalConversions = mockTimeTrend.reduce((s, t) => s + t.conversions, 0);

  return (
    <>
      <PageHeader
        title="인사이트 리포트 - 캠페인"
        description="캠페인별 콘텐츠 성과 분석"
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

        {/* Insight Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              인사이트 요약
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>{campaignName}</strong> 캠페인에서 가장 높은 참여도를 기록한 콘텐츠는{" "}
              <strong>&quot;{topContentName}&quot;</strong> (참여 점수 {topContentScore})입니다.
            </p>
            <p className="text-sm">
              콘텐츠 유형 중 <strong>{topType}</strong>가 전체의 {topTypePercent}%로 가장 효과적이었습니다.
            </p>
            <p className="text-sm">
              선택 기간 평균 참여도는 <strong>{avgEngagement}</strong>점이며, 총 전환 수는{" "}
              <strong>{totalConversions}건</strong>입니다.
            </p>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Engagement Top 5 - BarChart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">콘텐츠 참여도 Top 5</CardTitle>
              <CardDescription>참여 점수 기준 상위 콘텐츠</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={engagementData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    fontSize={11}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} name="참여 점수" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Content Type Performance - PieChart (donut) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">콘텐츠 유형별 성과</CardTitle>
              <CardDescription>유형 비중 분포</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {contentTypeData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Time-based Trend - LineChart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">시간대별 트렌드</CardTitle>
            <CardDescription>참여도, 클릭, 전환 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="참여도"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  name="클릭"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="전환"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CJ Data Area (Mock) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 5 Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CJ 매출 Top 5 캠페인</CardTitle>
              <CardDescription>사내 데이터 (mock)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCjTopCampaigns.map((c) => (
                  <div
                    key={c.rank}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs w-6 justify-center">
                        {c.rank}
                      </Badge>
                      <span className="text-sm truncate max-w-[140px]">
                        {c.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatKRW(c.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CJ 인기 상품 Top 5</CardTitle>
              <CardDescription>판매량 기준 (mock)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCjTopProducts.map((p) => (
                  <div
                    key={p.rank}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs w-6 justify-center">
                        {p.rank}
                      </Badge>
                      <span className="text-sm truncate max-w-[140px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {p.sales.toLocaleString()}건
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Repurchase Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">재구매율 현황</CardTitle>
              <CardDescription>캠페인별 재구매 (mock)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "올리브영 봄 신상 공구", rate: 32.5 },
                  { name: "비비고 봄 캠페인", rate: 28.1 },
                  { name: "이니스프리 그린티", rate: 24.8 },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate max-w-[160px]">{item.name}</span>
                      <span className="font-medium">{item.rate}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* O-C-06: 리포트 하단 추천 모듈 */}
        <div className="rounded-lg border bg-card p-5">
          <CampaignRecommendModule
            creatorId="creator-1"
            title="참여 추천 캠페인 · 리워드링크 상품"
          />
        </div>
      </main>
    </>
  );
}
