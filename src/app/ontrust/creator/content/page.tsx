"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Instagram,
  Youtube,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { featuringApi } from "@/lib/featuring-api";
import type { Content } from "@/types/content";
import mockCreatorsJson from "@/data/mock/creators.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = ["전체", "뷰티", "패션", "푸드", "테크", "리빙", "육아", "헬스", "여행", "인테리어"];

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString("ko-KR");
}

function getCreatorName(creatorId: string) {
  const creator = mockCreatorsJson.find((c) => c.id === creatorId);
  return creator?.name || "알 수 없음";
}

function getCreatorHandle(creatorId: string) {
  const creator = mockCreatorsJson.find((c) => c.id === creatorId);
  return creator?.handle || "";
}

export default function OntrustCreatorContentPage() {
  const [tab, setTab] = useState<"organic" | "ad">("organic");
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [sortBy, setSortBy] = useState<"engagementScore" | "likes" | "comments" | "postedAt">("engagementScore");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    async function fetchContents() {
      setLoading(true);
      try {
        const data = await featuringApi.getContents({
          category: categoryFilter === "전체" ? undefined : categoryFilter,
          sortBy,
          limit: 50,
        });
        setContents(data);
      } finally {
        setLoading(false);
      }
    }
    fetchContents();
  }, [categoryFilter, sortBy]);

  const filteredContents = contents.filter((c) => {
    if (tab === "organic") return c.type !== "광고";
    return c.type === "광고";
  });

  return (
    <>
      <PageHeader
        title="콘텐츠 탐색"
        description="뜨는 공구 콘텐츠 랭킹을 확인하세요"
      />

      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 메인 영역 */}
          <div className="flex-1 space-y-4">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "organic" | "ad")}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="organic">오가닉</TabsTrigger>
                  <TabsTrigger value="ad">광고</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engagementScore">인게이지먼트순</SelectItem>
                      <SelectItem value="likes">좋아요순</SelectItem>
                      <SelectItem value="comments">댓글순</SelectItem>
                      <SelectItem value="postedAt">최신순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="organic" className="mt-4" />
              <TabsContent value="ad" className="mt-4" />
            </Tabs>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-3">
                      <div className="aspect-video bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredContents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>해당 필터의 콘텐츠가 없습니다</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredContents.map((content, idx) => (
                  <Card
                    key={content.id}
                    className={`cursor-pointer hover:border-primary/50 transition-colors ${
                      selectedContent?.id === content.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedContent(content)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="aspect-video bg-muted rounded flex items-center justify-center relative">
                        <span className="text-4xl font-bold text-muted-foreground/20">
                          {idx + 1}
                        </span>
                        <div className="absolute top-2 left-2 flex gap-1">
                          {content.platform === "instagram" ? (
                            <Instagram className="w-4 h-4 text-pink-500" />
                          ) : (
                            <Youtube className="w-4 h-4 text-red-500" />
                          )}
                          <Badge variant="secondary" className="text-[10px]">
                            {content.type}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            {content.engagementScore.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {getCreatorName(content.creatorId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{getCreatorHandle(content.creatorId)} ·{" "}
                          {content.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Heart className="w-3 h-3" />
                          {formatNumber(content.likes)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MessageCircle className="w-3 h-3" />
                          {formatNumber(content.comments)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Bookmark className="w-3 h-3" />
                          {formatNumber(content.saves)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Share2 className="w-3 h-3" />
                          {formatNumber(content.shares)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 사이드 패널: 크리에이터 정보 */}
          {selectedContent && (
            <div className="w-full lg:w-80 shrink-0">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">크리에이터 정보</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setSelectedContent(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {getCreatorName(selectedContent.creatorId).charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {getCreatorName(selectedContent.creatorId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{getCreatorHandle(selectedContent.creatorId)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">플랫폼</span>
                      <span className="capitalize">{selectedContent.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">카테고리</span>
                      <span>{selectedContent.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">콘텐츠 유형</span>
                      <span>{selectedContent.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">게시일</span>
                      <span>
                        {new Date(selectedContent.postedAt).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">스코어</span>
                      <span className="font-bold text-primary">
                        {selectedContent.engagementScore.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <Link href={`/ontrust/creator/${selectedContent.creatorId}`}>
                    <Button variant="outline" className="w-full mt-2">
                      크리에이터 상세 보기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
