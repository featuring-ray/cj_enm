"use client";

import { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Users,
  ShoppingCart,
  Star,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// ─── Mock 데이터 ──────────────────────────────────────────
const CAMPAIGNS = [
  { id: "c-1", name: "봄맞이 스킨케어 프로모션", brand: "라네즈", category: "뷰티" },
  { id: "c-2", name: "신상 패션 룩북 캠페인", brand: "무신사", category: "패션" },
  { id: "c-3", name: "프리미엄 푸드 체험단", brand: "CJ제일제당", category: "푸드" },
];

const mockSummary = {
  totalRevenue: 32000000,
  totalOrders: 680,
  conversionRate: 5.1,
  avgOrderValue: 47059,
  creatorCount: 8,
  contentCount: 24,
};

const monthlyTrendData = [
  { month: "10월", revenue: 18200000, orders: 380 },
  { month: "11월", revenue: 22500000, orders: 470 },
  { month: "12월", revenue: 28100000, orders: 590 },
  { month: "1월", revenue: 25400000, orders: 530 },
  { month: "2월", revenue: 29800000, orders: 620 },
  { month: "3월", revenue: 32000000, orders: 680 },
];

const topCreators = [
  {
    id: "c1",
    name: "뷰티크리에이터 지연",
    handle: "@beauty_jiyeon",
    revenue: 9800000,
    orders: 208,
    engagementRate: 5.2,
    isOntnerMember: true,
  },
  {
    id: "c2",
    name: "스킨케어 미나",
    handle: "@skincare_mina",
    revenue: 7600000,
    orders: 162,
    engagementRate: 4.8,
    isOntnerMember: true,
  },
  {
    id: "c3",
    name: "데일리뷰티 하나",
    handle: "@dailybeauty_hana",
    revenue: 6200000,
    orders: 132,
    engagementRate: 6.1,
    isOntnerMember: true,
  },
  {
    id: "c4",
    name: "미용실 언니 수아",
    handle: "@salon_sua",
    revenue: 4800000,
    orders: 102,
    engagementRate: 3.9,
    isOntnerMember: false,
  },
  {
    id: "c5",
    name: "글로우업 유나",
    handle: "@glowup_yuna",
    revenue: 3600000,
    orders: 76,
    engagementRate: 7.2,
    isOntnerMember: true,
  },
];

const customerSegment = [
  { range: "10대", percent: 8, count: 54 },
  { range: "20대", percent: 42, count: 286 },
  { range: "30대", percent: 33, count: 224 },
  { range: "40대", percent: 12, count: 82 },
  { range: "50대+", percent: 5, count: 34 },
];

const repurchaseCycle = [
  { category: "스킨케어", avgDays: 28, rate: 38 },
  { category: "메이크업", avgDays: 45, rate: 22 },
  { category: "헤어케어", avgDays: 35, rate: 18 },
];

function formatRevenue(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString("ko-KR");
}

// ─── 컴포넌트 ─────────────────────────────────────────────
export default function PartnerInsightPage() {
  const [selectedCampaign, setSelectedCampaign] = useState(CAMPAIGNS[0].id);

  const campaign = CAMPAIGNS.find((c) => c.id === selectedCampaign) || CAMPAIGNS[0];

  return (
    <>
      <PageHeader
        title="인사이트 리포트"
        description="캠페인 성과 분석 및 크리에이터 인사이트를 확인합니다"
        actions={
          <Badge variant="outline" className="text-xs">
            P-C-01
          </Badge>
        }
      />

      <main className="flex-1 p-6 space-y-6">
        {/* 캠페인 선택 */}
        <Card>
          <CardContent className="py-4 px-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Label className="text-sm font-medium whitespace-nowrap">캠페인 선택</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGNS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.brand})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline">{campaign.category}</Badge>
              <Badge variant="secondary">{campaign.brand}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* KPI 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatsCard
            title="총 매출"
            value={`${formatRevenue(mockSummary.totalRevenue)}원`}
            trend={{ value: "+14.2%", positive: true }}
            icon={TrendingUp}
          />
          <StatsCard
            title="총 주문"
            value={`${mockSummary.totalOrders.toLocaleString()}건`}
            trend={{ value: "+9.8%", positive: true }}
            icon={ShoppingCart}
          />
          <StatsCard
            title="전환율"
            value={`${mockSummary.conversionRate}%`}
            trend={{ value: "+0.8%p", positive: true }}
            icon={BarChart3}
          />
          <StatsCard
            title="평균 객단가"
            value={`${formatRevenue(mockSummary.avgOrderValue)}원`}
            icon={Star}
          />
          <StatsCard
            title="참여 크리에이터"
            value={`${mockSummary.creatorCount}명`}
            icon={Users}
          />
          <StatsCard
            title="게시 콘텐츠"
            value={`${mockSummary.contentCount}개`}
            icon={RefreshCcw}
          />
        </div>

        {/* 월별 매출 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">월별 매출·주문 추이</CardTitle>
            <CardDescription>최근 6개월 기준</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v) => `${v}건`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === "revenue"
                      ? [`${formatRevenue(value as number)}원`, "매출"]
                      : [`${value}건`, "주문수"]
                  }
                />
                <Legend
                  formatter={(v) => (v === "revenue" ? "매출" : "주문수")}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {/* TOP 5 크리에이터 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">협업 크리에이터 TOP 5</CardTitle>
              <CardDescription>매출 기준 상위 크리에이터</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4 w-[160px]">크리에이터</TableHead>
                    <TableHead className="text-right">매출</TableHead>
                    <TableHead className="text-right">주문</TableHead>
                    <TableHead className="text-center">온트너</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCreators.map((creator, idx) => (
                    <TableRow key={creator.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-4">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-medium">{creator.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {creator.handle}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatRevenue(creator.revenue)}원
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {creator.orders}건
                      </TableCell>
                      <TableCell className="text-center">
                        {creator.isOntnerMember ? (
                          <Badge variant="default" className="text-[10px]">회원</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">비회원</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 고객 연령대 분포 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">구매 고객 분포</CardTitle>
              <CardDescription>연령대별 구매 고객 비율</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={customerSegment} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="range" type="category" tick={{ fontSize: 12 }} width={36} />
                  <Tooltip formatter={(v) => [`${v}%`, "비율"]} />
                  <Bar dataKey="percent" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {customerSegment.map((seg) => (
                  <div key={seg.range} className="flex items-center gap-1 text-xs">
                    <span className="text-muted-foreground">{seg.range}:</span>
                    <span className="font-medium">{seg.count}명</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 반복구매 주기 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">카테고리별 반복구매 주기</CardTitle>
            <CardDescription>
              캠페인 구매 고객의 동일 카테고리 재구매 평균 주기
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              {repurchaseCycle.map((item) => (
                <div
                  key={item.category}
                  className="p-4 rounded-lg border bg-muted/30 text-center"
                >
                  <p className="text-sm font-medium">{item.category}</p>
                  <p className="text-2xl font-bold text-primary mt-2">
                    {item.avgDays}일
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    평균 재구매 주기
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-[10px]">
                      재구매율 {item.rate}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700">
                💡 <strong>활용 TIP:</strong> 반복구매 주기에 맞춰 리마인드 캠페인을 진행하면 전환율을 높일 수 있습니다
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 크리에이터 추천 모듈 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">협업 추천 크리에이터</CardTitle>
                <CardDescription>
                  {campaign.brand} 브랜드와 핏이 좋은 온트너 회원 크리에이터
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                더보기
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topCreators.filter((c) => c.isOntnerMember).slice(0, 3).map((creator) => (
                <div
                  key={creator.id}
                  className="p-3 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{creator.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {creator.handle}
                      </p>
                    </div>
                    <Badge variant="default" className="text-[10px]">온트너</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>참여율 {creator.engagementRate}%</span>
                    <span>매출 {formatRevenue(creator.revenue)}원</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
