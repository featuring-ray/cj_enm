"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  MousePointerClick,
  TrendingUp,
  FileText,
  Link2,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import mockPerformanceJson from "@/data/mock/performance.json";

type PerformanceData = (typeof mockPerformanceJson)[number];

const CAMPAIGNS = [
  { id: "campaign-1", name: "올리브영 봄 신상 공구", status: "진행중" },
  { id: "campaign-2", name: "CJ제일제당 비비고 봄 캠페인", status: "진행중" },
  { id: "campaign-4", name: "이니스프리 그린티 라인 완료", status: "완료" },
];

const mockContentPerformance = [
  {
    id: "c1", campaign: "올리브영 봄 신상 공구", campaignId: "campaign-1",
    type: "공구" as const, platform: "instagram",
    likes: 12400, comments: 890, saves: 2100, shares: 450, views: 45000,
    clicks: 3200, conversions: 128, revenue: 4480000, postedAt: "2026-03-01",
    keywords: ["촉촉", "데일리", "세럼추천", "올영세일"],
  },
  {
    id: "c2", campaign: "CJ제일제당 비비고 봄 캠페인", campaignId: "campaign-2",
    type: "공구" as const, platform: "instagram",
    likes: 9800, comments: 1230, saves: 1800, shares: 620, views: 38000,
    clicks: 2800, conversions: 95, revenue: 3325000, postedAt: "2026-03-02",
    keywords: ["맛있다", "간편식", "비비고만두", "자취꿀팁"],
  },
  {
    id: "c3", campaign: "올리브영 봄 신상 공구", campaignId: "campaign-1",
    type: "리뷰" as const, platform: "youtube",
    likes: 15200, comments: 2100, saves: 3400, shares: 890, views: 120000,
    clicks: 5100, conversions: 204, revenue: 7140000, postedAt: "2026-02-28",
    keywords: ["리뷰", "스킨케어", "봄신상", "추천"],
  },
  {
    id: "c4", campaign: "이니스프리 그린티 라인 완료", campaignId: "campaign-4",
    type: "공구" as const, platform: "instagram",
    likes: 10800, comments: 1120, saves: 2400, shares: 520, views: 52000,
    clicks: 3800, conversions: 152, revenue: 5320000, postedAt: "2026-01-15",
    keywords: ["그린티", "보습", "이니스프리", "겨울스킨케어"],
  },
];

const mockRewardLinks = [
  { id: "rl1", campaign: "올리브영 봄 신상 공구", link: "https://link.ontner.com/abc123", clicks: 8100, conversions: 332, revenue: 11620000 },
  { id: "rl2", campaign: "CJ제일제당 비비고 봄 캠페인", link: "https://link.ontner.com/def456", clicks: 2800, conversions: 95, revenue: 3325000 },
  { id: "rl3", campaign: "이니스프리 그린티 라인 완료", link: "https://link.ontner.com/ghi789", clicks: 3800, conversions: 152, revenue: 5320000 },
];

/* 통합 Summary 차트용 시간별 데이터 */
const mockIntegratedTrend = [
  { time: "09시", engagement: 1200, orders: 45, uploads: 0 },
  { time: "10시", engagement: 2800, orders: 78, uploads: 1 },
  { time: "11시", engagement: 4500, orders: 112, uploads: 0 },
  { time: "12시", engagement: 6200, orders: 156, uploads: 2 },
  { time: "13시", engagement: 5800, orders: 134, uploads: 0 },
  { time: "14시", engagement: 4200, orders: 98, uploads: 0 },
  { time: "15시", engagement: 3800, orders: 87, uploads: 0 },
  { time: "16시", engagement: 3200, orders: 76, uploads: 1 },
  { time: "17시", engagement: 2900, orders: 65, uploads: 0 },
  { time: "18시", engagement: 4800, orders: 89, uploads: 0 },
  { time: "19시", engagement: 6500, orders: 120, uploads: 0 },
  { time: "20시", engagement: 7200, orders: 145, uploads: 1 },
  { time: "21시", engagement: 5800, orders: 132, uploads: 0 },
  { time: "22시", engagement: 2100, orders: 43, uploads: 0 },
];

const PIE_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];

