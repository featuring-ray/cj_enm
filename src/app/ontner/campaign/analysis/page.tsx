"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
  CalendarDays,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import campaignsData from "@/data/mock/campaigns.json";
import performanceData from "@/data/mock/performance.json";

// ─── 현재 크리에이터 (뷰티하나 - creator-1) 참여 캠페인 시뮬레이션 ───

interface CampaignInfo {
  id: string;
  name: string;
  brand: string;
  brandCategory: string;
  status: string;
  startDate: string;
  endDate: string;
  reward: string;
  contentCount: number;
}

interface PerformanceSummary {
  totalRevenue: number;
  confirmedRevenue?: number;
  totalOrders: number;
  contentCount: number;
  conversionRate: number;
}

const currentCreatorId = "creator-1";

// 크리에이터-1의 참여 캠페인 + 인게이지먼트 Mock
const campaignEngagement: Record<string, {
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  totalSaves: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  uploadedContents: number;
  targetContents: number;
}> = {
  "campaign-1": {
    totalLikes: 24500,
    totalComments: 1840,
    totalViews: 385000,
    totalSaves: 6200,
    trend: "up",
    trendPercent: 12.5,
    uploadedContents: 5,
    targetContents: 5,
  },
  "campaign-2": {
    totalLikes: 18200,
    totalComments: 1250,
    totalViews: 220000,
    totalSaves: 4100,
    trend: "up",
    trendPercent: 8.3,
    uploadedContents: 3,
    targetContents: 4,
  },
  "campaign-16": {
    totalLikes: 31200,
    totalComments: 2400,
    totalViews: 510000,
    totalSaves: 8900,
    trend: "stable",
    trendPercent: 0,
    uploadedContents: 6,
    targetContents: 6,
  },
};

// ─── 유틸리티 ──────────────────────────────────────────

