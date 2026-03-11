"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Heart,
  MessageCircle,
  Bookmark,
  X,
  ChevronRight,
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

function getCreatorName(creatorId: string) {
  const creator = mockCreatorsJson.find((c) => c.id === creatorId);
  return creator?.name || creatorId;
}

function getCampaignsByContent(content: Content) {
  if (content.campaignId) {
    const campaign = mockCampaignsJson.find((c) => c.id === content.campaignId);
    return campaign ? [campaign] : [];
  }
  // Find campaigns in same category
  return mockCampaignsJson.filter(
    (c) => c.brandCategory === content.category && c.status !== "완료"
  );
}

export default function ContentPage() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [category, setCategory] = useState("전체");
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
  }, [category]);

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    setSheetOpen(true);
  };

  const relatedCampaigns = selectedContent
    ? getCampaignsByContent(selectedContent)
    : [];

  return (
    <>
      <PageHeader
        title="뜨는 공구 콘텐츠 Top 50"
        description="참여도 순 인기 콘텐츠 랭킹"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Category Filter Tabs */}
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex flex-wrap h-auto gap-1">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Content Ranking List */}
        <div className="space-y-3">
          {contents.map((content, index) => (
            <Card
              key={content.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleContentClick(content)}
            >
              <CardContent className="py-3">
                <div className="flex items-center gap-4">
                  {/* Rank */}
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

                  {/* Thumbnail */}
                  <div className="shrink-0 w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-[9px] text-muted-foreground text-center leading-tight px-1">
                      {content.thumbnail.split("/").pop()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {getCreatorName(content.creatorId)}
                      </span>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {content.type}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {content.platform}
                      </Badge>
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
                    </div>
                  </div>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-primary">
                      {content.engagementScore.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">점수</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {contents.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">
            해당 카테고리의 콘텐츠가 없습니다.
          </p>
        )}
      </main>

      {/* Side Panel - Related Campaigns */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>관련 캠페인</SheetTitle>
            <SheetDescription>
              {selectedContent && (
                <>
                  {getCreatorName(selectedContent.creatorId)} ·{" "}
                  {selectedContent.category} · 점수{" "}
                  {selectedContent.engagementScore.toFixed(1)}
                </>
              )}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[calc(100vh-140px)]">
            <div className="space-y-3 pr-4">
              {relatedCampaigns.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  관련 캠페인이 없습니다.
                </p>
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
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {campaign.name}
                            </span>
                            <Badge
                              variant={
                                campaign.status === "모집중" ? "default" : "secondary"
                              }
                              className="text-[10px] shrink-0"
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {campaign.brand} · {campaign.reward}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {campaign.startDate} ~ {campaign.endDate}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
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