function formatKRW(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

export default function PerformancePage() {
  const [selectedCampaign, setSelectedCampaign] = useState("campaign-1");

  const campaignInfo = CAMPAIGNS.find((c) => c.id === selectedCampaign);
  const perfData: PerformanceData | undefined = mockPerformanceJson.find(
    (p) => p.campaignId === selectedCampaign
  );

  const filteredContent = mockContentPerformance.filter(
    (c) => c.campaignId === selectedCampaign
  );

  const filteredRewardLinks = mockRewardLinks.filter(
    (rl) => rl.campaign === campaignInfo?.name
  );

  const totalRevenue = filteredContent.reduce((s, c) => s + c.revenue, 0);
  const totalClicks = filteredContent.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = filteredContent.reduce((s, c) => s + c.conversions, 0);
  const conversionRate =
    totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0";

  const isConfirmed = perfData?.summary.confirmedRevenue != null;
  const genderTotal = perfData
    ? perfData.customerSegment.gender.male + perfData.customerSegment.gender.female
    : 1;

  const allKeywords = filteredContent.flatMap((c) => c.keywords);
  const keywordCounts = allKeywords.reduce<Record<string, number>>((acc, kw) => {
    acc[kw] = (acc[kw] || 0) + 1;
    return acc;
  }, {});
  const sortedKeywords = Object.entries(keywordCounts).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PageHeader
        title="캠페인별 성과 조회"
        description="캠페인별 콘텐츠 성과 및 매출 현황을 확인하세요"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* 캠페인 선택 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label className="shrink-0">캠페인 선택</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="max-w-md">
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
              {campaignInfo && (
                <Badge
                  variant="outline"
                  className={
                    campaignInfo.status === "완료"
                      ? "bg-gray-50 text-gray-600"
                      : "bg-blue-50 text-blue-700"
                  }
                >
                  {campaignInfo.status}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* D+14 확정 매출 상태 */}
        {perfData && (
          <Card className={isConfirmed ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              {isConfirmed ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">D+14 매출 확정</p>
                    <p className="text-xs text-green-600">
                      확정 매출: {formatKRW(perfData.summary.confirmedRevenue!)} (취교반 반영)
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">매출 미확정 (진행중)</p>
                    <p className="text-xs text-amber-600">
                      캠페인 종료 후 D+14 기준으로 취소/교환/반품이 반영된 최종 매출이 확정됩니다
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="총 매출"
            value={formatKRW(perfData?.summary.totalRevenue ?? totalRevenue)}
            description={isConfirmed ? "확정 매출" : "미확정 (예상)"}
            icon={DollarSign}
            trend={{ value: "+12%", positive: true }}
          />
          <StatsCard
            title="총 주문"
            value={`${(perfData?.summary.totalOrders ?? totalConversions).toLocaleString()}건`}
            description="선택 캠페인 합산"
            icon={ShoppingCart}
            trend={{ value: "+8%", positive: true }}
          />
          <StatsCard
            title="전환율"
            value={`${perfData?.summary.conversionRate ?? conversionRate}%`}
            description="클릭 대비 구매"
            icon={TrendingUp}
            trend={{ value: "+0.3%p", positive: true }}
          />
          <StatsCard
            title="콘텐츠"
            value={`${perfData?.summary.contentCount ?? filteredContent.length}건`}
            description="캠페인 관련 게시"
            icon={FileText}
          />
        </div>

        {/* PART 1: 통합 Summary 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">통합 성과 추이</CardTitle>
            <CardDescription>
              콘텐츠 업로드 · 인게이지먼트 · 주문 수량을 하나의 그래프로 확인
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={mockIntegratedTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="engagement" stroke="#6366f1" name="인게이지먼트" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f43f5e" name="주문수" strokeWidth={2} />
                <Line yAxisId="right" type="step" dataKey="uploads" stroke="#10b981" name="콘텐츠 업로드" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">콘텐츠 기준 상세</TabsTrigger>
            <TabsTrigger value="sales">매출 기준 상세</TabsTrigger>
          </TabsList>

          {/* PART 2: 콘텐츠 기준 상세 */}
          <TabsContent value="content" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">콘텐츠 인게이지먼트 현황</CardTitle>
                <CardDescription>콘텐츠별 참여 지표 및 매출</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>게시일</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>플랫폼</TableHead>
                      <TableHead className="text-right">조회수</TableHead>
                      <TableHead className="text-right">좋아요</TableHead>
                      <TableHead className="text-right">댓글</TableHead>
                      <TableHead className="text-right">저장</TableHead>
                      <TableHead className="text-right">공유</TableHead>
                      <TableHead className="text-right">매출</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="text-sm">{c.postedAt}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm capitalize">{c.platform}</TableCell>
                        <TableCell className="text-right text-sm">{c.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.likes.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.comments.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.saves.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.shares.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{formatKRW(c.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 주요 반응 키워드 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">주요 반응 키워드</CardTitle>
                <CardDescription>댓글에서 추출한 주요 키워드</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sortedKeywords.map(([kw, count], i) => (
                    <Badge
                      key={kw}
                      variant={i < 3 ? "default" : "secondary"}
                      className="text-sm px-3 py-1"
                    >
                      {kw}
                      <span className="ml-1.5 text-xs opacity-70">{count}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 리워드 링크 성과 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  리워드 링크 성과
                </CardTitle>
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
                        <TableCell className="text-sm font-medium max-w-[180px] truncate">{rl.campaign}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{rl.link}</TableCell>
                        <TableCell className="text-right text-sm">{rl.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{rl.conversions.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{formatKRW(rl.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PART 3: 매출 기준 상세 */}
          <TabsContent value="sales" className="space-y-6 mt-4">
            {perfData ? (
              <>
                {/* 시간별 주문/매출 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">시간별 주문/매출 현황</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={perfData.hourlyOrders}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number, name: string) =>
                          name === "매출" ? formatKRW(value) : value.toLocaleString()
                        } />
                        <Legend />
                        <Bar yAxisId="left" dataKey="orders" fill="#6366f1" name="주문수" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f43f5e" name="매출" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* 고객 세그먼트 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        주문 고객 연령 분포
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={perfData.customerSegment.ageGroups} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis dataKey="range" type="category" tick={{ fontSize: 11 }} width={50} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#6366f1" name="주문 고객수" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">주문 고객 성별 분포</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "여성", value: perfData.customerSegment.gender.female },
                              { name: "남성", value: perfData.customerSegment.gender.male },
                            ]}
                            cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                            paddingAngle={4} dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#f43f5e" />
                            <Cell fill="#6366f1" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-6 text-sm mt-2">
                        <span>여성 {((perfData.customerSegment.gender.female / genderTotal) * 100).toFixed(0)}%</span>
                        <span>남성 {((perfData.customerSegment.gender.male / genderTotal) * 100).toFixed(0)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 함께 구매한 상품 Top 10 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">함께 구매한 상품 Top {Math.min(perfData.topProducts.length, 10)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">순위</TableHead>
                          <TableHead>상품명</TableHead>
                          <TableHead className="text-right">주문수</TableHead>
                          <TableHead className="w-40">비율</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {perfData.topProducts.slice(0, 10).map((p, i) => {
                          const maxOrders = perfData.topProducts[0]?.orders ?? 1;
                          return (
                            <TableRow key={p.productId}>
                              <TableCell className="font-medium">{i + 1}</TableCell>
                              <TableCell className="text-sm">{p.name}</TableCell>
                              <TableCell className="text-right text-sm">{p.orders.toLocaleString()}</TableCell>
                              <TableCell>
                                <Progress value={(p.orders / maxOrders) * 100} className="h-2" />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* 취소/교환/반품 현황 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      취소/교환/반품 현황
                    </CardTitle>
                    <CardDescription>
                      취교반율: {perfData.cancelReturnRate}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium mb-3">사유별 현황</p>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>사유</TableHead>
                              <TableHead className="text-right">건수</TableHead>
                              <TableHead className="w-32">비율</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {perfData.cancelReasons.map((cr) => {
                              const totalCancels = perfData.cancelReasons.reduce((s, r) => s + r.count, 0);
                              return (
                                <TableRow key={cr.reason}>
                                  <TableCell className="text-sm">{cr.reason}</TableCell>
                                  <TableCell className="text-right text-sm">{cr.count}건</TableCell>
                                  <TableCell>
                                    <Progress value={(cr.count / totalCancels) * 100} className="h-2" />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      <div>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={perfData.cancelReasons.map((cr) => ({
                                name: cr.reason,
                                value: cr.count,
                              }))}
                              cx="50%" cy="50%" outerRadius={70}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {perfData.cancelReasons.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-16 text-muted-foreground text-sm">
                해당 캠페인의 매출 상세 데이터가 없습니다
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
