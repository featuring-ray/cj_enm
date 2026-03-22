"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Tag,
  ShoppingBag,
  Package,
  RefreshCcw,
  Star,
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
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { featuringApi } from "@/lib/featuring-api";
import type { Campaign } from "@/types/campaign";

function formatNumber(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString("ko-KR");
}

// Mock data for insights
const MOCK_ENGAGEMENT_TOP5 = [
  { name: "릴스 언박싱", engagement: 8500 },
  { name: "VLOG 리뷰", engagement: 7200 },
  { name: "쇼츠 비교", engagement: 6800 },
  { name: "피드 착샷", engagement: 5400 },
  { name: "라이브 공구", engagement: 4900 },
];

const MOCK_TIME_TREND = [
  { date: "1월", engagement: 4200, reach: 120000, conversions: 380 },
  { date: "2월", engagement: 5800, reach: 165000, conversions: 520 },
  { date: "3월", engagement: 7100, reach: 210000, conversions: 680 },
  { date: "4월", engagement: 6500, reach: 195000, conversions: 610 },
  { date: "5월", engagement: 8200, reach: 250000, conversions: 780 },
  { date: "6월", engagement: 9400, reach: 310000, conversions: 920 },
];

const MOCK_KEYWORDS = [
  { text: "가성비", weight: 95 },
  { text: "추천", weight: 88 },
  { text: "재구매", weight: 82 },
  { text: "배송빠름", weight: 78 },
  { text: "품질좋음", weight: 75 },
  { text: "발림성", weight: 70 },
  { text: "피부결", weight: 65 },
  { text: "성분", weight: 62 },
  { text: "향기", weight: 58 },
  { text: "순함", weight: 55 },
  { text: "보습", weight: 52 },
  { text: "디자인", weight: 48 },
  { text: "색감", weight: 45 },
  { text: "가격", weight: 42 },
  { text: "포장", weight: 38 },
];

const MOCK_CJ_DATA = {
  revenue: 2380000000,
  repurchaseRate: 32.5,
  topProducts: [
    { name: "비비고 왕교자", revenue: 450000000, orders: 28000 },
    { name: "올리브영 세럼", revenue: 380000000, orders: 22000 },
    { name: "무신사 패딩", revenue: 320000000, orders: 8500 },
  ],
};

const MOCK_AFFILIATE_PRODUCTS = [
  { product: "비비고 왕교자 1kg", clicks: 45000, orders: 3200, revenue: 128000000 },
  { product: "올리브영 A.H.A 세럼", clicks: 38000, orders: 2800, revenue: 84000000 },
  { product: "무신사 숏패딩", clicks: 28000, orders: 1200, revenue: 156000000 },
  { product: "CJ제일제당 비비고 만두세트", clicks: 22000, orders: 1800, revenue: 54000000 },
  { product: "tvN 굿즈세트", clicks: 15000, orders: 800, revenue: 32000000 },
];

