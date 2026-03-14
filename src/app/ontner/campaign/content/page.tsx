"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Heart,
  MessageCircle,
  Bookmark,
  Eye,
  ChevronRight,
  Instagram,
  Youtube,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { featuringApi } from "@/lib/featuring-api";
import type { Content } from "@/types/content";
import mockCreatorsJson from "@/data/mock/creators.json";
import mockCampaignsJson from "@/data/mock/campaigns.json";

const CATEGORIES = ["전체", "뷰티", "푸드", "패션", "테크", "육아", "리빙", "헬스", "여행", "인테리어"];
const PERIODS = [
  { label: "1주일", value: "1w" },
  { label: "1개월", value: "1m" },
  { label: "3개월", value: "3m" },
  { label: "6개월", value: "6m" },
];

function getCreatorInfo(creatorId: string) {
  return mockCreatorsJson.find((c) => c.id === creatorId);
}

function getCampaignsByContent(content: Content) {
  if (content.campaignId) {
    const campaign = mockCampaignsJson.find((c) => c.id === content.campaignId);
    return campaign ? [campaign] : [];
  }
  return mockCampaignsJson.filter(
    (c) => c.brandCategory === content.category && c.status === "모집중"
  ).slice(0, 2);
}

export default function ContentTrendPage() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [category, setCategory] = useState("전체");
  const [period, setPeriod] = useState("1m");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await featuringApi.getContents({
        category: category === "전체" ? undefined : category,
        sortBy: "engagementScore",
        limit: 50,
      });
      setContents(data);
    }
    load();
  }, [category, period]);

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    setSheetOpen(true);
  };

  const relatedCampaigns = selectedContent ? getCampaignsByContent(selectedContent) : [];
  const selectedCreator = selectedContent ? getCreatorInfo(selectedContent.creatorId) : null;

  return (
    <>
      <PageHeader
        title="뜨는 공구 콘텐츠 Top 50"
        description="참여도 기반 인기 공구 콘텐츠 랭킹 · 콘텐츠 클릭 시 연관 캠페인을 확인하세요"
      />

      <main className="flex-1 p-4 md:p-6 space-y-4">
        {/* 필터 영역 */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 카테고리 필터 */}
          <Tabs value={category} onValueChange={setCategory} className="flex-1">
            <TabsList className="flex flex-wrap h-auto gap-1">
              {CATEGORIES.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* 기간 필터 */}
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              {PERIODS.map((p) => (
                <TabsTrigger key={p.value} value={p.value} className="text-xs">
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* 점수 기준 안내 */}
        <p className="text-xs text-muted-foreground">
          * 인게이지먼트 점수: 댓글 &gt; 공유 &gt; 릴스·피드 조회수 &gt; 좋아요 &gt; 팔로워 순 가중치 적용
        </p>

        {/* 콘텐츠 랭킹 목록 */}
        <div className="space-y-2">
          {contents.map((content, index) => {
            const creator = getCreatorInfo(content.creatorId);
            return (
              <Card
                key={content.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleContentClick(content)}
              >
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-4">
                    {/* 순위 */}
                    <div className="shrink-0 w-8 text-center">
                      {index < 3 ? (
                        <Trophy
                          className={`h-5 w-5 mx-auto ${
                            index === 0
                              ? "text-yellow-500"
                              : index === 1
                                ? "text-gray-400"
                                : "text-amber-600"
                          }`}
                        />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* 썸네일 */}
                    <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      {content.platform === "instagram" ? (
                        <Instagram className="h-5 w-5 text-pink-500" />
                      ) : (
                        <Youtube className="h-5 w-5 text-red-500" />
                      )}
                    </div>

                    {/* 콘텐츠 정보 */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">
                          {creator?.name || content.creatorId}
                        </span>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {content.type}
                        </Badge>
                        {content.platform === "instagram" ? (
                          <Badge className="text-[10px] shrink-0 bg-pink-500 hover:bg-pink-600">
                            Instagram
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] shrink-0 bg-red-500 hover:bg-red-600">
                            YouTube
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {content.category} · {new Date(content.postedAt).toLocaleDateString("ko-KR")}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {content.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {content.comments.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark className="h-3 w-3" />
                          {content.saves.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {content.shares.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* 점수 */}
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold text-primary">
                        {content.engagementScore.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">참여 점수</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {contents.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">
            해당 카테고리·기간의 콘텐츠가 없습니다.
          </p>
        )}
      </main>

      {/* 사이드 패널 - 연관 캠페인 */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[380px] sm:w-[440px]">
          <SheetHeader>
            <SheetTitle>연관 캠페인</SheetTitle>
            <SheetDescription>
              이 콘텐츠의 카테고리·상품과 매핑된 현재 모집 중인 캠페인입니다
            </SheetDescription>
          </SheetHeader>

          {/* 크리에이터 정보 */}
          {selectedCreator && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{selectedCreator.name}</p>
                  <p className="text-xs text-muted-foreground">
                    팔로워 {(selectedCreator.followers / 10000).toFixed(1)}만 · 참여율 {selectedCreator.engagementRate}%
                  </p>
                </div>
                <div className="text-right">
                  {(selectedCreator as { isOntnerMember?: boolean }).isOntnerMember ? (
                    <Badge variant="default" className="text-[10px]">온트너 회원</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">비회원</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <ScrollArea className="mt-4 h-[calc(100vh-260px)]">
            <div className="space-y-3 pr-4">
              {relatedCampaigns.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      현재 매핑된 모집 중인 캠페인이 없습니다
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => router.push("/ontner/campaign/explore")}
                    >
                      전체 캠페인 탐색
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                relatedCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => {
                      setSheetOpen(false);
                      router.push(`/ontner/campaign/${campaign.id}`);
                    }}
                  >
                    <CardHeader className="pb-2 pt-3 px-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm leading-snug">{campaign.name}</CardTitle>
                        <Badge
                          variant={campaign.status === "모집중" ? "default" : "secondary"}
                          className="text-[10px] shrink-0"
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {campaign.brand} · {campaign.brandCategory}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 px-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          보상: {campaign.reward}
                        </p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
