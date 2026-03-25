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
  Info,
  Building2,
  UserCircle,
  ArrowRight,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import mockPerformanceJson from "@/data/mock/performance.json";
import mockAgencyCreators from "@/data/mock/agency-creators.json";

type PerformanceData = (typeof mockPerformanceJson)[number];

const CAMPAIGNS = [
  { id: "campaign-1", name: "올리브영 봄 신상 공구", status: "진행중" },
  { id: "campaign-2", name: "CJ제일제당 비비고 봄 캠페인", status: "진행중" },
  { id: "campaign-4", name: "이니스프리 그린티 라인 완료", status: "완료" },
];

const mockContentPerformance = [
  {
    id: "c1", campaign: "올리브영 봄 신상 공구", campaignId: "campaign-1", creatorId: "creator-1",
    type: "공구" as const, platform: "instagram",
    likes: 12400, comments: 890, saves: 2100, shares: 450, views: 45000,
    clicks: 3200, conversions: 128, revenue: 4480000, postedAt: "2026-03-01",
    keywords: ["촉촉", "데일리", "세럼추천", "올영세일"],
    interpolated: false,
    relevanceScore: 92, relevanceLabel: "연관" as const, contentCategory: "뷰티",
  },
  {
    id: "c2", campaign: "CJ제일제당 비비고 봄 캠페인", campaignId: "campaign-2", creatorId: "creator-1",
    type: "공구" as const, platform: "instagram",
    likes: 9800, comments: 1230, saves: 1800, shares: 620, views: 38000,
    clicks: 2800, conversions: 95, revenue: 3325000, postedAt: "2026-03-02",
    keywords: ["맛있다", "간편식", "비비고만두", "자취꿀팁"],
    interpolated: false,
    relevanceScore: 88, relevanceLabel: "연관" as const, contentCategory: "식품",
  },
  {
    id: "c3", campaign: "올리브영 봄 신상 공구", campaignId: "campaign-1", creatorId: "creator-1",
    type: "리뷰" as const, platform: "youtube",
    likes: 15200, comments: 2100, saves: 3400, shares: 890, views: 120000,
    clicks: 5100, conversions: 204, revenue: 7140000, postedAt: "2026-02-28",
    keywords: ["리뷰", "스킨케어", "봄신상", "추천"],
    interpolated: true,
    relevanceScore: 78, relevanceLabel: "연관" as const, contentCategory: "뷰티",
  },
  {
    id: "c4", campaign: "이니스프리 그린티 라인 완료", campaignId: "campaign-4", creatorId: "creator-1",
    type: "공구" as const, platform: "instagram",
    likes: 10800, comments: 1120, saves: 2400, shares: 520, views: 52000,
    clicks: 3800, conversions: 152, revenue: 5320000, postedAt: "2026-01-15",
    keywords: ["그린티", "보습", "이니스프리", "겨울스킨케어"],
    interpolated: false,
    relevanceScore: 95, relevanceLabel: "연관" as const, contentCategory: "뷰티",
  },
  {
    id: "c5", campaign: "올리브영 봄 신상 공구", campaignId: "campaign-1", creatorId: "creator-2",
    type: "공구" as const, platform: "instagram",
    likes: 8200, comments: 620, saves: 1400, shares: 310, views: 32000,
    clicks: 2100, conversions: 84, revenue: 2940000, postedAt: "2026-03-03",
    keywords: ["올영추천", "세럼", "데일리루틴"],
    interpolated: false,
    relevanceScore: 85, relevanceLabel: "연관" as const, contentCategory: "뷰티",
  },
  {
    id: "c6", campaign: "올리브영 봄 신상 공구", campaignId: "campaign-1", creatorId: "creator-3",
    type: "리뷰" as const, platform: "instagram",
    likes: 6800, comments: 480, saves: 980, shares: 220, views: 25000,
    clicks: 1500, conversions: 60, revenue: 2100000, postedAt: "2026-03-05",
    keywords: ["스킨케어", "보습", "세럼"],
    interpolated: true,
    relevanceScore: 12, relevanceLabel: "비연관" as const, contentCategory: "라이프스타일",
  },
  {
    id: "c7", campaign: "CJ제일제당 비비고 봄 캠페인", campaignId: "campaign-2", creatorId: "creator-2",
    type: "공구" as const, platform: "instagram",
    likes: 7200, comments: 850, saves: 1200, shares: 380, views: 28000,
    clicks: 1800, conversions: 62, revenue: 2170000, postedAt: "2026-03-04",
    keywords: ["비비고", "간편식", "혼밥"],
    interpolated: false,
    relevanceScore: 82, relevanceLabel: "연관" as const, contentCategory: "식품",
  },
  {
    id: "c8", campaign: "올리브영 봄 신상 공구", campaignId: "campaign-1", creatorId: "creator-1",
    type: "일반" as const, platform: "instagram",
    likes: 3200, comments: 210, saves: 420, shares: 85, views: 14000,
    clicks: 620, conversions: 8, revenue: 280000, postedAt: "2026-03-04",
    keywords: ["일상", "카페", "데일리"],
    interpolated: false,
    relevanceScore: 8, relevanceLabel: "비연관" as const, contentCategory: "일상",
  },
];