export default function InsightPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await featuringApi.getAllCampaigns();
        setCampaigns(result.campaigns);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <PageHeader
        title="인사이트"
        description="캠페인/크리에이터/상품별 상세 분석 인사이트"
      />

      <main className="flex-1 p-4">
        <Tabs defaultValue="campaign">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="campaign">캠페인별</TabsTrigger>
            <TabsTrigger value="creator-campaign">캠페인x크리에이터별</TabsTrigger>
            <TabsTrigger value="affiliate">어필리에이트 상품</TabsTrigger>
            <TabsTrigger value="brand">브랜드별</TabsTrigger>
          </TabsList>

          {/* Campaign Insight */}
          <TabsContent value="campaign" className="space-y-6 mt-4">
            <div className="otr-search-panel">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium shrink-0">캠페인 선택</label>
                <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                  <SelectTrigger className="max-w-md">
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
            </div>

            {/* Engagement Top 5 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">콘텐츠 유형별 참여 Top 5</CardTitle>
                <CardDescription>콘텐츠 유형별 평균 참여 수치 비교</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={MOCK_ENGAGEMENT_TOP5} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="hsl(var(--primary))" name="참여수" radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">시간 추이 분석</CardTitle>
                <CardDescription>월별 참여/도달/전환 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={MOCK_TIME_TREND}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="hsl(var(--primary))" name="참여수" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#ef4444" name="전환수" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Keyword Word Cloud (simple tag cloud) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  키워드 워드 클라우드
                </CardTitle>
                <CardDescription>댓글/리뷰에서 추출된 주요 키워드</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center py-4">
                  {MOCK_KEYWORDS.map((kw) => {
                    const fontSize = Math.max(12, Math.min(32, kw.weight * 0.35));
                    const opacity = Math.max(0.4, kw.weight / 100);
                    return (
                      <span
                        key={kw.text}
                        className="text-primary font-medium transition-all hover:scale-110 cursor-default"
                        style={{ fontSize: `${fontSize}px`, opacity }}
                      >
                        {kw.text}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CJ Data Area */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  CJ 데이터 연동 영역
                </CardTitle>
                <CardDescription>CJ ENM 내부 매출/구매 데이터 (연동 데이터)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatsCard
                    title="총 매출"
                    value={`${formatNumber(MOCK_CJ_DATA.revenue)}원`}
                    icon={TrendingUp}
                    description="CJ 전체 캠페인 매출"
                  />
                  <StatsCard
                    title="재구매율"
                    value={`${MOCK_CJ_DATA.repurchaseRate}%`}
                    icon={RefreshCcw}
                    description="캠페인 유입 고객 기준"
                  />
                  <StatsCard
                    title="Top 상품 수"
                    value={`${MOCK_CJ_DATA.topProducts.length}개`}
                    icon={Star}
                    description="매출 상위 상품"
                  />
                </div>
                <div className="space-y-2">
                  {MOCK_CJ_DATA.topProducts.map((p, idx) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between p-3 bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6 text-center">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>매출 {formatNumber(p.revenue)}원</span>
                        <span className="text-muted-foreground">주문 {formatNumber(p.orders)}건</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaign x Creator Insight */}
          <TabsContent value="creator-campaign" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">캠페인 x 크리에이터별 인사이트</CardTitle>
                <CardDescription>
                  캠페인 참여 크리에이터별 세부 성과 분석
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <StatsCard title="평균 참여율" value="4.8%" icon={BarChart3} description="크리에이터 평균" />
                  <StatsCard title="최고 전환율" value="8.2%" icon={TrendingUp} description="뷰티하나" />
                  <StatsCard title="평균 CPR" value="12,500원" icon={ShoppingBag} description="주문 당 비용" />
                  <StatsCard title="총 콘텐츠" value="48건" icon={Package} description="게시 완료 기준" />
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={MOCK_ENGAGEMENT_TOP5}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="hsl(var(--primary))" name="참여수" radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Trend for creator x campaign */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">시간 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={MOCK_TIME_TREND}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="reach" stroke="hsl(var(--primary))" name="도달수" strokeWidth={2} />
                    <Line type="monotone" dataKey="engagement" stroke="#f59e0b" name="참여수" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Keyword cloud */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">키워드 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center py-4">
                  {MOCK_KEYWORDS.slice(0, 10).map((kw) => {
                    const fontSize = Math.max(12, Math.min(28, kw.weight * 0.3));
                    return (
                      <span
                        key={kw.text}
                        className="text-primary font-medium"
                        style={{ fontSize: `${fontSize}px`, opacity: Math.max(0.5, kw.weight / 100) }}
                      >
                        {kw.text}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliate Products */}
          <TabsContent value="affiliate" className="space-y-6 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard title="총 클릭" value="148,000" icon={BarChart3} description="어필리에이트 링크" />
              <StatsCard title="총 주문" value="8,800" icon={ShoppingBag} description="전환 주문 수" />
              <StatsCard title="전환율" value="5.9%" icon={TrendingUp} description="클릭 대비 주문" />
              <StatsCard title="총 매출" value={`${formatNumber(454000000)}원`} icon={Package} description="어필리에이트 매출" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">어필리에이트 상품 성과</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">상품명</th>
                      <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">클릭수</th>
                      <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">주문수</th>
                      <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">매출</th>
                      <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">전환율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_AFFILIATE_PRODUCTS.map((p) => (
                      <tr key={p.product} className="border-b last:border-0">
                        <td className="text-sm font-medium py-3 px-4">{p.product}</td>
                        <td className="text-sm text-right py-3 px-4">{formatNumber(p.clicks)}</td>
                        <td className="text-sm text-right py-3 px-4">{formatNumber(p.orders)}</td>
                        <td className="text-sm text-right py-3 px-4">{formatNumber(p.revenue)}원</td>
                        <td className="text-sm text-right py-3 px-4">
                          {((p.orders / p.clicks) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Keyword Cloud for affiliate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">상품 관련 키워드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center py-4">
                  {MOCK_KEYWORDS.map((kw) => {
                    const fontSize = Math.max(12, Math.min(32, kw.weight * 0.35));
                    return (
                      <span
                        key={kw.text}
                        className="text-primary font-medium"
                        style={{ fontSize: `${fontSize}px`, opacity: Math.max(0.4, kw.weight / 100) }}
                      >
                        {kw.text}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brand Insight */}
          <TabsContent value="brand" className="space-y-6 mt-4">
            <div className="otr-search-panel">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium shrink-0">브랜드 선택</label>
                <Select defaultValue="oliveyoung">
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oliveyoung">올리브영</SelectItem>
                    <SelectItem value="cjcheiljedang">CJ제일제당</SelectItem>
                    <SelectItem value="musinsa">무신사</SelectItem>
                    <SelectItem value="tvn">tvN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard title="브랜드 캠페인" value="12건" icon={Package} description="올리브영 기준" />
              <StatsCard title="총 도달" value="3,200만" icon={BarChart3} description="누적 도달수" />
              <StatsCard title="평균 전환율" value="4.5%" icon={TrendingUp} description="캠페인 평균" />
              <StatsCard title="브랜드 매출" value={`${formatNumber(980000000)}원`} icon={ShoppingBag} description="캠페인 기여 매출" />
            </div>

            {/* Brand engagement top 5 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">브랜드 콘텐츠 참여 Top 5</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={MOCK_ENGAGEMENT_TOP5} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="hsl(var(--primary))" name="참여수" radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Brand time trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">브랜드 성과 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={MOCK_TIME_TREND}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="reach" stroke="hsl(var(--primary))" name="도달수" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#10b981" name="전환수" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Keyword cloud for brand */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">브랜드 키워드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center py-4">
                  {MOCK_KEYWORDS.slice(0, 12).map((kw) => {
                    const fontSize = Math.max(12, Math.min(30, kw.weight * 0.32));
                    return (
                      <span
                        key={kw.text}
                        className="text-primary font-medium"
                        style={{ fontSize: `${fontSize}px`, opacity: Math.max(0.45, kw.weight / 100) }}
                      >
                        {kw.text}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CJ Data area for brand */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CJ 데이터 영역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatsCard
                    title="브랜드 총 매출"
                    value={`${formatNumber(MOCK_CJ_DATA.revenue)}원`}
                    icon={TrendingUp}
                    description="CJ 내부 기준"
                  />
                  <StatsCard
                    title="재구매율"
                    value={`${MOCK_CJ_DATA.repurchaseRate}%`}
                    icon={RefreshCcw}
                    description="브랜드 캠페인 유입"
                  />
                  <StatsCard
                    title="Top 상품"
                    value={MOCK_CJ_DATA.topProducts[0]?.name || "—"}
                    icon={Star}
                    description={`매출 ${formatNumber(MOCK_CJ_DATA.topProducts[0]?.revenue || 0)}원`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
