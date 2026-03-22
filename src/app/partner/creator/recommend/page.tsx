"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  RefreshCw,
  ChevronRight,
  Star,
  TrendingUp,
  Users,
  BarChart3,
  Bookmark,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import rawCreators from "@/data/mock/creators.json";
import rawCampaigns from "@/data/mock/campaigns.json";
import rawRecommendations from "@/data/mock/recommendations.json";

// ─── 타입 ──────────────────────────────────────────

interface MockCreator {
  id: string;
  handle: string;
  name: string;
  followers: number;
  engagementRate: number;
  category: string[];
  isOntnerMember: boolean;
  tier: string;
  ontnerCampaignCount?: number;
}

interface MockCampaign {
  id: string;
  name: string;
  brand: string;
  brandCategory: string;
  status: string;
}

interface MockRecommendation {
  campaignId: string;
  creators: { creatorId: string; score: number; reason: string }[];
  updatedAt: string;
}

const CREATORS = (rawCreators as MockCreator[]).filter((c) => c.isOntnerMember);
const CAMPAIGNS = rawCampaigns as MockCampaign[];
const RECOMMENDATIONS = rawRecommendations as MockRecommendation[];

const BATCH_DATE = "2026-03-22 03:00";

function getCreator(id: string) {
  return CREATORS.find((c) => c.id === id);
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString();
}

const reasonLabels: Record<string, { label: string; color: string }> = {
  성과유사: { label: "성과 유사", color: "bg-purple-100 text-purple-800" },
  카테고리유사: { label: "카테고리 유사", color: "bg-blue-100 text-blue-800" },
  카테고리일치: { label: "카테고리 일치", color: "bg-blue-100 text-blue-800" },
  구매기반: { label: "구매 기반", color: "bg-green-100 text-green-800" },
  브랜드유사: { label: "브랜드 유사", color: "bg-cyan-100 text-cyan-800" },
  공구진행: { label: "공구 진행", color: "bg-orange-100 text-orange-800" },
};

const tierColors: Record<string, string> = {
  GOLD: "bg-yellow-100 text-yellow-800",
  SILVER: "bg-gray-100 text-gray-700",
  BRONZE: "bg-orange-100 text-orange-800",
};

// ─── 메인 컴포넌트 ──────────────────────────────────────

export default function PartnerCreatorRecommendPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(CAMPAIGNS[0]?.id ?? "");
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const recommendation = useMemo(
    () => RECOMMENDATIONS.find((r) => r.campaignId === selectedCampaignId) ?? RECOMMENDATIONS[0] ?? null,
    [selectedCampaignId]
  );

  const selectedCampaign = CAMPAIGNS.find((c) => c.id === selectedCampaignId);

  // 온트너 회원만 필터링하여 Top 10
  const topCreators = useMemo(() => {
    if (!recommendation?.creators) return [];
    return recommendation.creators
      .filter((rec) => {
        const creator = getCreator(rec.creatorId);
        return creator?.isOntnerMember;
      })
      .slice(0, 10);
  }, [recommendation]);

  function toggleBookmark(creatorId: string) {
    setBookmarked((prev) =>
      prev.includes(creatorId) ? prev.filter((id) => id !== creatorId) : [...prev, creatorId]
    );
  }

  return (
    <>
      <PageHeader
        title="크리에이터 추천"
        description="P-B-01 · 캠페인 기반 최적 크리에이터 Top 10 추천 (온트너 회원 한정)"
      />

      <div className="p-6 space-y-6">
        {/* ─── 캠페인 선택 ─── */}
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">캠페인 선택</label>
                <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="캠페인을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPAIGNS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        [{c.brandCategory}] {c.name} ({c.brand})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground mb-0.5">배치 업데이트</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {BATCH_DATE}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── 결과 헤더 ─── */}
        {selectedCampaign && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold">{selectedCampaign.name}</span>
              <Badge variant="outline" className="text-[10px]">{selectedCampaign.brand}</Badge>
              <span className="text-xs text-muted-foreground">· 추천 크리에이터 TOP {topCreators.length}</span>
            </div>
            <Link href="/partner/creator">
              <Button variant="outline" size="sm" className="text-xs">
                추천 조건으로 탐색 <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* ─── 온트너 회원 한정 안내 ─── */}
        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">
            파트너 계정은 온트너 회원 크리에이터만 추천/조회할 수 있습니다.
          </p>
        </div>

        {/* ─── 추천 결과 카드 ─── */}
        {topCreators.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm text-muted-foreground">해당 캠페인에 대한 추천 크리에이터가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {topCreators.map((rec, idx) => {
              const creator = getCreator(rec.creatorId);
              if (!creator) return null;
              const rl = reasonLabels[rec.reason] || { label: rec.reason, color: "bg-gray-100 text-gray-800" };
              const engScore = (rec.score * 0.6).toFixed(1);
              const salesScore = (rec.score * 0.4).toFixed(1);
              const isBookmarked = bookmarked.includes(creator.id);

              return (
                <Card key={rec.creatorId}>
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-start gap-4">
                      {/* 순위 */}
                      <div className="flex flex-col items-center gap-1 w-8 shrink-0">
                        <span className={`text-lg font-bold ${idx < 3 ? "text-purple-600" : "text-gray-400"}`}>
                          {idx + 1}
                        </span>
                        {idx < 3 && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                      </div>

                      {/* 프로필 */}
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-sm">
                            {creator.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Link href={`/partner/creator/${creator.id}`} className="text-sm font-medium hover:underline">
                              {creator.name}
                            </Link>
                            <Badge className={`text-[9px] px-1 py-0 h-4 ${tierColors[creator.tier] || ""}`}>
                              {creator.tier}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">@{creator.handle} · {formatNumber(creator.followers)} 팔로워</p>
                          <div className="flex gap-1 mt-0.5">
                            {creator.category.map((cat) => (
                              <Badge key={cat} variant="outline" className="text-[9px] px-1 py-0">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 점수 */}
                      <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">추천 점수</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-purple-700">{rec.score}</span>
                            <Progress value={rec.score} className="h-1.5 flex-1" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">인게이지먼트 (60%)</p>
                          <span className="text-sm font-semibold text-blue-600">{engScore}</span>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">매출 실적 (40%)</p>
                          <span className="text-sm font-semibold text-green-600">{salesScore}</span>
                        </div>
                      </div>

                      {/* 추천 사유 & 액션 */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant="secondary" className={`text-[10px] ${rl.color}`}>
                          {rl.label}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 w-7 p-0 ${isBookmarked ? "text-yellow-500" : ""}`}
                            onClick={() => toggleBookmark(creator.id)}
                          >
                            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-yellow-500" : ""}`} />
                          </Button>
                          <Link href={`/partner/creator/${creator.id}`}>
                            <Button variant="outline" size="sm" className="h-7 text-[10px]">
                              상세 보기
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
