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
import { featuringApi } from "@/lib/featuring-api";
import type { Campaign, CampaignMetrics } from "@/types/campaign";
import type { PerformanceTrend } from "@/types/analytics";

function formatNumber(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString("ko-KR");
}

// Mock creator x campaign matrix
const MOCK_MATRIX = [
  { creator: "뷰티하나", campaign1: 85000, campaign2: 42000, campaign3: 0 },
  { creator: "푸디진", campaign1: 0, campaign2: 120000, campaign3: 0 },
  { creator: "패션왕킴", campaign1: 65000, campaign2: 0, campaign3: 95000 },
  { creator: "테크마스터", campaign1: 0, campaign2: 0, campaign3: 78000 },
  { creator: "리빙퀸", campaign1: 0, campaign2: 55000, campaign3: 0 },
];

export default function PerformancePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Campaign-based query
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [trend, setTrend] = useState<PerformanceTrend[]>([]);

  // Period-based query
  const [startDate, setStartDate] = useState("2026-02-01");
  const [endDate, setEndDate] = useState("2026-03-11");

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
    if (!selectedCampaignId) {
      setMetrics(null);
      setTrend([]);
      return;
    }
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

  // Aggregate stats for period view
  const periodMetrics = {
    totalViews: 2450000,
    totalLikes: 185000,
    totalComments: 32000,
    totalShares: 18500,
    totalOrders: 4200,
    totalRevenue: 156000000,
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
      <PageHeader
        title="성과 분석"
        description="캠페인별/기간별 성과를 조회합니다"
      />

      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="campaign">
          <TabsList>
            <TabsTrigger value="campaign">캠페인별 성과</TabsTrigger>
            <TabsTrigger value="period">기간별 성과</TabsTrigger>
          </TabsList>

          {/* Campaign Performance */}
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

            {metrics && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard title="조회수" value={formatNumber(metrics.views)} icon={Eye} />
                  <StatsCard title="좋아요" value={formatNumber(metrics.likes)} icon={Heart} />
                  <StatsCard title="댓글" value={formatNumber(metrics.comments)} icon={MessageSquare} />
                  <StatsCard title="공유" value={formatNumber(metrics.shares)} icon={Share2} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatsCard
                    title="추정 주문수"
                    value={formatNumber(metrics.estimatedOrders)}
                    icon={ShoppingCart}
                  />
                  <StatsCard
                    title="추정 매출"
                    value={`${formatNumber(metrics.estimatedRevenue)}원`}
                    icon={TrendingUp}
                  />
                  <StatsCard
                    title="전환율"
                    value={`${metrics.conversionRate}%`}
                    icon={BarChart3}
                  />
                </div>

                {/* Trend Chart */}
                {trend.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">콘텐츠 트래킹 추이</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" name="조회수" strokeWidth={2} />
                          <Line type="monotone" dataKey="likes" stroke="#f59e0b" name="좋아요" strokeWidth={2} />
                          <Line type="monotone" dataKey="comments" stroke="#10b981" name="댓글" strokeWidth={2} />
                          <Line type="monotone" dataKey="estimatedOrders" stroke="#ef4444" name="추정주문" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Creator x Campaign Matrix */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">크리에이터 x 캠페인 매트릭스</CardTitle>
                    <CardDescription>크리에이터별 캠페인 매출 기여도 (원)</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>크리에이터</TableHead>
                          <TableHead className="text-right">캠페인 A</TableHead>
                          <TableHead className="text-right">캠페인 B</TableHead>
                          <TableHead className="text-right">캠페인 C</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_MATRIX.map((row) => (
                          <TableRow key={row.creator}>
                            <TableCell className="font-medium text-sm">{row.creator}</TableCell>
                            <TableCell className="text-right text-sm">
                              {row.campaign1 > 0 ? `${formatNumber(row.campaign1)}원` : "—"}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {row.campaign2 > 0 ? `${formatNumber(row.campaign2)}원` : "—"}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {row.campaign3 > 0 ? `${formatNumber(row.campaign3)}원` : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Period Performance */}
          <TabsContent value="period" className="space-y-6 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Label className="shrink-0">기간 선택</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                  <span className="text-sm text-muted-foreground">~</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
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
                    <Bar yAxisId="left" dataKey="views" fill="hsl(var(--primary))" name="조회수" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#ef4444" name="주문수" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
