"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Tag,
  ShoppingBag,
  Package,
  RefreshCcw,
  Star,
  ChevronRight,
  ChevronLeft,
  Search,
  Users,
  ExternalLink,
  Award,
  Calendar,
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
  PieChart,
  Pie,
  Cell,
  Legend,
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
import type { Campaign } from "@/types/campaign";

const PIE_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

function formatNumber(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString("ko-KR");
}

function formatKRW(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

/* ─── Step 타입 ─── */
type StepType = 1 | 2 | 3 | "report";
type ViewType = "creator" | "brand";

/* ─── Mock: 크리에이터 목록 ─── */
const MOCK_CREATORS = [
  { id: "creator-1", name: "뷰티하나", handle: "@beauty_hana" },
  { id: "creator-2", name: "푸디진", handle: "@foodie_jin" },
  { id: "creator-3", name: "스킨케어진", handle: "@skincare_jin" },
  { id: "creator-4", name: "패션왕킴", handle: "@fashion_king_kim" },
  { id: "creator-5", name: "리빙퀸", handle: "@living_queen" },
];

/* ─── Mock: 브랜드 목록 ─── */
const MOCK_BRANDS = [
  { id: "oliveyoung", name: "올리브영" },
  { id: "cjcheiljedang", name: "CJ제일제당" },
  { id: "musinsa", name: "무신사" },
  { id: "tvn", name: "tvN" },
  { id: "nike", name: "나이키" },
];

/* ─── Mock: 크리에이터별 완료 캠페인 ─── */
const MOCK_CREATOR_CAMPAIGNS: Record<string, { id: string; name: string; brand: string; period: string; revenue: number }[]> = {
  "creator-1": [
    { id: "cc1", name: "올리브영 봄 신상", brand: "올리브영", period: "2026-01-15 ~ 2026-02-15", revenue: 85000000 },
    { id: "cc2", name: "비비고 봄 캠페인", brand: "CJ제일제당", period: "2025-12-01 ~ 2025-12-31", revenue: 42000000 },
    { id: "cc3", name: "뷰티 시크릿 박스", brand: "올리브영", period: "2025-11-01 ~ 2025-11-30", revenue: 68000000 },
  ],
  "creator-2": [
    { id: "cc4", name: "비비고 만두 대전", brand: "CJ제일제당", period: "2026-01-01 ~ 2026-01-31", revenue: 120000000 },
    { id: "cc5", name: "간편식 페스타", brand: "CJ제일제당", period: "2025-10-15 ~ 2025-11-15", revenue: 95000000 },
  ],
  "creator-3": [
    { id: "cc6", name: "그린티 라인 론칭", brand: "올리브영", period: "2026-02-01 ~ 2026-02-28", revenue: 53000000 },
  ],
  "creator-4": [
    { id: "cc7", name: "무신사 숏패딩 시즌", brand: "무신사", period: "2025-11-01 ~ 2025-12-31", revenue: 156000000 },
  ],
  "creator-5": [
    { id: "cc8", name: "tvN 굿즈 세트", brand: "tvN", period: "2026-01-15 ~ 2026-02-28", revenue: 32000000 },
  ],
};

/* ─── Mock: 브랜드별 완료 캠페인 ─── */
const MOCK_BRAND_CAMPAIGNS: Record<string, { id: string; name: string; creator: string; period: string; revenue: number }[]> = {
  "oliveyoung": [
    { id: "bc1", name: "올리브영 봄 신상", creator: "뷰티하나", period: "2026-01-15 ~ 2026-02-15", revenue: 85000000 },
    { id: "bc2", name: "뷰티 시크릿 박스", creator: "뷰티하나", period: "2025-11-01 ~ 2025-11-30", revenue: 68000000 },
    { id: "bc3", name: "그린티 라인 론칭", creator: "스킨케어진", period: "2026-02-01 ~ 2026-02-28", revenue: 53000000 },
    { id: "bc4", name: "마스크팩 대전", creator: "뷰티하나", period: "2025-09-01 ~ 2025-09-30", revenue: 45000000 },
    { id: "bc5", name: "선케어 기획전", creator: "스킨케어진", period: "2025-07-01 ~ 2025-07-31", revenue: 38000000 },
  ],
  "cjcheiljedang": [
    { id: "bc6", name: "비비고 봄 캠페인", creator: "뷰티하나", period: "2025-12-01 ~ 2025-12-31", revenue: 42000000 },
    { id: "bc7", name: "비비고 만두 대전", creator: "푸디진", period: "2026-01-01 ~ 2026-01-31", revenue: 120000000 },
    { id: "bc8", name: "간편식 페스타", creator: "푸디진", period: "2025-10-15 ~ 2025-11-15", revenue: 95000000 },
  ],
  "musinsa": [
    { id: "bc9", name: "무신사 숏패딩 시즌", creator: "패션왕킴", period: "2025-11-01 ~ 2025-12-31", revenue: 156000000 },
  ],
  "tvn": [
    { id: "bc10", name: "tvN 굿즈 세트", creator: "리빙퀸", period: "2026-01-15 ~ 2026-02-28", revenue: 32000000 },
  ],
  "nike": [],
};

/* ─── Mock: 크리에이터 기준 리포트 데이터 ─── */
const MOCK_CREATOR_REPORT = {
  summary: { totalRevenue: 195000000, totalOrders: 8200, avgConversion: 4.8, contentCount: 24 },
  topCampaigns: [
    { name: "올리브영 봄 신상", revenue: 85000000, orders: 3200, conversion: 5.2 },
    { name: "뷰티 시크릿 박스", revenue: 68000000, orders: 2800, conversion: 4.5 },
    { name: "비비고 봄 캠페인", revenue: 42000000, orders: 2200, conversion: 4.8 },
  ],
  engagementTop5: [
    { name: "릴스 봄신상 언박싱", engagement: 9200, likes: 12400, comments: 890, views: 45000, saves: 2100 },
    { name: "VLOG 스킨케어 루틴", engagement: 7800, likes: 15200, comments: 2100, views: 120000, saves: 3400 },
    { name: "피드 메이크업 룩", engagement: 6500, likes: 8900, comments: 670, views: 32000, saves: 1500 },
    { name: "숏폼 비교리뷰", engagement: 5900, likes: 6200, comments: 520, views: 28000, saves: 1100 },
    { name: "라이브 공구", engagement: 5100, likes: 5500, comments: 480, views: 22000, saves: 900 },
  ],
  timeTrend: [
    { month: "10월", engagement: 4200, conversions: 380, clicks: 12000 },
    { month: "11월", engagement: 5800, conversions: 520, clicks: 16500 },
    { month: "12월", engagement: 7100, conversions: 680, clicks: 21000 },
    { month: "1월", engagement: 6500, conversions: 610, clicks: 19500 },
    { month: "2월", engagement: 8200, conversions: 780, clicks: 25000 },
    { month: "3월", engagement: 9400, conversions: 920, clicks: 31000 },
  ],
  contentTypeDist: [
    { name: "공구", value: 42 },
    { name: "리뷰", value: 28 },
    { name: "일반", value: 18 },
    { name: "광고", value: 12 },
  ],
  rewardLinkProducts: [
    { product: "올리브영 A.H.A 세럼", clicks: 38000, orders: 2800, revenue: 84000000, conversion: 7.4 },
    { product: "비비고 왕교자 1kg", clicks: 28000, orders: 1800, revenue: 54000000, conversion: 6.4 },
    { product: "뷰티 시크릿 박스", clicks: 22000, orders: 1200, revenue: 36000000, conversion: 5.5 },
    { product: "에센스 팩", clicks: 15000, orders: 800, revenue: 24000000, conversion: 5.3 },
    { product: "클렌징 세트", clicks: 11000, orders: 600, revenue: 18000000, conversion: 5.5 },
  ],
};

/* ─── Mock: 브랜드 기준 리포트 데이터 ─── */
const mockBrandTopCampaigns = [
  { rank: 1, name: "올리브영 봄 신상", period: "2026-01-15 ~ 2026-02-15", revenue: 85000000, orders: 3200, conversion: 5.2 },
  { rank: 2, name: "뷰티 시크릿 박스", period: "2025-11-01 ~ 2025-11-30", revenue: 68000000, orders: 2800, conversion: 4.5 },
  { rank: 3, name: "그린티 라인 론칭", period: "2026-02-01 ~ 2026-02-28", revenue: 53000000, orders: 2100, conversion: 4.1 },
  { rank: 4, name: "마스크팩 대전", period: "2025-09-01 ~ 2025-09-30", revenue: 45000000, orders: 1800, conversion: 3.8 },
  { rank: 5, name: "선케어 기획전", period: "2025-07-01 ~ 2025-07-31", revenue: 38000000, orders: 1500, conversion: 3.5 },
];

const mockBrandTopCreators = [
  { id: "creator-1", name: "뷰티하나", handle: "@beauty_hana", brandCollabCount: 4, totalCollabCount: 12, audienceGender: { female: 78, male: 22 }, audienceAge: "25-34세 중심", score: 95 },
  { id: "creator-3", name: "스킨케어진", handle: "@skincare_jin", brandCollabCount: 2, totalCollabCount: 8, audienceGender: { female: 82, male: 18 }, audienceAge: "20-29세 중심", score: 88 },
  { id: "creator-2", name: "푸디진", handle: "@foodie_jin", brandCollabCount: 1, totalCollabCount: 15, audienceGender: { female: 65, male: 35 }, audienceAge: "25-39세 중심", score: 76 },
  { id: "creator-4", name: "패션왕킴", handle: "@fashion_king_kim", brandCollabCount: 1, totalCollabCount: 10, audienceGender: { female: 55, male: 45 }, audienceAge: "20-34세 중심", score: 72 },
  { id: "creator-5", name: "리빙퀸", handle: "@living_queen", brandCollabCount: 1, totalCollabCount: 6, audienceGender: { female: 88, male: 12 }, audienceAge: "30-44세 중심", score: 68 },
];

const mockRepurchaseCycle = [
  { category: "스킨케어 > 세럼/에센스", avgDays: 42 },
  { category: "스킨케어 > 크림/로션", avgDays: 56 },
  { category: "메이크업 > 립 제품", avgDays: 35 },
  { category: "클렌징 > 클렌징폼", avgDays: 48 },
  { category: "바디케어 > 바디로션", avgDays: 62 },
];

const mockEngagementTop20 = [
  { rank: 1, campaign: "올리브영 봄 신상", creator: "뷰티하나", type: "릴스", likes: 18500, comments: 2340, views: 125000, saves: 4200, keywords: ["봄신상", "세럼"] },
  { rank: 2, campaign: "올리브영 봄 신상", creator: "뷰티하나", type: "롱폼", likes: 15200, comments: 2100, views: 120000, saves: 3400, keywords: ["스킨케어", "봄메이크업"] },
  { rank: 3, campaign: "그린티 라인", creator: "스킨케어진", type: "릴스", likes: 14800, comments: 1980, views: 98000, saves: 3100, keywords: ["그린티", "톤업"] },
  { rank: 4, campaign: "뷰티 시크릿 박스", creator: "뷰티하나", type: "피드", likes: 12400, comments: 1560, views: 85000, saves: 2800, keywords: ["시크릿박스", "언박싱"] },
  { rank: 5, campaign: "마스크팩 대전", creator: "뷰티하나", type: "숏폼", likes: 11200, comments: 1420, views: 78000, saves: 2500, keywords: ["마스크팩", "보습"] },
  { rank: 6, campaign: "그린티 라인", creator: "스킨케어진", type: "피드", likes: 10800, comments: 1350, views: 72000, saves: 2300, keywords: ["데일리", "수분"] },
  { rank: 7, campaign: "선케어 기획전", creator: "스킨케어진", type: "릴스", likes: 9500, comments: 1200, views: 65000, saves: 2000, keywords: ["선크림", "SPF"] },
  { rank: 8, campaign: "올리브영 봄 신상", creator: "뷰티하나", type: "숏폼", likes: 8900, comments: 1100, views: 58000, saves: 1800, keywords: ["신상리뷰", "꿀팁"] },
  { rank: 9, campaign: "뷰티 시크릿 박스", creator: "스킨케어진", type: "릴스", likes: 8200, comments: 980, views: 52000, saves: 1600, keywords: ["시크릿", "추천"] },
  { rank: 10, campaign: "마스크팩 대전", creator: "뷰티하나", type: "피드", likes: 7800, comments: 920, views: 48000, saves: 1500, keywords: ["보습팩", "겨울"] },
  { rank: 11, campaign: "그린티 라인", creator: "뷰티하나", type: "릴스", likes: 7200, comments: 850, views: 44000, saves: 1400, keywords: ["그린티세럼", "기초"] },
  { rank: 12, campaign: "올리브영 봄 신상", creator: "스킨케어진", type: "피드", likes: 6800, comments: 800, views: 41000, saves: 1300, keywords: ["올영추천", "봄"] },
  { rank: 13, campaign: "선케어 기획전", creator: "뷰티하나", type: "피드", likes: 6500, comments: 760, views: 38000, saves: 1200, keywords: ["자외선", "여름"] },
  { rank: 14, campaign: "뷰티 시크릿 박스", creator: "뷰티하나", type: "숏폼", likes: 6200, comments: 720, views: 35000, saves: 1100, keywords: ["뷰티박스", "서프라이즈"] },
  { rank: 15, campaign: "마스크팩 대전", creator: "스킨케어진", type: "릴스", likes: 5800, comments: 680, views: 32000, saves: 1000, keywords: ["팩추천", "집에서"] },
  { rank: 16, campaign: "그린티 라인", creator: "스킨케어진", type: "숏폼", likes: 5500, comments: 640, views: 29000, saves: 950, keywords: ["그린티크림", "피부결"] },
  { rank: 17, campaign: "올리브영 봄 신상", creator: "뷰티하나", type: "피드", likes: 5200, comments: 600, views: 26000, saves: 900, keywords: ["봄컬러", "신제품"] },
  { rank: 18, campaign: "선케어 기획전", creator: "스킨케어진", type: "피드", likes: 4900, comments: 560, views: 23000, saves: 850, keywords: ["선케어", "톤업크림"] },
  { rank: 19, campaign: "뷰티 시크릿 박스", creator: "스킨케어진", type: "피드", likes: 4600, comments: 520, views: 20000, saves: 800, keywords: ["뷰티", "할인"] },
  { rank: 20, campaign: "마스크팩 대전", creator: "뷰티하나", type: "숏폼", likes: 4300, comments: 480, views: 18000, saves: 750, keywords: ["마스크", "루틴"] },
];

const mockPurchaseAnalysis = {
  ageGender: [
    { range: "10대", female: 120, male: 45 },
    { range: "20대", female: 850, male: 320 },
    { range: "30대", female: 1200, male: 480 },
    { range: "40대", female: 680, male: 250 },
    { range: "50대+", female: 280, male: 95 },
  ],
  retentionRate: 32.5,
  reviewKeywords: [
    { text: "가성비", weight: 95 }, { text: "추천", weight: 88 }, { text: "재구매", weight: 82 },
    { text: "배송빠름", weight: 78 }, { text: "품질좋음", weight: 75 }, { text: "발림성", weight: 70 },
    { text: "피부결", weight: 65 }, { text: "성분", weight: 62 }, { text: "향기", weight: 58 },
    { text: "순함", weight: 55 }, { text: "보습", weight: 52 }, { text: "촉촉", weight: 48 },
  ],
  conversionInsight: { audienceReach: 3200000, purchaseCount: 8200, conversionRate: 0.26, avgOrderValue: 35600 },
};

const mockCreatorRecommendations = [
  { id: "rc1", name: "글로우진", handle: "@glow_jin", score: 92, category: "뷰티", followers: 185000, engagementRate: 5.8, reason: "카테고리일치 + 높은 인게이지먼트" },
  { id: "rc2", name: "코스메리", handle: "@cosme_ri", score: 88, category: "스킨케어", followers: 142000, engagementRate: 6.2, reason: "브랜드유사 + 타겟 오디언스 일치" },
  { id: "rc3", name: "메이크업수", handle: "@makeup_su", score: 85, category: "메이크업", followers: 220000, engagementRate: 4.9, reason: "공구 진행 경험 + 높은 전환율" },
  { id: "rc4", name: "데일리뷰티", handle: "@daily_beauty", score: 81, category: "뷰티", followers: 98000, engagementRate: 7.1, reason: "카테고리일치 + 소규모 고충성" },
  { id: "rc5", name: "스킨러버", handle: "@skin_lover", score: 78, category: "스킨케어", followers: 165000, engagementRate: 5.3, reason: "오디언스 유사도 높음" },
];

/* ─── 스텝 인디케이터 ─── */
function StepIndicator({ currentStep }: { currentStep: StepType }) {
  const steps = [
    { num: 1, label: "기간 설정" },
    { num: 2, label: "조회 유형" },
    { num: 3, label: "대상 선택" },
    { num: "report" as const, label: "리포트" },
  ];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => {
        const isActive = currentStep === s.num;
        const isPast = typeof currentStep === "number" && typeof s.num === "number" && currentStep > s.num;
        const isReport = currentStep === "report" && s.num === "report";
        const done = isPast || isReport || (currentStep === "report" && s.num !== "report");
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold border ${isActive ? "bg-[#7c3aed] text-white border-[#7c3aed]" : done ? "bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]" : "bg-gray-100 text-gray-400 border-gray-300"}`}>
              {done && !isActive ? "✓" : typeof s.num === "number" ? s.num : "R"}
            </div>
            <span className={`text-xs ${isActive ? "text-[#7c3aed] font-bold" : done ? "text-[#7c3aed]" : "text-gray-400"}`}>{s.label}</span>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-gray-300" />}
          </div>
        );
      })}
    </div>
  );
}

export default function InsightPage() {
  const [step, setStep] = useState<StepType>(1);
  const [startDate, setStartDate] = useState("2025-07-01");
  const [endDate, setEndDate] = useState("2026-03-15");
  const [viewType, setViewType] = useState<ViewType | null>(null);
  const [creatorSearch, setCreatorSearch] = useState("");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [reportTab, setReportTab] = useState<"campaign" | "reward-link">("campaign");

  // 크리에이터 검색 필터
  const filteredCreators = useMemo(() => {
    if (!creatorSearch) return MOCK_CREATORS;
    const q = creatorSearch.toLowerCase();
    return MOCK_CREATORS.filter(c => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q));
  }, [creatorSearch]);

  // 선택된 크리에이터의 캠페인
  const creatorCampaigns = selectedCreatorId ? (MOCK_CREATOR_CAMPAIGNS[selectedCreatorId] ?? []) : [];
  const brandCampaigns = selectedBrand ? (MOCK_BRAND_CAMPAIGNS[selectedBrand] ?? []) : [];

  const toggleCampaign = (id: string) => {
    setSelectedCampaignIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const resetFlow = () => {
    setStep(1);
    setViewType(null);
    setSelectedCreatorId(null);
    setSelectedCampaignIds([]);
    setSelectedBrand(null);
    setCreatorSearch("");
    setReportTab("campaign");
  };

  return (
    <>
      <PageHeader
        title="캠페인 인사이트 리포트"
        description="특정 기간 및 조건(크리에이터/브랜드)으로 다각도 성과 분석"
      />

      <main className="flex-1 p-4">
        <StepIndicator currentStep={step} />

        {/* ─── Step 1: 기간 설정 ─── */}
        {step === 1 && (
          <div className="otr-search-panel space-y-4">
            <div className="flex items-center gap-4">
              <Label className="shrink-0 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> 조회 기간
              </Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-44" />
              <span className="text-sm text-muted-foreground">~</span>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-44" />
            </div>
            <p className="text-xs text-muted-foreground">집계 대상: 설정 기간 내 &lsquo;진행 완료&rsquo;된 캠페인 기준 (진행 중 캠페인 제외) · 최대 조회 기간: 12개월</p>
            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="px-4 py-1.5 text-xs bg-[#7c3aed] text-white border-0">
                다음 <ChevronRight className="h-3 w-3 inline" />
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2: 조회 축 선택 ─── */}
        {step === 2 && (
          <div className="otr-search-panel space-y-4">
            <Label className="text-sm font-medium">조회 유형을 선택하세요</Label>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <button
                onClick={() => setViewType("creator")}
                className={`p-4 border text-left ${viewType === "creator" ? "border-[#7c3aed] bg-[#f3f0ff]" : "border-gray-300"}`}
              >
                <Users className="h-5 w-5 mb-2 text-[#7c3aed]" />
                <p className="text-sm font-bold">크리에이터 기준</p>
                <p className="text-xs text-muted-foreground mt-1">특정 크리에이터의 전반적 활동 성과 분석</p>
                <p className="text-[10px] text-muted-foreground mt-1">캠페인 탭 + 리워드 링크 탭 제공</p>
              </button>
              <button
                onClick={() => setViewType("brand")}
                className={`p-4 border text-left ${viewType === "brand" ? "border-[#7c3aed] bg-[#f3f0ff]" : "border-gray-300"}`}
              >
                <Package className="h-5 w-5 mb-2 text-[#7c3aed]" />
                <p className="text-sm font-bold">브랜드 기준</p>
                <p className="text-xs text-muted-foreground mt-1">특정 브랜드의 캠페인 종합 성과 분석</p>
                <p className="text-[10px] text-muted-foreground mt-1">캠페인 리포트만 제공</p>
              </button>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-4 py-1.5 text-xs bg-white text-gray-600 border border-gray-300">
                <ChevronLeft className="h-3 w-3 inline" /> 이전
              </button>
              <button
                onClick={() => viewType && setStep(3)}
                disabled={!viewType}
                className={`px-4 py-1.5 text-xs border-0 ${viewType ? "bg-[#7c3aed] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                다음 <ChevronRight className="h-3 w-3 inline" />
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3-A: 크리에이터 기준 대상 선택 ─── */}
        {step === 3 && viewType === "creator" && (
          <div className="otr-search-panel space-y-4">
            <div className="flex items-center gap-4">
              <Label className="shrink-0">크리에이터 검색</Label>
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  value={creatorSearch}
                  onChange={(e) => setCreatorSearch(e.target.value)}
                  placeholder="크리에이터명 또는 핸들 검색"
                  className="pl-8"
                />
              </div>
            </div>

            {/* 크리에이터 선택 */}
            <div className="flex gap-2 flex-wrap">
              {filteredCreators.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCreatorId(c.id); setSelectedCampaignIds([]); }}
                  className={`px-3 py-1.5 text-xs border ${selectedCreatorId === c.id ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white text-gray-600 border-gray-300"}`}
                >
                  {c.name} <span className="text-[10px] opacity-70">{c.handle}</span>
                </button>
              ))}
            </div>

            {/* 캠페인 리스트 */}
            {selectedCreatorId && (
              <div>
                <Label className="text-xs mb-2 block">해당 기간 내 완료 캠페인 (다중 선택 가능)</Label>
                {creatorCampaigns.length > 0 ? (
                  <div className="space-y-1">
                    {creatorCampaigns.map(c => (
                      <label key={c.id} className={`flex items-center gap-3 p-2 border cursor-pointer ${selectedCampaignIds.includes(c.id) ? "border-[#7c3aed] bg-[#f3f0ff]" : "border-gray-200"}`}>
                        <input type="checkbox" checked={selectedCampaignIds.includes(c.id)} onChange={() => toggleCampaign(c.id)} className="accent-[#7c3aed]" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{c.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{c.brand} · {c.period}</span>
                        </div>
                        <span className="text-xs font-medium">{formatKRW(c.revenue)}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">해당 기간 내 완료된 캠페인이 없습니다</p>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-4 py-1.5 text-xs bg-white text-gray-600 border border-gray-300">
                <ChevronLeft className="h-3 w-3 inline" /> 이전
              </button>
              <button
                onClick={() => selectedCampaignIds.length > 0 && setStep("report")}
                disabled={selectedCampaignIds.length === 0}
                className={`px-4 py-1.5 text-xs border-0 ${selectedCampaignIds.length > 0 ? "bg-[#7c3aed] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                리포트 조회
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3-B: 브랜드 기준 대상 선택 ─── */}
        {step === 3 && viewType === "brand" && (
          <div className="otr-search-panel space-y-4">
            <div className="flex items-center gap-4">
              <Label className="shrink-0">브랜드 선택</Label>
              <Select value={selectedBrand ?? ""} onValueChange={(v) => { setSelectedBrand(v); setSelectedCampaignIds([]); }}>
                <SelectTrigger className="max-w-sm">
                  <SelectValue placeholder="브랜드를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_BRANDS.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBrand && (
              <div>
                <Label className="text-xs mb-2 block">해당 브랜드 캠페인 (다중 선택 가능)</Label>
                {brandCampaigns.length > 0 ? (
                  <div className="space-y-1">
                    {brandCampaigns.map(c => (
                      <label key={c.id} className={`flex items-center gap-3 p-2 border cursor-pointer ${selectedCampaignIds.includes(c.id) ? "border-[#7c3aed] bg-[#f3f0ff]" : "border-gray-200"}`}>
                        <input type="checkbox" checked={selectedCampaignIds.includes(c.id)} onChange={() => toggleCampaign(c.id)} className="accent-[#7c3aed]" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{c.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{c.creator} · {c.period}</span>
                        </div>
                        <span className="text-xs font-medium">{formatKRW(c.revenue)}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">해당 브랜드의 완료된 캠페인이 없습니다</p>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-4 py-1.5 text-xs bg-white text-gray-600 border border-gray-300">
                <ChevronLeft className="h-3 w-3 inline" /> 이전
              </button>
              <button
                onClick={() => selectedCampaignIds.length > 0 && setStep("report")}
                disabled={selectedCampaignIds.length === 0}
                className={`px-4 py-1.5 text-xs border-0 ${selectedCampaignIds.length > 0 ? "bg-[#7c3aed] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                리포트 조회
              </button>
            </div>
          </div>
        )}

        {/* ─── 리포트: 크리에이터 기준 ─── */}
        {step === "report" && viewType === "creator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-[#7c3aed] border-[#7c3aed]">크리에이터 기준</Badge>
                <span className="font-medium">{MOCK_CREATORS.find(c => c.id === selectedCreatorId)?.name}</span>
                <span className="text-muted-foreground">· {selectedCampaignIds.length}개 캠페인 · {startDate} ~ {endDate}</span>
              </div>
              <button onClick={resetFlow} className="px-3 py-1 text-xs bg-white text-gray-600 border border-gray-300">새 조회</button>
            </div>

            {/* 탭: 캠페인 인사이트 | 리워드 링크 인사이트 */}
            <div className="flex gap-0 border-b">
              <button
                onClick={() => setReportTab("campaign")}
                className={`px-4 py-2 text-xs font-medium border-b-2 ${reportTab === "campaign" ? "border-[#7c3aed] text-[#7c3aed]" : "border-transparent text-gray-500"}`}
              >
                캠페인 인사이트
              </button>
              <button
                onClick={() => setReportTab("reward-link")}
                className={`px-4 py-2 text-xs font-medium border-b-2 ${reportTab === "reward-link" ? "border-[#7c3aed] text-[#7c3aed]" : "border-transparent text-gray-500"}`}
              >
                리워드 링크 인사이트
              </button>
            </div>

            {reportTab === "campaign" && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard title="총 매출" value={formatKRW(MOCK_CREATOR_REPORT.summary.totalRevenue)} icon={TrendingUp} />
                  <StatsCard title="총 주문수" value={formatNumber(MOCK_CREATOR_REPORT.summary.totalOrders)} icon={ShoppingCart} />
                  <StatsCard title="평균 전환율" value={`${MOCK_CREATOR_REPORT.summary.avgConversion}%`} icon={BarChart3} />
                  <StatsCard title="총 콘텐츠" value={`${MOCK_CREATOR_REPORT.summary.contentCount}건`} icon={Package} />
                </div>

                {/* 전체 캠페인 리스트 (MD 전용) */}
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="text-base otr-section-marker">◆ 전체 캠페인 내역</CardTitle>
                    <CardDescription>MD는 해당 크리에이터의 전체 캠페인을 열람할 수 있습니다</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>캠페인명</TableHead>
                          <TableHead className="text-right">매출</TableHead>
                          <TableHead className="text-right">주문수</TableHead>
                          <TableHead className="text-right">전환율</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_CREATOR_REPORT.topCampaigns.map((c, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm font-medium">{c.name}</TableCell>
                            <TableCell className="text-right text-sm">{formatKRW(c.revenue)}</TableCell>
                            <TableCell className="text-right text-sm">{c.orders.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-sm">{c.conversion}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* 콘텐츠 인게이지먼트 Top 5 */}
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="text-base otr-section-marker">◆ 콘텐츠 인게이지먼트 Top 5</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={MOCK_CREATOR_REPORT.engagementTop5} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="engagement" fill="#7c3aed" name="참여점수" radius={[0, 0, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* 콘텐츠 유형 분포 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="rounded-none">
                    <CardHeader>
                      <CardTitle className="text-base otr-section-marker">◆ 콘텐츠 유형 분포</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={MOCK_CREATOR_REPORT.contentTypeDist} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {MOCK_CREATOR_REPORT.contentTypeDist.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* 시간 추이 */}
                  <Card className="rounded-none">
                    <CardHeader>
                      <CardTitle className="text-base otr-section-marker">◆ 시간 추이</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={MOCK_CREATOR_REPORT.timeTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="engagement" stroke="#7c3aed" name="참여수" strokeWidth={2} />
                          <Line type="monotone" dataKey="conversions" stroke="#f43f5e" name="전환수" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {reportTab === "reward-link" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard title="총 클릭" value={formatNumber(114000)} icon={BarChart3} />
                  <StatsCard title="총 주문" value={formatNumber(7200)} icon={ShoppingBag} />
                  <StatsCard title="전환율" value="6.3%" icon={TrendingUp} />
                  <StatsCard title="총 매출" value={formatKRW(216000000)} icon={Package} />
                </div>

                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="text-base otr-section-marker">◆ 리워드 링크 상품 성과</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>상품명</TableHead>
                          <TableHead className="text-right">클릭수</TableHead>
                          <TableHead className="text-right">주문수</TableHead>
                          <TableHead className="text-right">매출</TableHead>
                          <TableHead className="text-right">전환율</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_CREATOR_REPORT.rewardLinkProducts.map((p, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm font-medium">{p.product}</TableCell>
                            <TableCell className="text-right text-sm">{formatNumber(p.clicks)}</TableCell>
                            <TableCell className="text-right text-sm">{formatNumber(p.orders)}</TableCell>
                            <TableCell className="text-right text-sm">{formatKRW(p.revenue)}</TableCell>
                            <TableCell className="text-right text-sm">{p.conversion}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* 리워드링크 시간 추이 */}
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="text-base otr-section-marker">◆ 리워드 링크 추이</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={MOCK_CREATOR_REPORT.timeTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="clicks" stroke="#7c3aed" name="클릭수" strokeWidth={2} />
                        <Line type="monotone" dataKey="conversions" stroke="#f43f5e" name="전환수" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* ─── 리포트: 브랜드 기준 (6개 섹션) ─── */}
        {step === "report" && viewType === "brand" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-[#7c3aed] border-[#7c3aed]">브랜드 기준</Badge>
                <span className="font-medium">{MOCK_BRANDS.find(b => b.id === selectedBrand)?.name}</span>
                <span className="text-muted-foreground">· {selectedCampaignIds.length}개 캠페인 · {startDate} ~ {endDate}</span>
              </div>
              <button onClick={resetFlow} className="px-3 py-1 text-xs bg-white text-gray-600 border border-gray-300">새 조회</button>
            </div>

            {/* 섹션 1: 성과 상위 캠페인 TOP 5 */}
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-base otr-section-marker flex items-center gap-2">
                  <Award className="h-4 w-4" /> ◆ 성과 상위 캠페인 TOP 5
                </CardTitle>
                <CardDescription>해당 브랜드 캠페인 중 매출 기준 상위</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">순위</TableHead>
                      <TableHead>캠페인명</TableHead>
                      <TableHead>기간</TableHead>
                      <TableHead className="text-right">매출</TableHead>
                      <TableHead className="text-right">주문건수</TableHead>
                      <TableHead className="text-right">전환율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBrandTopCampaigns.map(c => (
                      <TableRow key={c.rank}>
                        <TableCell className="font-bold text-[#7c3aed]">{c.rank}</TableCell>
                        <TableCell className="text-sm font-medium">{c.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.period}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{formatKRW(c.revenue)}</TableCell>
                        <TableCell className="text-right text-sm">{c.orders.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm">{c.conversion}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 섹션 2: 협업 크리에이터 TOP 5 */}
            <div>
              <div className="mb-3">
                <h3 className="text-base font-semibold otr-section-marker flex items-center gap-2">
                  <Users className="h-4 w-4" /> ◆ 협업 크리에이터 TOP 5
                </h3>
                <p className="text-xs text-muted-foreground">[활용 TIP] 상위 협업 크리에이터의 오디언스 특성을 분석해 보세요</p>
              </div>
              <div className="grid md:grid-cols-5 gap-3">
                {mockBrandTopCreators.map((cr, i) => (
                  <Card key={cr.id} className="rounded-none">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-xs font-bold text-[#7c3aed]">{i + 1}</div>
                        <div>
                          <p className="text-sm font-bold">{cr.name}</p>
                          <p className="text-[10px] text-muted-foreground">{cr.handle}</p>
                        </div>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">오디언스</span>
                          <span>{cr.audienceAge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">성별</span>
                          <span>여 {cr.audienceGender.female}% / 남 {cr.audienceGender.male}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">브랜드 협업</span>
                          <span className="font-medium">{cr.brandCollabCount}회</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">전체 협업</span>
                          <span>{cr.totalCollabCount}회</span>
                        </div>
                      </div>
                      <button className="w-full text-[10px] text-[#7c3aed] border border-[#7c3aed] py-1 flex items-center justify-center gap-1">
                        프로필 보기 <ExternalLink className="h-2.5 w-2.5" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 섹션 3: 반복구매 주기 */}
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-base otr-section-marker flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" /> ◆ 반복구매 주기
                </CardTitle>
                <CardDescription>동일 카테고리(대-중-소-세 레벨 일치) 상품 반복구매 주기 분석</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상품 카테고리</TableHead>
                      <TableHead className="text-right">평균 재구매 주기</TableHead>
                      <TableHead className="w-48">비율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRepurchaseCycle.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{r.category}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{r.avgDays}일</TableCell>
                        <TableCell><Progress value={(1 - r.avgDays / 90) * 100} className="h-2" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 섹션 4: 콘텐츠 인게이지먼트 상위 TOP 20 */}
            <div>
              <div className="mb-3">
                <h3 className="text-base font-semibold otr-section-marker flex items-center gap-2">
                  <Star className="h-4 w-4" /> ◆ 콘텐츠 인게이지먼트 상위 TOP 20
                </h3>
                <p className="text-xs text-muted-foreground">온트너(TOP 5)보다 넓은 범위 · 캠페인명 + 크리에이터명 + 상세 지표 + 댓글 키워드</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>캠페인</TableHead>
                      <TableHead>크리에이터</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead className="text-right">좋아요</TableHead>
                      <TableHead className="text-right">댓글</TableHead>
                      <TableHead className="text-right">조회수</TableHead>
                      <TableHead className="text-right">저장</TableHead>
                      <TableHead>주요 키워드</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEngagementTop20.map(e => (
                      <TableRow key={e.rank}>
                        <TableCell className="font-bold text-[#7c3aed] text-xs">{e.rank}</TableCell>
                        <TableCell className="text-xs">{e.campaign}</TableCell>
                        <TableCell className="text-xs font-medium">{e.creator}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[9px]">{e.type}</Badge></TableCell>
                        <TableCell className="text-right text-xs">{e.likes.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-xs">{e.comments.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-xs">{e.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-xs">{e.saves.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-0.5 flex-wrap">
                            {e.keywords.map(kw => (
                              <Badge key={kw} variant="secondary" className="text-[9px]">{kw}</Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 섹션 5: 캠페인 구매 분석 */}
            <div>
              <div className="mb-3">
                <h3 className="text-base font-semibold otr-section-marker flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" /> ◆ 캠페인 구매 분석
                </h3>
              </div>

              {/* 5a: 연령/성별 */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="text-sm">a) 구매 고객 연령대/성별</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={mockPurchaseAnalysis.ageGender}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="female" fill="#f43f5e" name="여성" stackId="g" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="male" fill="#6366f1" name="남성" stackId="g" radius={[0, 0, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* 5b: 리텐션 */}
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="text-sm">b) 고객 리텐션</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-3xl font-bold text-[#7c3aed]">{mockPurchaseAnalysis.retentionRate}%</p>
                      <p className="text-xs text-muted-foreground mt-1">캠페인 간 교차 재구매 비율</p>
                    </div>
                    <div className="border p-3 space-y-2">
                      <p className="text-xs font-medium">재구매 여부 분석</p>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-[#7c3aed]/10 p-2 text-center">
                          <p className="text-sm font-bold">2,665명</p>
                          <p className="text-[10px] text-muted-foreground">재구매 고객</p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-2 text-center">
                          <p className="text-sm font-bold">5,535명</p>
                          <p className="text-[10px] text-muted-foreground">단회 구매</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 5c: 리뷰 키워드 */}
              <Card className="rounded-none mb-6">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" /> c) 판매 상품 리뷰 연관 키워드
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center py-4">
                    {mockPurchaseAnalysis.reviewKeywords.map(kw => {
                      const fontSize = Math.max(12, Math.min(32, kw.weight * 0.35));
                      const opacity = Math.max(0.4, kw.weight / 100);
                      return (
                        <span key={kw.text} className="text-[#7c3aed] font-medium" style={{ fontSize: `${fontSize}px`, opacity }}>
                          {kw.text}
                        </span>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 5d: 오디언스 대비 구매전환 */}
              <Card className="rounded-none">
                <CardHeader>
                  <CardTitle className="text-sm">d) 오디언스 대비 구매전환수 인사이트</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border p-3 text-center">
                      <p className="text-xs text-muted-foreground">오디언스 도달</p>
                      <p className="text-lg font-bold">{formatNumber(mockPurchaseAnalysis.conversionInsight.audienceReach)}</p>
                    </div>
                    <div className="border p-3 text-center">
                      <p className="text-xs text-muted-foreground">구매 전환</p>
                      <p className="text-lg font-bold">{formatNumber(mockPurchaseAnalysis.conversionInsight.purchaseCount)}</p>
                    </div>
                    <div className="border p-3 text-center">
                      <p className="text-xs text-muted-foreground">전환율</p>
                      <p className="text-lg font-bold text-[#7c3aed]">{mockPurchaseAnalysis.conversionInsight.conversionRate}%</p>
                    </div>
                    <div className="border p-3 text-center">
                      <p className="text-xs text-muted-foreground">객단가</p>
                      <p className="text-lg font-bold">{formatKRW(mockPurchaseAnalysis.conversionInsight.avgOrderValue)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 p-2 bg-gray-50 border-l-2 border-[#7c3aed]">
                    전체 오디언스 도달 {formatNumber(mockPurchaseAnalysis.conversionInsight.audienceReach)}명 대비 실제 구매 전환은 {formatNumber(mockPurchaseAnalysis.conversionInsight.purchaseCount)}건으로, 전환율 {mockPurchaseAnalysis.conversionInsight.conversionRate}%를 기록하였습니다. 평균 객단가 {formatKRW(mockPurchaseAnalysis.conversionInsight.avgOrderValue)} 기준, 콘텐츠 도달 대비 구매 효율이 양호한 수준입니다.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 섹션 6: 하단 추천 모듈 - 협업 추천 크리에이터 */}
            <Card className="rounded-none border-[#7c3aed]/30 bg-[#f3f0ff]/30">
              <CardHeader>
                <CardTitle className="text-base otr-section-marker flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#7c3aed]" /> ◆ 협업 추천 크리에이터
                </CardTitle>
                <CardDescription>해당 브랜드와 유사한 카테고리 · 오디언스 기반 추천</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-3">
                  {mockCreatorRecommendations.map(cr => (
                    <div key={cr.id} className="border bg-white p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">{cr.score}</div>
                        <div>
                          <p className="text-sm font-bold">{cr.name}</p>
                          <p className="text-[10px] text-muted-foreground">{cr.handle}</p>
                        </div>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p><span className="text-muted-foreground">카테고리:</span> {cr.category}</p>
                        <p><span className="text-muted-foreground">팔로워:</span> {formatNumber(cr.followers)}</p>
                        <p><span className="text-muted-foreground">ER:</span> {cr.engagementRate}%</p>
                      </div>
                      <p className="text-[10px] text-[#7c3aed] bg-[#f3f0ff] p-1">{cr.reason}</p>
                      <button className="w-full text-[10px] text-white bg-[#7c3aed] py-1">제안하기</button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
