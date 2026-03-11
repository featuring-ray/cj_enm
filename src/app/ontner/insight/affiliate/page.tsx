"use client";

import { useState } from "react";
import { Sparkles, Link2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
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

const PRODUCTS = [
  { id: "prod-1", name: "그린티 시드 세럼" },
  { id: "prod-2", name: "비비고 만두 세트" },
  { id: "prod-3", name: "올영 스킨케어 세트" },
  { id: "prod-4", name: "무신사 봄 재킷" },
  { id: "prod-5", name: "스타일러 신모델" },
];

const PIE_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];

// Mock data per product
const mockProductEngagementTop5: Record<string, { name: string; score: number }[]> = {
  "prod-1": [
    { name: "세럼 사용 후기", score: 92.4 },
    { name: "스킨케어 루틴 영상", score: 89.1 },
    { name: "그린티 라인 비교", score: 86.7 },
    { name: "3주 사용 리뷰", score: 83.2 },
    { name: "언박싱 릴스", score: 80.5 },
  ],
  "prod-2": [
    { name: "만두 레시피 TOP3", score: 91.0 },
    { name: "간편식 먹방", score: 87.5 },
    { name: "비비고 신메뉴 리뷰", score: 84.8 },
    { name: "집밥 만두전골", score: 81.3 },
    { name: "편의점 만두 vs 비비고", score: 78.6 },
  ],
  "prod-3": [
    { name: "올영 세일 하울", score: 90.2 },
    { name: "스킨케어 세트 비교", score: 87.8 },
    { name: "봄 피부관리 루틴", score: 84.1 },
    { name: "가성비 스킨케어", score: 81.5 },
    { name: "올영 추천 아이템", score: 79.0 },
  ],
  "prod-4": [
    { name: "봄 자켓 코디", score: 88.7 },
    { name: "데일리룩 추천", score: 85.4 },
    { name: "무신사 하울", score: 82.9 },
    { name: "가격대별 자켓 비교", score: 80.1 },
    { name: "S/S 트렌드 룩북", score: 77.6 },
  ],
  "prod-5": [
    { name: "스타일러 리뷰", score: 96.5 },
    { name: "가전 비교 분석", score: 93.2 },
    { name: "스타일러 사용 팁", score: 89.8 },
    { name: "의류 관리 꿀팁", score: 86.1 },
    { name: "스타일러 설치 후기", score: 82.4 },
  ],
};

const mockProductTypePerf: Record<string, { name: string; value: number }[]> = {
  "prod-1": [
    { name: "리뷰", value: 40 },
    { name: "공구", value: 35 },
    { name: "일반", value: 15 },
    { name: "광고", value: 10 },
  ],
  "prod-2": [
    { name: "공구", value: 45 },
    { name: "일반", value: 25 },
    { name: "리뷰", value: 20 },
    { name: "광고", value: 10 },
  ],
  "prod-3": [
    { name: "공구", value: 50 },
    { name: "리뷰", value: 30 },
    { name: "일반", value: 12 },
    { name: "광고", value: 8 },
  ],
  "prod-4": [
    { name: "리뷰", value: 38 },
    { name: "공구", value: 32 },
    { name: "일반", value: 18 },
    { name: "광고", value: 12 },
  ],
  "prod-5": [
    { name: "리뷰", value: 55 },
    { name: "광고", value: 25 },
    { name: "일반", value: 12 },
    { name: "공구", value: 8 },
  ],
};

const mockAffiliateTrend = [
  { date: "03/01", clicks: 180, conversions: 8, revenue: 280000 },
  { date: "03/02", clicks: 220, conversions: 12, revenue: 420000 },
  { date: "03/03", clicks: 150, conversions: 6, revenue: 210000 },
  { date: "03/04", clicks: 310, conversions: 18, revenue: 630000 },
  { date: "03/05", clicks: 280, conversions: 15, revenue: 525000 },
  { date: "03/06", clicks: 240, conversions: 11, revenue: 385000 },
  { date: "03/07", clicks: 350, conversions: 20, revenue: 700000 },
  { date: "03/08", clicks: 290, conversions: 14, revenue: 490000 },
  { date: "03/09", clicks: 380, conversions: 22, revenue: 770000 },
  { date: "03/10", clicks: 320, conversions: 17, revenue: 595000 },
];

