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
  Image,
  Shield,
} from "lucide-react";
import {
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceDot,
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

/* ─── Mock: 콘텐츠 기준 상세 (업로드일시|유형|썸네일|좋아요|댓글|조회수|연관도|키워드) ─── */
const mockContentDetail: Record<string, {
  id: string; creator: string; contentType: string; platform: string;
  postedAt: string; likes: number; comments: number; views: number;
  saves: number; shares: number; keywords: string[];
  thumbnail: string; relevance: number;
}[]> = {
  "campaign-1": [
    { id: "tc1", creator: "뷰티하나", contentType: "릴스", platform: "instagram", postedAt: "2026-03-01 14:30", likes: 12400, comments: 890, views: 45000, saves: 2100, shares: 450, keywords: ["촉촉", "세럼추천"], thumbnail: "/placeholder-thumb.png", relevance: 95 },
    { id: "tc2", creator: "뷰티하나", contentType: "롱폼", platform: "youtube", postedAt: "2026-02-28 10:15", likes: 15200, comments: 2100, views: 120000, saves: 3400, shares: 890, keywords: ["스킨케어", "봄신상"], thumbnail: "/placeholder-thumb.png", relevance: 88 },
    { id: "tc3", creator: "스킨케어진", contentType: "피드", platform: "instagram", postedAt: "2026-03-02 18:00", likes: 8900, comments: 670, views: 32000, saves: 1500, shares: 320, keywords: ["올영세일", "데일리"], thumbnail: "/placeholder-thumb.png", relevance: 72 },
    { id: "tc6", creator: "뷰티하나", contentType: "숏폼", platform: "youtube", postedAt: "2026-03-04 09:45", likes: 18500, comments: 1560, views: 85000, saves: 2800, shares: 720, keywords: ["봄메이크업", "톤업"], thumbnail: "/placeholder-thumb.png", relevance: 91 },
    { id: "tc7", creator: "스킨케어진", contentType: "릴스", platform: "instagram", postedAt: "2026-03-06 20:10", likes: 6700, comments: 430, views: 24000, saves: 980, shares: 210, keywords: ["수분크림", "겨울끝"], thumbnail: "/placeholder-thumb.png", relevance: 65 },
  ],
  "campaign-2": [
    { id: "tc4", creator: "푸디진", contentType: "릴스", platform: "instagram", postedAt: "2026-03-02 12:00", likes: 9800, comments: 1230, views: 38000, saves: 1800, shares: 620, keywords: ["비비고만두", "자취꿀팁"], thumbnail: "/placeholder-thumb.png", relevance: 97 },
    { id: "tc5", creator: "뷰티하나", contentType: "피드", platform: "instagram", postedAt: "2026-03-05 16:30", likes: 7600, comments: 980, views: 28000, saves: 1200, shares: 380, keywords: ["맛있다", "간편식"], thumbnail: "/placeholder-thumb.png", relevance: 82 },
  ],
};

/* ─── Mock: 통합 Summary 복합 차트 데이터 (일별) ─── */
const mockDailyTrend = [
  { time: "2/15", likes: 3200, comments: 420, views: 8400, orders: 120, revenue: 4800000, uploads: 2 },
  { time: "2/18", likes: 7500, comments: 980, views: 19500, orders: 280, revenue: 11200000, uploads: 3 },
  { time: "2/21", likes: 12000, comments: 1500, views: 31500, orders: 450, revenue: 18000000, uploads: 1 },
  { time: "2/24", likes: 16800, comments: 2100, views: 43100, orders: 580, revenue: 23200000, uploads: 4 },
  { time: "2/27", likes: 15500, comments: 1900, views: 40600, orders: 520, revenue: 20800000, uploads: 2 },
  { time: "3/02", likes: 19200, comments: 2400, views: 50400, orders: 680, revenue: 27200000, uploads: 3 },
  { time: "3/05", likes: 17500, comments: 2200, views: 45300, orders: 620, revenue: 24800000, uploads: 2 },
  { time: "3/08", likes: 15200, comments: 1850, views: 40950, orders: 540, revenue: 21600000, uploads: 1 },
  { time: "3/11", likes: 12800, comments: 1550, views: 33650, orders: 480, revenue: 19200000, uploads: 2 },
];

/* ─── Mock: 통합 Summary 복합 차트 데이터 (시간별) ─── */
const mockHourlyTrend = [
  { time: "09시", likes: 1200, comments: 150, views: 3100, orders: 42, revenue: 1680000, uploads: 1 },
  { time: "10시", likes: 1800, comments: 220, views: 4600, orders: 65, revenue: 2600000, uploads: 0 },
  { time: "11시", likes: 2400, comments: 310, views: 6200, orders: 88, revenue: 3520000, uploads: 0 },
  { time: "12시", likes: 3500, comments: 450, views: 9100, orders: 125, revenue: 5000000, uploads: 1 },
  { time: "13시", likes: 3200, comments: 400, views: 8300, orders: 110, revenue: 4400000, uploads: 0 },
  { time: "14시", likes: 2800, comments: 350, views: 7200, orders: 95, revenue: 3800000, uploads: 0 },
  { time: "15시", likes: 2500, comments: 320, views: 6500, orders: 82, revenue: 3280000, uploads: 0 },
  { time: "16시", likes: 2100, comments: 270, views: 5500, orders: 70, revenue: 2800000, uploads: 0 },
  { time: "17시", likes: 1900, comments: 240, views: 4900, orders: 58, revenue: 2320000, uploads: 0 },
  { time: "18시", likes: 2600, comments: 330, views: 6800, orders: 90, revenue: 3600000, uploads: 1 },
  { time: "19시", likes: 3100, comments: 400, views: 8100, orders: 112, revenue: 4480000, uploads: 0 },
  { time: "20시", likes: 3800, comments: 490, views: 9900, orders: 138, revenue: 5520000, uploads: 0 },
  { time: "21시", likes: 4200, comments: 540, views: 10900, orders: 155, revenue: 6200000, uploads: 0 },
  { time: "22시", likes: 3500, comments: 440, views: 9000, orders: 120, revenue: 4800000, uploads: 0 },
  { time: "23시", likes: 2200, comments: 280, views: 5700, orders: 68, revenue: 2720000, uploads: 0 },
];

/* ─── Mock: 시간별 주문 (옵션별 stacked) ─── */
const mockHourlyOrdersByOption = [
  { hour: "09시", total: 42, optionA: 25, optionB: 12, optionC: 5, revenue: 1680000 },
  { hour: "10시", total: 65, optionA: 38, optionB: 18, optionC: 9, revenue: 2600000 },
  { hour: "11시", total: 88, optionA: 52, optionB: 24, optionC: 12, revenue: 3520000 },
  { hour: "12시", total: 125, optionA: 72, optionB: 35, optionC: 18, revenue: 5000000 },
  { hour: "13시", total: 110, optionA: 64, optionB: 31, optionC: 15, revenue: 4400000 },
  { hour: "14시", total: 95, optionA: 55, optionB: 27, optionC: 13, revenue: 3800000 },
  { hour: "15시", total: 82, optionA: 48, optionB: 23, optionC: 11, revenue: 3280000 },
  { hour: "16시", total: 70, optionA: 41, optionB: 20, optionC: 9, revenue: 2800000 },
  { hour: "17시", total: 58, optionA: 34, optionB: 16, optionC: 8, revenue: 2320000 },
  { hour: "18시", total: 90, optionA: 52, optionB: 26, optionC: 12, revenue: 3600000 },
  { hour: "19시", total: 112, optionA: 65, optionB: 32, optionC: 15, revenue: 4480000 },
  { hour: "20시", total: 138, optionA: 80, optionB: 39, optionC: 19, revenue: 5520000 },
  { hour: "21시", total: 155, optionA: 90, optionB: 44, optionC: 21, revenue: 6200000 },
  { hour: "22시", total: 120, optionA: 70, optionB: 34, optionC: 16, revenue: 4800000 },
  { hour: "23시", total: 68, optionA: 40, optionB: 19, optionC: 9, revenue: 2720000 },
];

/* ─── Mock: 취소/교환/반품 분리 현황 ─── */
const mockCancelExchangeReturn = {
  summary: { cancelCount: 45, exchangeCount: 18, returnCount: 27, totalOrders: 1200, rate: 7.5 },
  cancelReasons: [
    { reason: "단순 변심", count: 28, type: "취소" as const },
    { reason: "상품 불량/파손", count: 12, type: "반품" as const },
    { reason: "사이즈 교환", count: 14, type: "교환" as const },
    { reason: "배송 지연", count: 8, type: "취소" as const },
    { reason: "색상 교환", count: 4, type: "교환" as const },
    { reason: "오배송", count: 9, type: "취소" as const },
    { reason: "상품 품질 불만", count: 6, type: "반품" as const },
    { reason: "기타", count: 9, type: "반품" as const },
  ],
};

/* ─── Mock: 크리에이터 목록 (캠페인별) ─── */
const mockCampaignCreators: Record<string, { id: string; name: string }[]> = {
  "campaign-1": [
    { id: "creator-1", name: "뷰티하나" },
    { id: "creator-3", name: "스킨케어진" },
  ],
  "campaign-2": [
    { id: "creator-2", name: "푸디진" },
    { id: "creator-1", name: "뷰티하나" },
  ],
  "campaign-3": [
    { id: "creator-4", name: "패션왕킴" },
    { id: "creator-5", name: "리빙퀸" },
  ],
};

/* ─── Mock: MD 팀 기반 캠페인 필터 ─── */
const MD_TEAM_CAMPAIGNS = ["campaign-1", "campaign-2"];

export default function PerformancePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [trend, setTrend] = useState<PerformanceTrend[]>([]);
  const [userRole, setUserRole] = useState<"md" | "admin">("admin");
  const [creatorFilter, setCreatorFilter] = useState<"all" | string>("all");
  const [timeGranularity, setTimeGranularity] = useState<"daily" | "hourly">("daily");

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

  // 권한 기반 캠페인 필터링
  const filteredCampaigns = userRole === "md"
    ? campaigns.filter(c => MD_TEAM_CAMPAIGNS.includes(c.id))
    : campaigns;

  const perfData: PerfRow | undefined = mockPerformanceJson.find(
    (p) => p.campaignId === selectedCampaignId
  );

  // 크리에이터 필터 적용한 콘텐츠
  const allContentRows = mockContentDetail[selectedCampaignId] ?? [];
  const contentRows = creatorFilter === "all"
    ? allContentRows
    : allContentRows.filter(c => c.creator === mockCampaignCreators[selectedCampaignId]?.find(cr => cr.id === creatorFilter)?.name);

  const isConfirmed = perfData?.summary.confirmedRevenue != null;
  const campaignCreators = mockCampaignCreators[selectedCampaignId] ?? [];

  // 복합 차트 데이터
  const trendData = timeGranularity === "daily" ? mockDailyTrend : mockHourlyTrend;
  const uploadMarkers = trendData.filter(d => d.uploads > 0);

  return (
    <>
      <PageHeader title="캠페인별 성과 조회" description="캠페인의 콘텐츠 반응도와 매출 간 상관관계를 심층 분석합니다" />

      <main className="flex-1 p-4 space-y-6">
        {/* 검색 패널: 권한 + 캠페인 선택 + 크리에이터 필터 */}
        <div className="otr-search-panel">
          <div className="space-y-3">
            {/* 권한 토글 */}
            <div className="flex items-center gap-4">
              <Label className="shrink-0 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> 조회 권한
              </Label>
              <div className="flex gap-1">
                <button
                  onClick={() => { setUserRole("md"); setSelectedCampaignId(""); }}
                  className={`px-3 py-1 text-xs border ${userRole === "md" ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white text-gray-600 border-gray-300"}`}
                >
                  MD (본인 팀)
                </button>
                <button
                  onClick={() => { setUserRole("admin"); setSelectedCampaignId(""); }}
                  className={`px-3 py-1 text-xs border ${userRole === "admin" ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white text-gray-600 border-gray-300"}`}
                >
                  운영관리자 (전체)
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                {userRole === "md" ? "MD코드 기반 본인 팀원 등록 캠페인만 조회" : "전체 캠페인 조회 가능"}
              </span>
            </div>

            {/* 캠페인 선택 */}
            <div className="flex items-center gap-4">
              <Label className="shrink-0">캠페인 선택</Label>
              <Select value={selectedCampaignId} onValueChange={(v) => { setSelectedCampaignId(v); setCreatorFilter("all"); }}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="캠페인을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCampaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title} ({c.brandName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 크리에이터 필터 */}
            {selectedCampaignId && campaignCreators.length > 0 && (
              <div className="flex items-center gap-4">
                <Label className="shrink-0">크리에이터 조회</Label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCreatorFilter("all")}
                    className={`px-3 py-1 text-xs border ${creatorFilter === "all" ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white text-gray-600 border-gray-300"}`}
                  >
                    전체 종합
                  </button>
                  {campaignCreators.map(cr => (
                    <button
                      key={cr.id}
                      onClick={() => setCreatorFilter(cr.id)}
                      className={`px-3 py-1 text-xs border ${creatorFilter === cr.id ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white text-gray-600 border-gray-300"}`}
                    >
                      {cr.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {!selectedCampaignId && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            캠페인을 선택하면 성과 지표가 표시됩니다
          </div>
        )}

        {selectedCampaignId && (
          <>
            {/* D+14 확정 매출 배너 */}
            {perfData && (
              <Card className={isConfirmed ? "border-green-200 bg-green-50/30 rounded-none" : "border-amber-200 bg-amber-50/30 rounded-none"}>
                <CardContent className="pt-4 pb-4 flex items-center gap-3">
                  {isConfirmed ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">D+14 매출 확정</p>
                        <p className="text-xs text-green-600">확정 매출: {formatKRW(perfData.summary.confirmedRevenue!)} (취교반 반영)</p>
                      </div>
                      <Badge className="ml-auto bg-green-600 text-white text-[10px]">확정</Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">매출 미확정</p>
                        <p className="text-xs text-amber-600">캠페인 종료 후 D+14 기준 최종 매출이 확정됩니다</p>
                      </div>
                      <Badge className="ml-auto bg-amber-500 text-white text-[10px]">정산 대기 (D+8)</Badge>
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

            {/* ─── 파트 1: 통합 Summary (복합 차트: Bar + Line) ─── */}
            <Card className="rounded-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base otr-section-marker">◆ 통합 성과 추이</CardTitle>
                    <CardDescription>콘텐츠 인게이지먼트(Bar) + 주문/매출(Line) + 콘텐츠 업로드 시점(마커) 통합 그래프</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setTimeGranularity("daily")}
                      className={`px-3 py-1 text-xs border ${timeGranularity === "daily" ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white text-gray-600 border-gray-300"}`}
                    >
                      일별
                    </button>
                    <button
                      onClick={() => setTimeGranularity("hourly")}
                      className={`px-3 py-1 text-xs border ${timeGranularity === "hourly" ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white text-gray-600 border-gray-300"}`}
                    >
                      시간별
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={360}>
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: "인게이지먼트", angle: -90, position: "insideLeft", style: { fontSize: 10 } }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: "주문수 / 매출", angle: 90, position: "insideRight", style: { fontSize: 10 } }} />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === "매출") return formatKRW(value);
                        return value.toLocaleString();
                      }}
                    />
                    <Legend />
                    {/* 인게이지먼트: stacked bar */}
                    <Bar yAxisId="left" dataKey="views" stackId="eng" fill="#c4b5fd" name="조회수" radius={[0, 0, 0, 0]} />
                    <Bar yAxisId="left" dataKey="likes" stackId="eng" fill="#8b5cf6" name="좋아요" radius={[0, 0, 0, 0]} />
                    <Bar yAxisId="left" dataKey="comments" stackId="eng" fill="#6d28d9" name="댓글" radius={[0, 0, 0, 0]} />
                    {/* 주문/매출: line */}
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f43f5e" name="주문수" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" name="매출" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
                    {/* 업로드 마커 */}
                    {uploadMarkers.map((d, i) => (
                      <ReferenceDot key={i} yAxisId="left" x={d.time} y={d.views + d.likes + d.comments} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />
                    ))}
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground justify-center">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#10b981] inline-block" /> 콘텐츠 업로드 시점</span>
                </div>
              </CardContent>
            </Card>

            {/* ─── 파트 2: 콘텐츠 기준 상세 ─── */}
            <div>
              <div className="mb-3">
                <h3 className="text-base font-semibold otr-section-marker flex items-center gap-2">
                  <FileText className="h-4 w-4" /> ◆ 콘텐츠 기준 상세 (피처링 데이터)
                </h3>
                <p className="text-sm text-muted-foreground">
                  캠페인 기간 내 크리에이터 계정 콘텐츠 | 업로드일시 · 유형 · 인게이지먼트 · 연관도 · 키워드
                </p>
              </div>
              <div className="overflow-x-auto">
                {contentRows.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>업로드일시</TableHead>
                        <TableHead>콘텐츠유형</TableHead>
                        <TableHead className="w-16">썸네일</TableHead>
                        <TableHead>크리에이터</TableHead>
                        <TableHead className="text-right">좋아요</TableHead>
                        <TableHead className="text-right">댓글</TableHead>
                        <TableHead className="text-right">조회수</TableHead>
                        <TableHead className="text-center">연관도</TableHead>
                        <TableHead>주요키워드</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contentRows.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="text-sm whitespace-nowrap">{c.postedAt}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              {c.platform === "instagram" ? "IG" : "YT"} {c.contentType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                              <Image className="h-4 w-4 text-gray-400" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-sm">{c.creator}</TableCell>
                          <TableCell className="text-right text-sm">{c.likes.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm">{c.comments.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm">{c.views.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={`text-[10px] ${c.relevance >= 90 ? "bg-green-600" : c.relevance >= 70 ? "bg-blue-600" : "bg-gray-500"} text-white`}>
                              {c.relevance}%
                            </Badge>
                          </TableCell>
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
              </div>
            </div>

            {/* ─── 파트 3: 매출 기준 상세 (CJ 데이터) ─── */}
            {perfData && (
              <>
                {/* 시간별 주문/매출 (옵션별 stacked) */}
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="text-base otr-section-marker">◆ 시간별 주문/매출 현황 (옵션별)</CardTitle>
                    <CardDescription>전체 및 옵션별 시간대 주문 수량 + 매출</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={mockHourlyOrdersByOption}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number, name: string) =>
                          name === "매출" ? formatKRW(value) : value.toLocaleString()
                        } />
                        <Legend />
                        <Bar yAxisId="left" dataKey="optionA" stackId="opt" fill="#6366f1" name="옵션A" radius={[0, 0, 0, 0]} />
                        <Bar yAxisId="left" dataKey="optionB" stackId="opt" fill="#8b5cf6" name="옵션B" radius={[0, 0, 0, 0]} />
                        <Bar yAxisId="left" dataKey="optionC" stackId="opt" fill="#c4b5fd" name="옵션C" radius={[0, 0, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f43f5e" name="매출" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* 고객 세그먼트: 연령 + 성별 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="rounded-none">
                    <CardHeader>
                      <CardTitle className="text-base otr-section-marker flex items-center gap-2">
                        <Users className="h-4 w-4" /> ◆ 주문 고객 연령 분포
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={perfData.customerSegment.ageGroups} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis dataKey="range" type="category" tick={{ fontSize: 11 }} width={50} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#6366f1" name="고객수" radius={[0, 0, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="rounded-none">
                    <CardHeader>
                      <CardTitle className="text-base otr-section-marker">◆ 성별 분포</CardTitle>
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

                {/* 함께 구매한 상품 Top 10 */}
                <div>
                  <div className="mb-3">
                    <h3 className="text-base font-semibold otr-section-marker">◆ 함께 구매한 상품 Top 10</h3>
                    <p className="text-xs text-muted-foreground">최소 주문 고객 10명 이상 · 주문고객수 → 금액순 정렬</p>
                  </div>
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
                </div>

                {/* 취소/교환/반품 현황 (분리 표기) */}
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="text-base otr-section-marker flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ◆ 취소/교환/반품 현황 (취교반율 {mockCancelExchangeReturn.summary.rate}%)
                    </CardTitle>
                    <CardDescription>
                      {!isConfirmed && (
                        <span className="text-amber-600">캠페인 종료 후 14일까지 데이터 미확정 · 14일 경과 후 확정</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* 요약 카드 */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="border p-3 text-center">
                        <p className="text-xs text-muted-foreground">취소</p>
                        <p className="text-lg font-bold text-red-600">{mockCancelExchangeReturn.summary.cancelCount}건</p>
                      </div>
                      <div className="border p-3 text-center">
                        <p className="text-xs text-muted-foreground">교환</p>
                        <p className="text-lg font-bold text-amber-600">{mockCancelExchangeReturn.summary.exchangeCount}건</p>
                      </div>
                      <div className="border p-3 text-center">
                        <p className="text-xs text-muted-foreground">반품</p>
                        <p className="text-lg font-bold text-orange-600">{mockCancelExchangeReturn.summary.returnCount}건</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>유형</TableHead>
                            <TableHead>사유</TableHead>
                            <TableHead className="text-right">건수</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockCancelExchangeReturn.cancelReasons.map((cr, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                <Badge variant="outline" className={`text-[10px] ${cr.type === "취소" ? "border-red-300 text-red-600" : cr.type === "교환" ? "border-amber-300 text-amber-600" : "border-orange-300 text-orange-600"}`}>
                                  {cr.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{cr.reason}</TableCell>
                              <TableCell className="text-right text-sm">{cr.count}건</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "취소", value: mockCancelExchangeReturn.summary.cancelCount },
                              { name: "교환", value: mockCancelExchangeReturn.summary.exchangeCount },
                              { name: "반품", value: mockCancelExchangeReturn.summary.returnCount },
                            ]}
                            cx="50%" cy="50%" outerRadius={70} dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#ef4444" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#f97316" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