const mockRewardLinks = [
  { id: "rl1", campaign: "올리브영 봄 신상 공구", link: "https://link.ontner.com/abc123", clicks: 8100, conversions: 332, revenue: 11620000 },
  { id: "rl2", campaign: "CJ제일제당 비비고 봄 캠페인", link: "https://link.ontner.com/def456", clicks: 2800, conversions: 95, revenue: 3325000 },
  { id: "rl3", campaign: "이니스프리 그린티 라인 완료", link: "https://link.ontner.com/ghi789", clicks: 3800, conversions: 152, revenue: 5320000 },
];

/* 통합 Summary 차트 - 시간별 데이터 */
const mockHourlyTrend = [
  { time: "09시", engagement: 1200, revenue: 1575000, uploads: 0 },
  { time: "10시", engagement: 2800, revenue: 2730000, uploads: 1 },
  { time: "11시", engagement: 4500, revenue: 3920000, uploads: 0 },
  { time: "12시", engagement: 6200, revenue: 5460000, uploads: 2 },
  { time: "13시", engagement: 5800, revenue: 4690000, uploads: 0 },
  { time: "14시", engagement: 4200, revenue: 3430000, uploads: 0, interpolated: true },
  { time: "15시", engagement: 3800, revenue: 3045000, uploads: 0, interpolated: true },
  { time: "16시", engagement: 3200, revenue: 2660000, uploads: 1 },
  { time: "17시", engagement: 2900, revenue: 2275000, uploads: 0 },
  { time: "18시", engagement: 4800, revenue: 3115000, uploads: 0 },
  { time: "19시", engagement: 6500, revenue: 4200000, uploads: 0 },
  { time: "20시", engagement: 7200, revenue: 5075000, uploads: 1 },
  { time: "21시", engagement: 5800, revenue: 4620000, uploads: 0 },
  { time: "22시", engagement: 2100, revenue: 1505000, uploads: 0 },
];

/* 통합 Summary 차트 - 일별 데이터 */
const mockDailyTrend = [
  { time: "3/1", engagement: 28000, revenue: 12800000, uploads: 2 },
  { time: "3/2", engagement: 32500, revenue: 14200000, uploads: 1 },
  { time: "3/3", engagement: 41000, revenue: 18500000, uploads: 3 },
  { time: "3/4", engagement: 38200, revenue: 16800000, uploads: 1, interpolated: true },
  { time: "3/5", engagement: 45600, revenue: 21200000, uploads: 2 },
  { time: "3/6", engagement: 52100, revenue: 24500000, uploads: 2 },
  { time: "3/7", engagement: 48300, revenue: 22100000, uploads: 1 },
  { time: "3/8", engagement: 35800, revenue: 15600000, uploads: 0 },
  { time: "3/9", engagement: 29400, revenue: 13200000, uploads: 1 },
  { time: "3/10", engagement: 42800, revenue: 19800000, uploads: 2 },
];

const PIE_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];

function formatKRW(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

/* 보간 데이터 포인트용 커스텀 Dot */
function InterpolatedDot(props: Record<string, unknown>) {
  const { cx, cy, payload, stroke } = props as {
    cx: number;
    cy: number;
    payload: { interpolated?: boolean };
    stroke: string;
  };
  if (!payload?.interpolated) return <g />;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="white"
      stroke={stroke}
      strokeWidth={2}
      strokeDasharray="3 2"
    />
  );
}

