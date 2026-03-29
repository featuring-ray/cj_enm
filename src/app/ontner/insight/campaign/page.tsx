"use client";

import { useState } from "react";
import { Sparkles, Lightbulb, RefreshCcw, ArrowRight, AlertCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CampaignRecommendModule } from "@/components/ontner/campaign-recommend-module";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import mockRetentionJson from "@/data/mock/retention.json";
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
  Legend,
} from "recharts";

const CAMPAIGNS = [
  { id: "campaign-1", name: "올리브영 봄 신상 공구", status: "완료" },
  { id: "campaign-2", name: "CJ제일제당 비비고 봄 캠페인", status: "완료" },
  { id: "campaign-4", name: "이니스프리 그린티 라인 완료", status: "완료" },
];

const completedCampaigns = CAMPAIGNS.filter((c) => c.status === "완료");

const PIE_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];

// 콘텐츠 인게이지먼트 TOP 5 (상세 지표 포함)
const mockEngagementTop5: Record<
  string,
  { name: string; score: number; likes: number; comments: number; views: number; saves: number; contentType: string; postedHour: number }[]
> = {
  "campaign-1": [
    { name: "봄 스킨케어 루틴", score: 94.2, likes: 15200, comments: 2100, views: 120000, saves: 3400, contentType: "리뷰", postedHour: 20 },
    { name: "올영 세일 하울", score: 91.8, likes: 12400, comments: 890, views: 45000, saves: 2100, contentType: "공구", postedHour: 12 },
    { name: "신상 마스크팩 리뷰", score: 88.5, likes: 10800, comments: 1120, views: 52000, saves: 2400, contentType: "리뷰", postedHour: 19 },
    { name: "봄 메이크업 룩", score: 85.3, likes: 9800, comments: 780, views: 38000, saves: 1800, contentType: "일반", postedHour: 21 },
    { name: "뷰티 아이템 추천", score: 82.1, likes: 8200, comments: 620, views: 32000, saves: 1400, contentType: "공구", postedHour: 20 },
  ],
  "campaign-2": [
    { name: "비비고 만두 레시피", score: 91.5, likes: 11200, comments: 1850, views: 85000, saves: 2800, contentType: "리뷰", postedHour: 18 },
    { name: "간편식 리뷰", score: 88.2, likes: 9800, comments: 1230, views: 38000, saves: 1800, contentType: "리뷰", postedHour: 12 },
    { name: "봄 국물요리 추천", score: 85.7, likes: 8500, comments: 920, views: 32000, saves: 1500, contentType: "일반", postedHour: 19 },
    { name: "비비고 신메뉴 먹방", score: 83.4, likes: 7800, comments: 1100, views: 28000, saves: 1200, contentType: "공구", postedHour: 20 },
    { name: "집밥 레시피", score: 80.1, likes: 6500, comments: 780, views: 24000, saves: 980, contentType: "일반", postedHour: 21 },
  ],
  "campaign-4": [
    { name: "그린티 세럼 리뷰", score: 90.8, likes: 13500, comments: 1950, views: 95000, saves: 3100, contentType: "리뷰", postedHour: 20 },
    { name: "스킨케어 루틴", score: 87.4, likes: 10200, comments: 1320, views: 68000, saves: 2600, contentType: "리뷰", postedHour: 19 },
    { name: "이니스프리 하울", score: 84.2, likes: 8900, comments: 980, views: 42000, saves: 2100, contentType: "공구", postedHour: 12 },
    { name: "수분크림 비교", score: 81.6, likes: 7600, comments: 850, views: 35000, saves: 1700, contentType: "리뷰", postedHour: 21 },
    { name: "그린티 라인 전체 리뷰", score: 78.9, likes: 6800, comments: 720, views: 28000, saves: 1400, contentType: "리뷰", postedHour: 18 },
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

// CJ data (mock) - 성과 상위 캠페인 TOP 5 (고도화)
const mockCjTopCampaigns = [
  { rank: 1, name: "올리브영 봄 신상 공구", brand: "올리브영", revenue: 234000000, orders: 6720 },
  { rank: 2, name: "CJ제일제당 비비고 봄", brand: "CJ제일제당", revenue: 189000000, orders: 5400 },
  { rank: 3, name: "무신사 봄 컬렉션", brand: "무신사", revenue: 156000000, orders: 4460 },
  { rank: 4, name: "이니스프리 그린티", brand: "이니스프리", revenue: 128000000, orders: 3660 },
  { rank: 5, name: "LG전자 스타일러", brand: "LG전자", revenue: 98000000, orders: 1240 },
];

// 캠페인 구매 고객의 리워드 링크 구매 상위 상품
const mockRewardLinkPurchases = [
  { product: "그린티 시드 세럼", purchases: 342, purchaseRate: 18.5 },
  { product: "비비고 왕교자 1kg", purchases: 256, purchaseRate: 14.2 },
  { product: "비타C 토너패드 70매", purchases: 198, purchaseRate: 11.0 },
  { product: "히알루론 크림 50ml", purchases: 167, purchaseRate: 9.3 },
  { product: "선스크린 SPF50", purchases: 143, purchaseRate: 7.9 },
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

  // 콘텐츠 유형/시간대 패턴 분석
  const typeCounts: Record<string, number> = {};
  const hourCounts: Record<number, number> = {};
  engagementData.forEach((e) => {
    typeCounts[e.contentType] = (typeCounts[e.contentType] || 0) + 1;
    hourCounts[e.postedHour] = (hourCounts[e.postedHour] || 0) + 1;
  });
  const topEngagementType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <>
      <PageHeader
        title="인사이트 리포트 - 캠페인"
        description="캠페인 매출/콘텐츠 성과를 기반으로 구매 고객 행동 패턴과 인사이트를 제공합니다"
        actions={<Badge variant="outline" className="text-xs">O-D-02</Badge>}
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* 에이전시 제외 안내 */}
        <Card className="border-dashed border-blue-200 bg-blue-50/30">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700">
              이 리포트는 <strong>크리에이터 회원 전용</strong>입니다. 에이전시 회원은 이용할 수 없습니다. 캠페인 1회 이상 참여 이력이 있는 크리에이터만 조회 가능합니다.
            </p>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                <Label>캠페인 (완료만)</Label>
                <Select
                  value={selectedCampaign}
                  onValueChange={setSelectedCampaign}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {completedCampaigns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Badge variant="outline" className="text-[10px] h-fit flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  인게이지먼트: 조회 시점 최신 데이터 · 2026-03-23 14:30
                </Badge>
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
              <strong>&quot;{topContentName}&quot;</strong> (참여 점수 <strong>{topContentScore}</strong>)입니다.
            </p>
            <p className="text-sm">
              콘텐츠 유형 중 <strong>{topType}</strong>가 전체의 <strong>{topTypePercent}%</strong>로 가장 효과적이었습니다.
            </p>
            <p className="text-sm">
              선택 기간 평균 참여도는 <strong>{avgEngagement}</strong>점이며, 총 전환 수는{" "}
              <strong>{totalConversions}건</strong>입니다.
            </p>
          </CardContent>
        </Card>

        {/* ═══ 1. 성과 상위 캠페인 TOP 5 ═══ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">성과 상위 캠페인 TOP 5</CardTitle>
            <CardDescription>설정 기간 내 완료 캠페인 중 매출 기준 상위 5개</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3 bg-violet-50/50 text-sm text-violet-800 flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
              <span>[활용 TIP] 매출이 높았던 캠페인의 공통점을 파악해 보세요</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">순위</TableHead>
                  <TableHead>캠페인명</TableHead>
                  <TableHead>브랜드</TableHead>
                  <TableHead className="text-right">매출액</TableHead>
                  <TableHead className="text-right">주문건수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCjTopCampaigns.map((c) => (
                  <TableRow key={c.rank}>
                    <TableCell>
                      <Badge variant="outline" className="text-xs w-6 justify-center">
                        {c.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{c.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.brand}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatKRW(c.revenue)}</TableCell>
                    <TableCell className="text-right text-sm">{c.orders.toLocaleString()}건</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ═══ 2. 고객 리텐션 (핵심 인사이트) ═══ */}
        {(() => {
          const retention = mockRetentionJson.find((r) => r.creatorId === "creator-1");
          if (!retention) return null;
          return (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 text-blue-500" />
                    고객 리텐션 (핵심 인사이트)
                  </CardTitle>
                  <CardDescription>
                    타 크리에이터 비교 없이 오직 &apos;내 고객&apos;에 집중한 재구매 분석
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-md border p-3 bg-blue-50/50 text-sm text-blue-800 flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>[활용 TIP] 리텐션이 높은 캠페인 간 연계 프로모션을 기획하면 전환율을 높일 수 있습니다</span>
                  </div>

                  {/* 캠페인 간 고객 리텐션율 */}
                  <div>
                    <p className="text-sm font-medium mb-3">캠페인 간 고객 리텐션율</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>출발 캠페인</TableHead>
                          <TableHead><ArrowRight className="h-3.5 w-3.5 inline" /></TableHead>
                          <TableHead>도착 캠페인</TableHead>
                          <TableHead className="text-right">리텐션율</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {retention.campaignRetention.map((cr, i) => {
                          const fromName = CAMPAIGNS.find((c) => c.id === cr.fromCampaignId)?.name || cr.fromCampaignId;
                          const toName = CAMPAIGNS.find((c) => c.id === cr.toCampaignId)?.name || cr.toCampaignId;
                          return (
                            <TableRow key={i}>
                              <TableCell className="text-sm">{fromName}</TableCell>
                              <TableCell><ArrowRight className="h-3 w-3 text-muted-foreground" /></TableCell>
                              <TableCell className="text-sm">{toName}</TableCell>
                              <TableCell className="text-right font-medium text-sm">{cr.retentionRate}%</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 캠페인별 재구매 상위 브랜드 */}
                  <div>
                    <p className="text-sm font-medium mb-3">캠페인별 재구매 상위 브랜드</p>
                    <div className="space-y-2">
                      {retention.topRepurchaseBrands.map((b) => (
                        <div key={b.brand} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{b.brand}</span>
                            <span className="font-medium">{b.repurchaseRate}%</span>
                          </div>
                          <Progress value={b.repurchaseRate} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 캠페인 구매 고객의 리워드 링크 구매 상위 상품 (NEW) */}
                  <div>
                    <p className="text-sm font-medium mb-3">캠페인 구매 고객의 리워드 링크 구매 상위 상품</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>상품명</TableHead>
                          <TableHead className="text-right">구매건수</TableHead>
                          <TableHead className="text-right">구매율</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockRewardLinkPurchases.map((p) => (
                          <TableRow key={p.product}>
                            <TableCell className="text-sm font-medium">{p.product}</TableCell>
                            <TableCell className="text-right text-sm">{p.purchases.toLocaleString()}건</TableCell>
                            <TableCell className="text-right text-sm">{p.purchaseRate}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* ═══ 3. 반복구매 주기 ═══ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">반복구매 주기</CardTitle>
                  <CardDescription>
                    최근 5개 캠페인 판매 상위 상품 기준 반복구매 주기 분석
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border p-3 bg-amber-50/50 text-sm text-amber-800 flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>[활용 TIP] 반복구매 주기에 맞춰 리워드 링크를 노출하면 전환율이 높아집니다</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>상품 카테고리</TableHead>
                        <TableHead className="text-right">평균 재구매 주기</TableHead>
                        <TableHead className="w-48">시각화</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {retention.repurchaseCycle.map((rc) => (
                        <TableRow key={rc.productCategory}>
                          <TableCell className="text-sm font-medium">{rc.productCategory}</TableCell>
                          <TableCell className="text-right text-sm">{rc.avgDays}일</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.min((rc.avgDays / 70) * 100, 100)} className="h-2 flex-1" />
                              <span className="text-xs text-muted-foreground w-10">{rc.avgDays}일</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          );
        })()}

        {/* ═══ 4. 콘텐츠 인게이지먼트 상위 TOP 5 ═══ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">콘텐츠 인게이지먼트 상위 TOP 5</CardTitle>
            <CardDescription>설정 기간 내 캠페인 연관 콘텐츠 중 인게이지먼트 상위 5개 (조회 시점 최신 데이터)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bar Chart */}
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

            {/* 상세 지표 테이블 */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>콘텐츠명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead className="text-right">조회수</TableHead>
                  <TableHead className="text-right">좋아요</TableHead>
                  <TableHead className="text-right">댓글</TableHead>
                  <TableHead className="text-right">저장</TableHead>
                  <TableHead className="text-right">등록 시간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagementData.map((e) => (
                  <TableRow key={e.name}>
                    <TableCell className="text-sm font-medium">{e.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{e.contentType}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">{e.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{e.likes.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{e.comments.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{e.saves.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{e.postedHour}시</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* 패턴 요약 */}
            <p className="text-sm text-muted-foreground">
              성과 높은 콘텐츠 유형: <strong className="text-foreground">{topEngagementType}</strong> · 주요 등록 시간대: <strong className="text-foreground">{peakHour}시</strong>
            </p>
          </CardContent>
        </Card>

        {/* Charts Grid - 콘텐츠 유형별 성과 + 시간대별 트렌드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">시간대별 트렌드</CardTitle>
              <CardDescription>참여도, 클릭, 전환 추이</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={mockTimeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={2} name="참여도" />
                  <Line type="monotone" dataKey="clicks" stroke="#f43f5e" strokeWidth={2} name="클릭" />
                  <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} name="전환" />
                </LineChart>
              </ResponsiveContainer>
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
