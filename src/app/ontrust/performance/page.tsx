"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  ShoppingCart,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
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
  PieChart,
  Pie,
  Cell,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { featuringApi } from "@/lib/featuring-api";
import type { Campaign, CampaignMetrics } from "@/types/campaign";
import type { PerformanceTrend } from "@/types/analytics";
import mockPerformanceJson from "@/data/mock/performance.json";

type PerfRow = (typeof mockPerformanceJson)[number];

const PIE_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];

function formatNumber(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString("ko-KR");
}

function formatKRW(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

const mockContentDetail: Record<string, {
  id: string; creator: string; type: string; platform: string;
  postedAt: string; likes: number; comments: number; views: number;
  saves: number; shares: number; keywords: string[];
}[]> = {
  "campaign-1": [
    { id: "tc1", creator: "뷰티하나", type: "공구", platform: "instagram", postedAt: "2026-03-01", likes: 12400, comments: 890, views: 45000, saves: 2100, shares: 450, keywords: ["촉촉", "세럼추천"] },
    { id: "tc2", creator: "뷰티하나", type: "리뷰", platform: "youtube", postedAt: "2026-02-28", likes: 15200, comments: 2100, views: 120000, saves: 3400, shares: 890, keywords: ["스킨케어", "봄신상"] },
    { id: "tc3", creator: "스킨케어진", type: "공구", platform: "instagram", postedAt: "2026-03-02", likes: 8900, comments: 670, views: 32000, saves: 1500, shares: 320, keywords: ["올영세일", "데일리"] },
  ],
  "campaign-2": [
    { id: "tc4", creator: "푸디진", type: "공구", platform: "instagram", postedAt: "2026-03-02", likes: 9800, comments: 1230, views: 38000, saves: 1800, shares: 620, keywords: ["비비고만두", "자취꿀팁"] },
    { id: "tc5", creator: "뷰티하나", type: "리뷰", platform: "instagram", postedAt: "2026-03-05", likes: 7600, comments: 980, views: 28000, saves: 1200, shares: 380, keywords: ["맛있다", "간편식"] },
  ],
};

const mockIntegratedTrend = [
  { time: "2/15", engagement: 12000, orders: 120, uploads: 2 },
  { time: "2/18", engagement: 28000, orders: 280, uploads: 3 },
  { time: "2/21", engagement: 45000, orders: 450, uploads: 1 },
  { time: "2/24", engagement: 62000, orders: 580, uploads: 4 },
  { time: "2/27", engagement: 58000, orders: 520, uploads: 2 },
  { time: "3/02", engagement: 72000, orders: 680, uploads: 3 },
  { time: "3/05", engagement: 65000, orders: 620, uploads: 2 },
  { time: "3/08", engagement: 58000, orders: 540, uploads: 1 },
  { time: "3/11", engagement: 48000, orders: 480, uploads: 2 },
];

const MOCK_MATRIX = [
  { creator: "뷰티하나", c1: 8500000, c2: 4200000, c3: 5320000 },
  { creator: "푸디진", c1: 0, c2: 12000000, c3: 0 },
  { creator: "패션왕킴", c1: 6500000, c2: 0, c3: 0 },
  { creator: "스킨케어진", c1: 4200000, c2: 0, c3: 9500000 },
  { creator: "리빙퀸", c1: 0, c2: 5500000, c3: 0 },
];

export default function PerformancePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [trend, setTrend] = useState<PerformanceTrend[]>([]);
  const [startDate, setStartDate] = useState("2026-02-01");
  const [endDate, setEndDate] = useState("2026-03-15");

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

  useEffect(() => {
    if (!selectedCampaignId) { setMetrics(null); setTrend([]); return; }
    async function loadMetrics() {
      const [m, t] = await Promise.all([
        featuringApi.getCampaignMetrics(selectedCampaignId),
        featuringApi.getPerformanceTrend(selectedCampaignId),
      ]);
      setMetrics(m);
      setTrend(t);
    }
    loadMetrics();
  }, [selectedCampaignId]);

  const perfData: PerfRow | undefined = mockPerformanceJson.find(
    (p) => p.campaignId === selectedCampaignId
  );
  const contentRows = mockContentDetail[selectedCampaignId] ?? [];
  const isConfirmed = perfData?.summary.confirmedRevenue != null;
  const genderTotal = perfData
    ? perfData.customerSegment.gender.male + perfData.customerSegment.gender.female
    : 1;

  const periodMetrics = {
    totalViews: 2450000, totalLikes: 185000, totalComments: 32000,
    totalShares: 18500, totalOrders: 4200, totalRevenue: 156000000,
  };
  const periodTrend = [
    { date: "2/1", views: 150000, orders: 320 },
    { date: "2/8", views: 220000, orders: 480 },
    { date: "2/15", views: 310000, orders: 620 },
    { date: "2/22", views: 280000, orders: 550 },
    { date: "3/1", views: 420000, orders: 780 },
    { date: "3/8", views: 380000, orders: 710 },
  ];

  return (
    <>
      <PageHeader title="성과 분석" description="캠페인별/기간별 성과를 조회합니다" />

      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="campaign">
          <TabsList>
            <TabsTrigger value="campaign">캠페인 종합 성과</TabsTrigger>
            <TabsTrigger value="period">캠페인별 성과조회</TabsTrigger>
          </TabsList>

          {/* T-C-01: 캠페인 종합 성과 조회 */}
          <TabsContent value="campaign" className="space-y-6 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Label className="shrink-0">캠페인 선택</Label>
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
              </CardContent>
            </Card>

            {!selectedCampaignId && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                캠페인을 선택하면 성과 지표가 표시됩니다
              </div>
            )}

            {selectedCampaignId && (
              <>
                {/* D+14 확정 매출 배너 */}
                {perfData && (
                  <Card className={isConfirmed ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}>
                    <CardContent className="pt-4 pb-4 flex items-center gap-3">
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-800">D+14 매출 확정</p>
                            <p className="text-xs text-green-600">확정 매출: {formatKRW(perfData.summary.confirmedRevenue!)} (취교반 반영)</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">매출 미확정 (진행중)</p>
                            <p className="text-xs text-amber-600">캠페인 종료 후 D+14 기준 최종 매출이 확정됩니다</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {metrics && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatsCard title="조회수" value={formatNumber(metrics.views)} icon={Eye} />
                      <StatsCard title="좋아요" value={formatNumber(metrics.likes)} icon={Heart} />
                      <StatsCard title="댓글" value={formatNumber(metrics.comments)} icon={MessageSquare} />
                      <StatsCard title="공유" value={formatNumber(metrics.shares)} icon={Share2} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <StatsCard title="추정 주문수" value={formatNumber(metrics.estimatedOrders)} icon={ShoppingCart} />
                      <StatsCard title="추정 매출" value={`${formatNumber(metrics.estimatedRevenue)}원`} icon={TrendingUp} />
                      <StatsCard title="전환율" value={`${metrics.conversionRate}%`} icon={BarChart3} />
                    </div>
                  </>
                )}

                {/* 통합 Summary 차트 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">통합 성과 추이</CardTitle>
                    <CardDescription>콘텐츠 인게이지먼트 + 주문 수량 + 콘텐츠 업로드 통합 그래프</CardDescription>
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

                {/* 콘텐츠 기준 상세 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" /> 콘텐츠 기준 상세
                    </CardTitle>
                    <CardDescription>크리에이터별 콘텐츠 인게이지먼트</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    {contentRows.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>크리에이터</TableHead>
                            <TableHead>게시일</TableHead>
                            <TableHead>유형</TableHead>
                            <TableHead>플랫폼</TableHead>
                            <TableHead className="text-right">조회수</TableHead>
                            <TableHead className="text-right">좋아요</TableHead>
                            <TableHead className="text-right">댓글</TableHead>
                            <TableHead className="text-right">저장</TableHead>
                            <TableHead>키워드</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contentRows.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell className="font-medium text-sm">{c.creator}</TableCell>
                              <TableCell className="text-sm">{c.postedAt}</TableCell>
                              <TableCell><Badge variant="outline" className="text-[10px]">{c.type}</Badge></TableCell>
                              <TableCell className="text-sm capitalize">{c.platform}</TableCell>
                              <TableCell className="text-right text-sm">{c.views.toLocaleString()}</TableCell>
                              <TableCell className="text-right text-sm">{c.likes.toLocaleString()}</TableCell>
                              <TableCell className="text-right text-sm">{c.comments.toLocaleString()}</TableCell>
                              <TableCell className="text-right text-sm">{c.saves.toLocaleString()}</TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  {c.keywords.map((kw) => (
                                    <Badge key={kw} variant="secondary" className="text-[10px]">{kw}</Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">콘텐츠 상세 데이터가 없습니다</p>
                    )}
                  </CardContent>
                </Card>

                {/* 매출 기준 상세 */}
                {perfData && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">시간별 주문/매출 현황</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
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

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-4 w-4" /> 주문 고객 연령 분포
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={perfData.customerSegment.ageGroups} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" tick={{ fontSize: 11 }} />
                              <YAxis dataKey="range" type="category" tick={{ fontSize: 11 }} width={50} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#6366f1" name="고객수" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">성별 분포</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "여성", value: perfData.customerSegment.gender.female },
                                  { name: "남성", value: perfData.customerSegment.gender.male },
                                ]}
                                cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                                paddingAngle={4} dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell fill="#f43f5e" />
                                <Cell fill="#6366f1" />
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">함께 구매한 상품 Top 10</CardTitle>
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
                              const max = perfData.topProducts[0]?.orders ?? 1;
                              return (
                                <TableRow key={p.productId}>
                                  <TableCell className="font-medium">{i + 1}</TableCell>
                                  <TableCell className="text-sm">{p.name}</TableCell>
                                  <TableCell className="text-right text-sm">{p.orders.toLocaleString()}</TableCell>
                                  <TableCell><Progress value={(p.orders / max) * 100} className="h-2" /></TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          취소/교환/반품 현황 ({perfData.cancelReturnRate}%)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>사유</TableHead>
                                <TableHead className="text-right">건수</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {perfData.cancelReasons.map((cr) => (
                                <TableRow key={cr.reason}>
                                  <TableCell className="text-sm">{cr.reason}</TableCell>
                                  <TableCell className="text-right text-sm">{cr.count}건</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                              <Pie
                                data={perfData.cancelReasons.map((cr) => ({ name: cr.reason, value: cr.count }))}
                                cx="50%" cy="50%" outerRadius={65} dataKey="value"
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
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* 크리에이터 x 캠페인 매트릭스 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">크리에이터 × 캠페인 매트릭스</CardTitle>
                    <CardDescription>크리에이터별 캠페인 매출 기여도</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>크리에이터</TableHead>
                          <TableHead className="text-right">올리브영 봄 신상</TableHead>
                          <TableHead className="text-right">비비고 봄 캠페인</TableHead>
                          <TableHead className="text-right">그린티 라인</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_MATRIX.map((row) => (
                          <TableRow key={row.creator}>
                            <TableCell className="font-medium text-sm">{row.creator}</TableCell>
                            <TableCell className="text-right text-sm">{row.c1 > 0 ? formatKRW(row.c1) : "—"}</TableCell>
                            <TableCell className="text-right text-sm">{row.c2 > 0 ? formatKRW(row.c2) : "—"}</TableCell>
                            <TableCell className="text-right text-sm">{row.c3 > 0 ? formatKRW(row.c3) : "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* T-C-02: 기간별 성과 조회 */}
          <TabsContent value="period" className="space-y-6 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Label className="shrink-0">기간 선택</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
                  <span className="text-sm text-muted-foreground">~</span>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatsCard title="총 조회수" value={formatNumber(periodMetrics.totalViews)} icon={Eye} />
              <StatsCard title="총 좋아요" value={formatNumber(periodMetrics.totalLikes)} icon={Heart} />
              <StatsCard title="총 댓글" value={formatNumber(periodMetrics.totalComments)} icon={MessageSquare} />
              <StatsCard title="총 공유" value={formatNumber(periodMetrics.totalShares)} icon={Share2} />
              <StatsCard title="총 주문수" value={formatNumber(periodMetrics.totalOrders)} icon={ShoppingCart} />
              <StatsCard title="총 매출" value={`${formatNumber(periodMetrics.totalRevenue)}원`} icon={TrendingUp} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">기간 내 캠페인 집계 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={periodTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="views" fill="hsl(var(--primary))" name="조회수" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#ef4444" name="주문수" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">크리에이터 × 캠페인 매트릭스</CardTitle>
                <CardDescription>크리에이터별 캠페인 매출 기여도</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>크리에이터</TableHead>
                      <TableHead className="text-right">올리브영 봄 신상</TableHead>
                      <TableHead className="text-right">비비고 봄 캠페인</TableHead>
                      <TableHead className="text-right">그린티 라인</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_MATRIX.map((row) => (
                      <TableRow key={row.creator}>
                        <TableCell className="font-medium text-sm">{row.creator}</TableCell>
                        <TableCell className="text-right text-sm">{row.c1 > 0 ? formatKRW(row.c1) : "—"}</TableCell>
                        <TableCell className="text-right text-sm">{row.c2 > 0 ? formatKRW(row.c2) : "—"}</TableCell>
                        <TableCell className="text-right text-sm">{row.c3 > 0 ? formatKRW(row.c3) : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