function formatRevenue(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${Math.round(n / 10000).toLocaleString()}만`;
  return n.toLocaleString();
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString();
}

function getDaysRemaining(endDate: string) {
  const now = new Date("2026-03-22");
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function getDaysSinceEnd(endDate: string) {
  const now = new Date("2026-03-22");
  const end = new Date(endDate);
  return Math.floor((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
}

function getD14Status(endDate: string, confirmedRevenue?: number | null): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  const daysSince = getDaysSinceEnd(endDate);
  if (confirmedRevenue != null) return { label: "확정", variant: "default" };
  if (daysSince >= 0 && daysSince < 14) return { label: `정산 대기 (D+${daysSince})`, variant: "secondary" };
  return { label: "진행중", variant: "outline" };
}

const statusColors: Record<string, string> = {
  모집중: "bg-yellow-100 text-yellow-800",
  진행중: "bg-blue-100 text-blue-800",
  완료: "bg-green-100 text-green-800",
};

// ─── 메인 컴포넌트 ──────────────────────────────────────

export default function CampaignAnalysisPage() {
  // 크리에이터-1의 참여 캠페인 필터링
  const myCampaigns = useMemo(() => {
    return (campaignsData as CampaignInfo[]).filter((c) =>
      ["campaign-1", "campaign-2", "campaign-16"].includes(c.id)
    );
  }, []);

  const myPerformance = useMemo(() => {
    return (performanceData as { campaignId: string; creatorId: string; summary: PerformanceSummary }[]).filter(
      (p) => p.creatorId === currentCreatorId
    );
  }, []);

  // 상태별 분류
  const grouped = useMemo(() => {
    const result = { 진행중: [] as CampaignInfo[], 모집중: [] as CampaignInfo[], 완료: [] as CampaignInfo[] };
    myCampaigns.forEach((c) => {
      if (c.status in result) (result as Record<string, CampaignInfo[]>)[c.status].push(c);
    });
    return result;
  }, [myCampaigns]);

  // 종합 통계
  const totalStats = useMemo(() => {
    let revenue = 0;
    let orders = 0;
    let contents = 0;
    myPerformance.forEach((p) => {
      revenue += p.summary.totalRevenue;
      orders += p.summary.totalOrders;
      contents += p.summary.contentCount;
    });
    return { revenue, orders, contents, campaigns: myCampaigns.length };
  }, [myPerformance, myCampaigns]);

  return (
    <>
      <PageHeader
        title="참여 캠페인 현황 분석"
        description="O-C-08 · 참여 중인 캠페인들의 전체 현황을 한눈에 확인합니다."
      />

      <div className="p-6 space-y-6">
        {/* ─── 종합 통계 ─── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "참여 캠페인", value: `${totalStats.campaigns}개`, icon: CalendarDays, color: "text-purple-600" },
            { label: "누적 매출", value: `${formatRevenue(totalStats.revenue)}원`, icon: ShoppingCart, color: "text-green-600" },
            { label: "총 주문", value: `${totalStats.orders.toLocaleString()}건`, icon: BarChart3, color: "text-blue-600" },
            { label: "등록 콘텐츠", value: `${totalStats.contents}개`, icon: Eye, color: "text-orange-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                  <s.icon className={`h-8 w-8 ${s.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── 상태별 요약 ─── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { status: "진행중", count: grouped.진행중.length, icon: Clock, desc: "현재 진행 중인 캠페인", color: "border-blue-200 bg-blue-50/50" },
            { status: "모집중", count: grouped.모집중.length, icon: Users, desc: "참여 신청한 모집 캠페인", color: "border-yellow-200 bg-yellow-50/50" },
            { status: "완료", count: grouped.완료.length, icon: CheckCircle2, desc: "종료된 캠페인", color: "border-green-200 bg-green-50/50" },
          ].map((s) => (
            <Card key={s.status} className={`${s.color}`}>
              <CardContent className="pt-3 pb-2 px-4 flex items-center gap-3">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold">{s.count}개</p>
                  <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── 진행 중 캠페인 ─── */}
        {grouped.진행중.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              진행 중 캠페인
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {grouped.진행중.map((campaign) => {
                const perf = myPerformance.find((p) => p.campaignId === campaign.id);
                const eng = campaignEngagement[campaign.id];
                const daysLeft = getDaysRemaining(campaign.endDate);
                const d14 = getD14Status(campaign.endDate, perf?.summary?.confirmedRevenue);
                return (
                  <Card key={campaign.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={statusColors[campaign.status]} variant="secondary">
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">{campaign.brandCategory}</Badge>
                            {daysLeft > 0 && daysLeft <= 7 && (
                              <Badge variant="destructive" className="text-[10px]">
                                <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                                D-{daysLeft}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-base">{campaign.name}</CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {campaign.brand} · {campaign.startDate} ~ {campaign.endDate} · {campaign.reward}
                          </CardDescription>
                        </div>
                        <Link href="/ontner/performance">
                          <Button variant="outline" size="sm" className="text-xs">
                            성과 상세 <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* 인게이지먼트 스냅샷 */}
                        <div className="space-y-3">
                          <p className="text-xs font-medium text-muted-foreground">콘텐츠 인게이지먼트</p>
                          {eng && (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-muted-foreground">콘텐츠 업로드</span>
                                <span className="text-xs font-medium">{eng.uploadedContents}/{eng.targetContents}</span>
                                <Progress value={(eng.uploadedContents / eng.targetContents) * 100} className="flex-1 h-1.5" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { icon: Eye, label: "조회수", value: formatNumber(eng.totalViews) },
                                  { icon: Heart, label: "좋아요", value: formatNumber(eng.totalLikes) },
                                  { icon: MessageCircle, label: "댓글", value: formatNumber(eng.totalComments) },
                                  { icon: BarChart3, label: "저장", value: formatNumber(eng.totalSaves) },
                                ].map((m) => (
                                  <div key={m.label} className="flex items-center gap-1.5 text-xs">
                                    <m.icon className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">{m.label}</span>
                                    <span className="font-medium ml-auto">{m.value}</span>
                                  </div>
                                ))}
                              </div>
                              {eng.trend !== "stable" && (
                                <div className="flex items-center gap-1 text-[11px] mt-1">
                                  {eng.trend === "up" ? (
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                  )}
                                  <span className={eng.trend === "up" ? "text-green-600" : "text-red-600"}>
                                    전주 대비 {eng.trendPercent}% {eng.trend === "up" ? "증가" : "감소"}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {/* 매출 스냅샷 */}
                        <div className="space-y-3">
                          <p className="text-xs font-medium text-muted-foreground">매출 현황</p>
                          {perf ? (
                            <>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">총 매출</span>
                                  <span className="font-bold text-green-700">{formatRevenue(perf.summary.totalRevenue)}원</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">주문 건수</span>
                                  <span className="font-medium">{perf.summary.totalOrders.toLocaleString()}건</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">전환율</span>
                                  <span className="font-medium">{perf.summary.conversionRate}%</span>
                                </div>
                                <div className="flex justify-between text-xs items-center">
                                  <span className="text-muted-foreground">정산 상태</span>
                                  <Badge variant={d14.variant} className="text-[10px]">
                                    {d14.label}
                                  </Badge>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground">매출 데이터 집계 중...</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── 완료 캠페인 ─── */}
        {grouped.완료.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              완료 캠페인 성과 요약
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {grouped.완료.map((campaign) => {
                const perf = myPerformance.find((p) => p.campaignId === campaign.id);
                const eng = campaignEngagement[campaign.id];
                const d14 = getD14Status(campaign.endDate, perf?.summary?.confirmedRevenue);
                return (
                  <Card key={campaign.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={statusColors[campaign.status]} variant="secondary">
                              {campaign.status}
                            </Badge>
                            <Badge variant={d14.variant} className="text-[10px]">
                              <BadgeCheck className="h-2.5 w-2.5 mr-0.5" />
                              {d14.label}
                            </Badge>
                          </div>
                          <CardTitle className="text-base">{campaign.name}</CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {campaign.brand} · {campaign.startDate} ~ {campaign.endDate}
                          </CardDescription>
                        </div>
                        <Link href="/ontner/performance">
                          <Button variant="outline" size="sm" className="text-xs">
                            상세 보기 <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-5 gap-4">
                        {perf ? (
                          <>
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground mb-0.5">총 매출</p>
                              <p className="text-sm font-bold text-green-700">{formatRevenue(perf.summary.totalRevenue)}원</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground mb-0.5">확정 매출</p>
                              <p className="text-sm font-bold">
                                {perf.summary.confirmedRevenue
                                  ? `${formatRevenue(perf.summary.confirmedRevenue)}원`
                                  : "-"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground mb-0.5">주문 건수</p>
                              <p className="text-sm font-bold">{perf.summary.totalOrders.toLocaleString()}건</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground mb-0.5">전환율</p>
                              <p className="text-sm font-bold">{perf.summary.conversionRate}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground mb-0.5">콘텐츠</p>
                              <p className="text-sm font-bold">{perf.summary.contentCount}개</p>
                            </div>
                          </>
                        ) : (
                          <div className="col-span-5 text-center text-xs text-muted-foreground py-2">
                            성과 데이터 없음
                          </div>
                        )}
                      </div>
                      {/* 인게이지먼트 요약 */}
                      {eng && (
                        <>
                          <Separator className="my-3" />
                          <div className="flex items-center gap-6 text-xs">
                            <span className="text-muted-foreground">인게이지먼트:</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {formatNumber(eng.totalViews)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" /> {formatNumber(eng.totalLikes)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" /> {formatNumber(eng.totalComments)}
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" /> {formatNumber(eng.totalSaves)}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── 모집 중 캠페인 ─── */}
        {grouped.모집중.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-yellow-600" />
              모집 중 캠페인
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {grouped.모집중.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={statusColors[campaign.status]} variant="secondary">
                        {campaign.status}
                      </Badge>
                      <Link href={`/ontner/campaign/${campaign.id}`}>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                          상세 <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
                        </Button>
                      </Link>
                    </div>
                    <p className="text-sm font-medium mb-1">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">{campaign.brand} · {campaign.brandCategory}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {campaign.startDate} ~ {campaign.endDate}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">{campaign.reward}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