// CJ data (mock)
const mockAffiliateTopProducts = [
  { rank: 1, name: "그린티 시드 세럼", conversions: 204, conversionRate: 4.2 },
  { rank: 2, name: "비비고 만두 세트", conversions: 178, conversionRate: 3.8 },
  { rank: 3, name: "올영 스킨케어 세트", conversions: 152, conversionRate: 3.5 },
  { rank: 4, name: "무신사 봄 재킷", conversions: 98, conversionRate: 2.9 },
  { rank: 5, name: "스타일러 신모델", conversions: 42, conversionRate: 5.1 },
];

const mockRepurchaseByProduct = [
  { name: "그린티 시드 세럼", rate: 35.2 },
  { name: "비비고 만두 세트", rate: 42.8 },
  { name: "올영 스킨케어 세트", rate: 28.5 },
];

function formatKRW(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

export default function AffiliateInsightPage() {
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-03-11");
  const [selectedProduct, setSelectedProduct] = useState("prod-1");

  const engagementData =
    mockProductEngagementTop5[selectedProduct] || mockProductEngagementTop5["prod-1"];
  const contentTypeData =
    mockProductTypePerf[selectedProduct] || mockProductTypePerf["prod-1"];
  const productName = PRODUCTS.find((p) => p.id === selectedProduct)?.name || "";

  // Dynamic template text
  const topContentName = engagementData[0]?.name || "-";
  const topContentScore = engagementData[0]?.score || 0;
  const topType = contentTypeData[0]?.name || "-";
  const topTypePercent = contentTypeData[0]?.value || 0;
  const totalClicks = mockAffiliateTrend.reduce((s, t) => s + t.clicks, 0);
  const totalConversions = mockAffiliateTrend.reduce((s, t) => s + t.conversions, 0);
  const totalRevenue = mockAffiliateTrend.reduce((s, t) => s + t.revenue, 0);

  return (
    <>
      <PageHeader
        title="인사이트 리포트 - 제휴/리워드"
        description="제휴 링크 상품별 성과 분석"
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
                <Label>상품 선택</Label>
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
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
              제휴 인사이트 요약
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>{productName}</strong> 상품에서 가장 높은 참여도를 기록한 콘텐츠는{" "}
              <strong>&quot;{topContentName}&quot;</strong> (참여 점수 {topContentScore})입니다.
            </p>
            <p className="text-sm">
              콘텐츠 유형 중 <strong>{topType}</strong>가 전체의 {topTypePercent}%로 가장 높은 전환을 기록했습니다.
            </p>
            <p className="text-sm">
              선택 기간 총 클릭 <strong>{totalClicks.toLocaleString()}회</strong>, 전환{" "}
              <strong>{totalConversions}건</strong>, 매출 <strong>{formatKRW(totalRevenue)}</strong>을 달성했습니다.
            </p>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Engagement Top 5 - BarChart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">콘텐츠 참여도 Top 5</CardTitle>
              <CardDescription>{productName} 관련 콘텐츠 기준</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={engagementData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
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
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              제휴 링크 시간대별 트렌드
            </CardTitle>
            <CardDescription>클릭, 전환, 매출 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockAffiliateTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="클릭"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  name="전환"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CJ Data Area (Mock) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products by Conversion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">상품별 전환 현황</CardTitle>
              <CardDescription>CJ 사내 데이터 (mock)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAffiliateTopProducts.map((p) => (
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
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {p.conversions}건
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({p.conversionRate}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Repurchase Rate by Product */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">상품별 재구매율</CardTitle>
              <CardDescription>CJ 사내 데이터 (mock)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRepurchaseByProduct.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate max-w-[180px]">{item.name}</span>
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
      </main>
    </>
  );
}
