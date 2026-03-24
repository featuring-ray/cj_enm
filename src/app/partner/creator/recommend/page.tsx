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

// --- Types ---

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

interface RecCreator {
  creatorId: string;
  score: number;
  reason: string;
  categoryMatch: boolean;
  brandSimilarity: boolean;
  coPurchaseStatus: boolean;
  engagementScore: number;
  salesScore: number | null;
  avgComments: number;
  avgViews: number;
  ontnerCampaignCount: number;
  cumulativeSales: number | null;
}

interface MockRecommendation {
  campaignId: string;
  creators: RecCreator[];
  updatedAt: string;
}

// --- Data ---

const CREATORS = rawCreators as MockCreator[];
const ONTNER_CREATORS = CREATORS.filter((c) => c.isOntnerMember);
const CAMPAIGNS = rawCampaigns as MockCampaign[];
const RECOMMENDATIONS = rawRecommendations as MockRecommendation[];

// --- Helpers ---

function getCreator(id: string) {
  return ONTNER_CREATORS.find((c) => c.id === id);
}

function formatNumber(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString();
}

function formatCurrency(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const tierColors: Record<string, string> = {
  GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
  SILVER: "bg-gray-100 text-gray-700 border-gray-300",
  BRONZE: "bg-orange-100 text-orange-800 border-orange-300",
};

// --- Component ---

export default function PartnerCreatorRecommendPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(
    CAMPAIGNS[0]?.id ?? ""
  );
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const recommendation = useMemo(
    () =>
      RECOMMENDATIONS.find((r) => r.campaignId === selectedCampaignId) ??
      RECOMMENDATIONS[0] ??
      null,
    [selectedCampaignId]
  );

  const selectedCampaign = CAMPAIGNS.find((c) => c.id === selectedCampaignId);

  const topCreators = useMemo(() => {
    if (!recommendation?.creators) return [];
    return recommendation.creators
      .filter((rec) => {
        const creator = getCreator(rec.creatorId);
        return !!creator;
      })
      .slice(0, 10);
  }, [recommendation]);

  function toggleBookmark(creatorId: string) {
    setBookmarked((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  }

  const moreLink = useMemo(() => {
    if (!selectedCampaign) return "/partner/creator";
    const cats = selectedCampaign.brandCategory;
    const brand = selectedCampaign.brand;
    return `/partner/creator?categories=${encodeURIComponent(cats)}&brand=${encodeURIComponent(brand)}`;
  }, [selectedCampaign]);

  return (
    <>
      <PageHeader
        title="크리에이터 추천"
        description="P-B-01 · 캠페인 기반 최적 크리에이터 Top 10 추천 (온트너 회원 한정)"
      />

      <div className="p-6 space-y-6">
        {/* Campaign Selector */}
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  캠페인 선택
                </label>
                <Select
                  value={selectedCampaignId}
                  onValueChange={setSelectedCampaignId}
                >
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
                <p className="text-[10px] text-muted-foreground mb-0.5">
                  배치 업데이트
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {recommendation
                    ? formatDateTime(recommendation.updatedAt)
                    : "-"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OnTner Members Only Warning */}
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">
            파트너 계정은 <span className="font-semibold">온트너 회원</span>{" "}
            크리에이터만 추천/조회할 수 있습니다. 비회원 크리에이터는 추천
            목록에서 제외됩니다.
          </p>
        </div>

        {/* Result Header */}
        {selectedCampaign && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold">
                {selectedCampaign.name}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {selectedCampaign.brand}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {selectedCampaign.brandCategory}
              </Badge>
              <span className="text-xs text-muted-foreground">
                · 추천 크리에이터 TOP {topCreators.length}
              </span>
            </div>
          </div>
        )}

        {/* Recommendation Cards */}
        {topCreators.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm text-muted-foreground">
                해당 캠페인에 대한 추천 크리에이터가 없습니다.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {topCreators.map((rec, idx) => {
              const creator = getCreator(rec.creatorId);
              if (!creator) return null;
              const isBookmarked = bookmarked.includes(creator.id);
              const isSalesOnly = rec.salesScore !== null;

              return (
                <Card key={rec.creatorId} className="overflow-hidden">
                  <CardContent className="pt-4 pb-4 px-5">
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className="flex flex-col items-center gap-1 w-10 shrink-0 pt-1">
                        <span
                          className={`text-2xl font-extrabold leading-none ${
                            idx < 3 ? "text-purple-600" : "text-gray-400"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        {idx < 3 && (
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Row 1: Avatar + name + score */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-11 w-11">
                              <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-semibold">
                                {creator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/partner/creator/${creator.id}`}
                                  className="text-sm font-semibold hover:underline"
                                >
                                  {creator.name}
                                </Link>
                                <Badge
                                  className={`text-[9px] px-1.5 py-0 h-4 border ${
                                    tierColors[creator.tier] || ""
                                  }`}
                                >
                                  {creator.tier}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                @{creator.handle}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {creator.category.map((cat) => (
                                  <Badge
                                    key={cat}
                                    variant="outline"
                                    className="text-[9px] px-1.5 py-0"
                                  >
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Follower + ER */}
                          <div className="flex items-center gap-4 shrink-0 text-right">
                            <div>
                              <p className="text-[10px] text-muted-foreground">
                                팔로워
                              </p>
                              <p className="text-sm font-semibold">
                                {formatNumber(creator.followers)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground">
                                ER
                              </p>
                              <p className="text-sm font-semibold text-blue-600">
                                {creator.engagementRate}%
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Row 2: Scores */}
                        <div className="flex items-center gap-6">
                          {/* Total Score */}
                          <div className="flex items-center gap-2.5 min-w-[160px]">
                            <div>
                              <p className="text-[10px] text-muted-foreground mb-0.5">
                                추천 점수
                              </p>
                              <span className="text-xl font-bold text-purple-700">
                                {rec.score}
                              </span>
                            </div>
                            <Progress
                              value={rec.score}
                              className="h-1.5 flex-1"
                            />
                          </div>

                          <Separator orientation="vertical" className="h-8" />

                          {/* Engagement Score */}
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground mb-0.5">
                              인게이지 점수
                            </p>
                            <span className="text-sm font-semibold text-blue-600">
                              {rec.engagementScore.toFixed(1)}
                            </span>
                          </div>

                          <Separator orientation="vertical" className="h-8" />

                          {/* Sales Score */}
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground mb-0.5">
                              매출 점수
                            </p>
                            {isSalesOnly ? (
                              <span className="text-sm font-semibold text-green-600">
                                {rec.salesScore!.toFixed(1)}
                              </span>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-[9px] bg-blue-50 text-blue-700"
                              >
                                인게이지 100%
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Separator />

                        {/* Row 3: Reason badges */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-muted-foreground mr-1">
                            추천 사유:
                          </span>
                          {rec.categoryMatch && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-blue-50 text-blue-700"
                            >
                              카테고리 일치
                            </Badge>
                          )}
                          {rec.brandSimilarity && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-cyan-50 text-cyan-700"
                            >
                              브랜드 유사
                            </Badge>
                          )}
                          {rec.coPurchaseStatus && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-orange-50 text-orange-700"
                            >
                              공구 진행
                            </Badge>
                          )}
                          {!rec.categoryMatch &&
                            !rec.brandSimilarity &&
                            !rec.coPurchaseStatus && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-gray-50 text-gray-600"
                              >
                                {rec.reason}
                              </Badge>
                            )}
                        </div>

                        {/* Row 4: Stats grid */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="bg-gray-50 rounded-md px-3 py-2">
                            <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              평균 댓글
                            </p>
                            <p className="text-sm font-semibold">
                              {formatNumber(rec.avgComments)}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-md px-3 py-2">
                            <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              평균 조회수
                            </p>
                            <p className="text-sm font-semibold">
                              {formatNumber(rec.avgViews)}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-md px-3 py-2">
                            <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              온트너 캠페인 수
                            </p>
                            <p className="text-sm font-semibold">
                              {rec.ontnerCampaignCount}회
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-md px-3 py-2">
                            <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              누적 매출
                            </p>
                            <p className="text-sm font-semibold">
                              {rec.cumulativeSales !== null
                                ? formatCurrency(rec.cumulativeSales)
                                : "-"}
                            </p>
                          </div>
                        </div>

                        {/* Row 5: Actions */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 ${
                              isBookmarked ? "text-yellow-500" : ""
                            }`}
                            onClick={() => toggleBookmark(creator.id)}
                          >
                            <Bookmark
                              className={`h-4 w-4 ${
                                isBookmarked ? "fill-yellow-500" : ""
                              }`}
                            />
                          </Button>
                          <Link href={`/partner/creator/${creator.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                            >
                              상세 보기
                              <ChevronRight className="h-3 w-3 ml-1" />
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

        {/* More Button */}
        {topCreators.length > 0 && (
          <div className="flex justify-center pt-2">
            <Link href={moreLink}>
              <Button variant="outline" className="text-sm">
                더보기 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* Algorithm Explanation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              추천 알고리즘 안내
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <p>
              크리에이터 추천은 캠페인의 브랜드 카테고리, 타겟 오디언스, 과거
              성과 데이터를 기반으로 AI가 최적의 크리에이터를 매칭합니다.
            </p>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-foreground mb-1">
                  인게이지먼트 점수
                </p>
                <p>
                  팔로워 수, 평균 좋아요, 평균 댓글, 평균 조회수를 종합하여
                  크리에이터의 오디언스 반응도를 측정합니다. 매출 데이터가 없는
                  경우 인게이지먼트 점수가 100%로 반영됩니다.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">매출 점수</p>
                <p>
                  온트너 캠페인 누적 매출, 공동구매 성과, 평균 판매 실적을
                  기반으로 실질적인 구매 전환 능력을 평가합니다.
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="font-medium text-foreground mb-1">추천 사유 태그</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-blue-50 text-blue-700"
                >
                  카테고리 일치
                </Badge>
                <span>캠페인 카테고리와 크리에이터 활동 카테고리 일치</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-cyan-50 text-cyan-700"
                >
                  브랜드 유사
                </Badge>
                <span>유사 브랜드 캠페인 참여 이력 보유</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-orange-50 text-orange-700"
                >
                  공구 진행
                </Badge>
                <span>공동구매 진행 경험 및 실적 보유</span>
              </div>
            </div>
            <Separator />
            <p className="text-[11px]">
              배치 업데이트: 매일 오전 3시에 추천 데이터가 갱신됩니다. 추천
              점수는 최근 90일 데이터를 기반으로 산출됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