export default function PerformancePage() {
  const [memberType, setMemberType] = useState<"individual" | "agency">("individual");
  const [selectedCampaign, setSelectedCampaign] = useState("campaign-1");
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [timeUnit, setTimeUnit] = useState<"hourly" | "daily">("hourly");
  const [showNonRelevant, setShowNonRelevant] = useState(true);

  // 에이전시 소속 크리에이터 중 선택된 캠페인에 참여한 크리에이터 목록
  const agencyCreatorsForCampaign = useMemo(() => {
    if (memberType !== "agency") return [];
    const agency = mockAgencyCreators[0]; // 데모용 첫 번째 에이전시
    const campaignCreatorIds = mockPerformanceJson
      .filter((p) => p.campaignId === selectedCampaign)
      .map((p) => p.creatorId);
    return agency.creators.filter((c) => campaignCreatorIds.includes(c.id));
  }, [memberType, selectedCampaign]);

  // 에이전시 모드에서 캠페인 변경 시 첫 번째 크리에이터 자동 선택
  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    if (memberType === "agency") {
      const agency = mockAgencyCreators[0];
      const campaignCreatorIds = mockPerformanceJson
        .filter((p) => p.campaignId === campaignId)
        .map((p) => p.creatorId);
      const firstCreator = agency.creators.find((c) => campaignCreatorIds.includes(c.id));
      setSelectedCreator(firstCreator?.id ?? null);
    }
  };

  const handleMemberTypeToggle = (isAgency: boolean) => {
    const newType = isAgency ? "agency" : "individual";
    setMemberType(newType);
    if (newType === "agency") {
      const agency = mockAgencyCreators[0];
      const campaignCreatorIds = mockPerformanceJson
        .filter((p) => p.campaignId === selectedCampaign)
        .map((p) => p.creatorId);
      const firstCreator = agency.creators.find((c) => campaignCreatorIds.includes(c.id));
      setSelectedCreator(firstCreator?.id ?? null);
    } else {
      setSelectedCreator(null);
    }
  };

  const campaignInfo = CAMPAIGNS.find((c) => c.id === selectedCampaign);
  const perfData: PerformanceData | undefined = useMemo(() => {
    if (memberType === "agency" && selectedCreator) {
      return mockPerformanceJson.find(
        (p) => p.campaignId === selectedCampaign && p.creatorId === selectedCreator
      );
    }
    return mockPerformanceJson.find((p) => p.campaignId === selectedCampaign);
  }, [selectedCampaign, selectedCreator, memberType]);

  const filteredContent = useMemo(() => {
    let base = mockContentPerformance.filter((c) => c.campaignId === selectedCampaign);
    if (memberType === "agency" && selectedCreator) {
      base = base.filter((c) => c.creatorId === selectedCreator);
    } else {
      base = base.filter((c) => c.creatorId === "creator-1");
    }
    if (!showNonRelevant) {
      base = base.filter((c) => c.relevanceScore >= 20);
    }
    return base;
  }, [selectedCampaign, selectedCreator, memberType, showNonRelevant]);

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

  const trendData = timeUnit === "hourly" ? mockHourlyTrend : mockDailyTrend;

  return (
    <TooltipProvider>
      <PageHeader
        title="캠페인별 성과 조회"
        description="참여 캠페인의 콘텐츠 반응과 주문 성과를 확인하여 진행 상황을 모니터링하세요"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* 회원 유형 토글 (데모용) */}
        <Card className="border-dashed border-violet-200 bg-violet-50/30">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <UserCircle className="h-4 w-4 text-violet-600" />
              <Label className="text-sm text-violet-700">회원 유형 (데모)</Label>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${memberType === "individual" ? "font-semibold text-violet-800" : "text-violet-400"}`}>
                  크리에이터
                </span>
                <Switch
                  checked={memberType === "agency"}
                  onCheckedChange={handleMemberTypeToggle}
                />
                <span className={`text-xs ${memberType === "agency" ? "font-semibold text-violet-800" : "text-violet-400"}`}>
                  에이전시
                </span>
              </div>
              {memberType === "agency" && (
                <Badge variant="outline" className="ml-2 text-[10px] bg-violet-100 text-violet-700 border-violet-300">
                  <Building2 className="h-3 w-3 mr-1" />
                  뷰티크루 에이전시
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 캠페인 선택 (+ 에이전시: 크리에이터 선택) */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <Label className="shrink-0 w-24">캠페인 선택</Label>
              <Select value={selectedCampaign} onValueChange={handleCampaignChange}>
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

            {/* 에이전시: 크리에이터 선택 (2단계) */}
            {memberType === "agency" && (
              <div className="flex items-center gap-4">
                <Label className="shrink-0 w-24">크리에이터 선택</Label>
                {agencyCreatorsForCampaign.length > 0 ? (
                  <Select
                    value={selectedCreator ?? ""}
                    onValueChange={setSelectedCreator}
                  >
                    <SelectTrigger className="max-w-md">
                      <SelectValue placeholder="크리에이터를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {agencyCreatorsForCampaign.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    해당 캠페인에 참여한 소속 크리에이터가 없습니다
                  </p>
                )}
                {selectedCreator && (
                  <Badge variant="secondary" className="text-[10px]">
                    <Users className="h-3 w-3 mr-1" />
                    개별 크리에이터 단위 조회
                  </Badge>
                )}
              </div>
            )}
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

        {/* 수집 범위 안내 */}
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="pt-4 pb-4 flex items-start gap-3">
            <Monitor className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">콘텐츠 수집 범위</p>
              <p className="text-xs text-blue-600 mt-0.5">
                수집 대상: Instagram (피드, 릴스) · YouTube (롱폼, 숏폼) | 캠페인 기간 내 크리에이터 계정의 모든 콘텐츠를 자동 수집합니다
              </p>
              <p className="text-xs text-blue-500 mt-1">
                수집된 콘텐츠는 캠페인 메타데이터(캠페인명, 상품정보, 브랜드, 카테고리, 기간)를 기반으로 연관도를 분석하여 연관/비연관을 구분 표시합니다
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ═══ PART 1: 통합 Summary ═══ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">통합 성과 추이</CardTitle>
                <CardDescription>
                  피처링 콘텐츠 인게이지먼트와 CJ 실제 매출 수치를 겹쳐 시간/일 단위별 연관성과 추이를 파악
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                <button
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${timeUnit === "hourly" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setTimeUnit("hourly")}
                >
                  시간별
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${timeUnit === "daily" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setTimeUnit("daily")}
                >
                  일별
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v: number) => formatKRW(v)} />
                <RechartsTooltip
                  formatter={(value: number, name: string) =>
                    name === "실제 매출 (CJ)" ? formatKRW(value) : value.toLocaleString()
                  }
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#6366f1"
                  name="콘텐츠 인게이지먼트 (피처링)"
                  strokeWidth={2}
                  dot={InterpolatedDot}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f43f5e"
                  name="실제 매출 (CJ)"
                  strokeWidth={2}
                  dot={InterpolatedDot}
                />
                <Line
                  yAxisId="left"
                  type="step"
                  dataKey="uploads"
                  stroke="#10b981"
                  name="콘텐츠 업로드"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            {trendData.some((d) => (d as Record<string, unknown>).interpolated) && (
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full border-2 border-dashed border-gray-400" />
                보간된 데이터 (수집 누락 구간에 대한 이전 값/중간값 보정)
              </p>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">콘텐츠 기준 상세</TabsTrigger>
            <TabsTrigger value="sales">매출 기준 상세</TabsTrigger>
          </TabsList>

          {/* ═══ PART 2: 콘텐츠 기준 상세 ═══ */}
          <TabsContent value="content" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">콘텐츠 인게이지먼트 현황</CardTitle>
                    <CardDescription>합의된 수집 주기별 콘텐츠 업로드 현황 및 인게이지먼트 세부 성과</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="show-non-relevant"
                        checked={showNonRelevant}
                        onCheckedChange={setShowNonRelevant}
                      />
                      <Label htmlFor="show-non-relevant" className="text-xs text-muted-foreground cursor-pointer">
                        비연관 콘텐츠 포함
                      </Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[260px]">
                          <p className="text-xs">연관도 20% 미만 콘텐츠를 표시합니다. 캠페인 기간 내 알고리즘 효과로 매출에 간접 영향을 줄 수 있으므로 전체 콘텐츠를 보는 것을 권장합니다.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      수집 주기: {timeUnit === "hourly" ? "시간 단위" : "일 단위"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>게시일</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>플랫폼</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>연관도</TableHead>
                      <TableHead className="text-right">조회수</TableHead>
                      <TableHead className="text-right">좋아요</TableHead>
                      <TableHead className="text-right">댓글</TableHead>
                      <TableHead className="text-right">저장</TableHead>
                      <TableHead className="text-right">공유</TableHead>
                      <TableHead className="text-right">매출</TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((c) => (
                      <TableRow
                        key={c.id}
                        className={
                          c.relevanceLabel === "비연관"
                            ? "bg-gray-50/40"
                            : c.interpolated
                            ? "bg-amber-50/40"
                            : ""
                        }
                      >
                        <TableCell className="text-sm">{c.postedAt}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm capitalize">{c.platform}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">{c.contentCategory}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                c.relevanceScore >= 20
                                  ? "bg-green-50 text-green-700 border-green-300"
                                  : "bg-gray-100 text-gray-500 border-gray-300"
                              }`}
                            >
                              {c.relevanceLabel}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{c.relevanceScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">{c.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.likes.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.comments.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.saves.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.shares.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{formatKRW(c.revenue)}</TableCell>
                        <TableCell>
                          {c.interpolated && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3.5 w-3.5 text-amber-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">네트워크 오류로 수집 누락, 보정된 데이터입니다</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredContent.some((c) => c.interpolated) && (
                  <p className="text-[11px] text-amber-600 mt-3 flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    결측치(수집 실패 구간)는 이전 값/중간값 보정 등 예외 처리 로직을 반영하여 표기됩니다
                  </p>
                )}
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

          {/* ═══ PART 3: 매출 기준 상세 ═══ */}
          <TabsContent value="sales" className="space-y-6 mt-4">
            {perfData ? (
              <>
                {/* 시간별 주문/매출 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">시간별 주문/매출 현황</CardTitle>
                    <CardDescription>CJ 내부 집계 데이터 기반 매일(또는 시간 단위) 주문 건수 및 매출</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={perfData.hourlyOrders}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                        <RechartsTooltip formatter={(value: number, name: string) =>
                          name === "매출" ? formatKRW(value) : value.toLocaleString()
                        } />
                        <Legend />
                        <Bar yAxisId="left" dataKey="orders" fill="#6366f1" name="주문수" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f43f5e" name="매출" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                    {perfData.interpolatedHours && perfData.interpolatedHours.length > 0 && (
                      <p className="text-[11px] text-amber-600 mt-2 flex items-center gap-1.5">
                        <Info className="h-3 w-3" />
                        {perfData.interpolatedHours.join(", ")} 구간은 수집 누락으로 보정된 데이터입니다
                      </p>
                    )}
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
                      <CardDescription>주문 고객 세그먼트 (연령)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={perfData.customerSegment.ageGroups} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fontSize: 11 }} />
                          <YAxis dataKey="range" type="category" tick={{ fontSize: 11 }} width={50} />
                          <RechartsTooltip />
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
                            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#f43f5e" />
                            <Cell fill="#6366f1" />
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-6 text-sm mt-2">
                        <span>여성 {((perfData.customerSegment.gender.female / genderTotal) * 100).toFixed(0)}%</span>
                        <span>남성 {((perfData.customerSegment.gender.male / genderTotal) * 100).toFixed(0)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 함께 구매한 상품 Top 10 (리텐션) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">함께 구매한 상품 Top {Math.min(perfData.topProducts.length, 10)}</CardTitle>
                    <CardDescription>구매 고객이 추가로 함께 구매한 연관 상품 (리텐션)</CardDescription>
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
                  <CardContent className="space-y-4">
                    {/* D+14 정책 안내 배너 */}
                    <div className={`rounded-lg px-4 py-3 text-sm flex items-start gap-2.5 ${isConfirmed ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <p className="text-green-700">
                            D+14 확정 수치입니다. 취소/교환/반품이 최종 반영된 확정 데이터입니다.
                          </p>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                          <p className="text-amber-700">
                            캠페인 진행 중에는 교환 및 반품 데이터가 수시로 변동됩니다. 캠페인 완료 후 14일이 경과해야 최종 확정 수치로 노출됩니다.
                          </p>
                        </>
                      )}
                    </div>

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
                              label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {perfData.cancelReasons.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
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

        {/* 인사이트 리포트 바로가기 */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/ontner/insight/campaign">
            <Card className="hover:border-violet-300 hover:bg-violet-50/20 transition-colors cursor-pointer group">
              <CardContent className="pt-5 pb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">인사이트 리포트 - 캠페인</p>
                  <p className="text-xs text-muted-foreground mt-0.5">캠페인 매출/콘텐츠 성과 기반 분석 리포트</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/ontner/insight/affiliate">
            <Card className="hover:border-violet-300 hover:bg-violet-50/20 transition-colors cursor-pointer group">
              <CardContent className="pt-5 pb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">인사이트 리포트 - 제휴/리워드</p>
                  <p className="text-xs text-muted-foreground mt-0.5">리워드 링크 상품별 성과 분석 리포트</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </TooltipProvider>
  );
}
