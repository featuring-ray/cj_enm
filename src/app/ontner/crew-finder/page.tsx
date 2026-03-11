"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { featuringApi } from "@/lib/featuring-api";
import type { SimilarityResult } from "@/types/similarity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreatorSearchDialog } from "@/components/creators/creator-search-dialog";

// 현재 로그인한 크리에이터 (mock)
const MY_CREATOR = {
  id: "creator-1",
  name: "뷰티하나",
  handle: "@beauty_hana",
  followers: 285000,
  categories: ["뷰티", "패션"],
};

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

export default function CrewFinderPage() {
  const [selectedCreator, setSelectedCreator] = useState<{
    id: string;
    name: string;
    handle: string;
    followers: number;
    categories: string[];
  } | null>(null);
  const [result, setResult] = useState<SimilarityResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleAnalyze() {
    if (!selectedCreator) return;
    setAnalyzing(true);
    setResult(null);
    setAnalyzed(false);

    // 배치 처리 시뮬레이션 (3초)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const similarity = await featuringApi.getCreatorSimilarity(
      MY_CREATOR.id,
      selectedCreator.id
    );
    setResult(similarity);
    setAnalyzed(true);
    setAnalyzing(false);
  }

  function handleSelectCreators(creators: import("@/types/creator").Creator[]) {
    const creator = creators[0];
    if (!creator) return;
    setSelectedCreator({
      id: creator.id,
      name: creator.displayName,
      handle: `@${creator.username}`,
      followers: creator.followerCount,
      categories: creator.categories,
    });
    setResult(null);
    setAnalyzed(false);
    setDialogOpen(false);
  }

  return (
    <>
      <PageHeader
        title="크루찾기"
        description="팔로워 유사도를 분석하여 비교 크리에이터를 찾아보세요 (베타)"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* 내 프로필 카드 (고정) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">내 프로필</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-600 shrink-0">
                {MY_CREATOR.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{MY_CREATOR.name}</p>
                <p className="text-sm text-muted-foreground">
                  {MY_CREATOR.handle}
                </p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    팔로워 {formatNumber(MY_CREATOR.followers)}
                  </Badge>
                  {MY_CREATOR.categories.map((cat) => (
                    <Badge key={cat} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비교 대상 선택 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              비교 대상 크리에이터
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setDialogOpen(true)}
              >
                <Search className="w-3.5 h-3.5" />
                크리에이터 선택
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCreator ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600 shrink-0">
                    {selectedCreator.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedCreator.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCreator.handle}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        팔로워 {formatNumber(selectedCreator.followers)}
                      </Badge>
                      {selectedCreator.categories.map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    "분석 요청"
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">
                  비교할 크리에이터를 선택해주세요 (팔로워 수집 완료된 ~200명)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 분석 중 로딩 */}
        {analyzing && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                <div>
                  <p className="font-semibold text-lg">팔로워 유사도 분석 중</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    배치 처리 중입니다. 잠시만 기다려주세요...
                  </p>
                </div>
                <div className="w-64 mx-auto bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 분석 결과 */}
        {analyzed && !analyzing && (
          <>
            {result ? (
              <>
                {/* 일치율 대형 표시 */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      팔로워 일치율
                    </p>
                    <p className="text-6xl font-bold text-purple-600">
                      {result.matchRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      분석 일시: {new Date(result.analyzedAt).toLocaleDateString("ko-KR")}
                      {" · "}유효기간: {new Date(result.validUntil).toLocaleDateString("ko-KR")}까지
                    </p>
                  </CardContent>
                </Card>

                {/* 비교 테이블 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">비교 분석</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-600">
                          {MY_CREATOR.name.charAt(0)}
                        </div>
                        <p className="font-semibold text-sm">{MY_CREATOR.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {MY_CREATOR.handle}
                        </p>
                        <p className="text-sm">
                          팔로워 {formatNumber(MY_CREATOR.followers)}
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {MY_CREATOR.categories.map((c) => (
                            <Badge key={c} variant="outline" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <ArrowRight className="w-6 h-6 mx-auto text-muted-foreground rotate-180" />
                          <p className="text-2xl font-bold text-purple-600 mt-2">
                            {result.matchRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">일치율</p>
                          <ArrowRight className="w-6 h-6 mx-auto text-muted-foreground mt-2" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
                          {selectedCreator!.name.charAt(0)}
                        </div>
                        <p className="font-semibold text-sm">
                          {selectedCreator!.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedCreator!.handle}
                        </p>
                        <p className="text-sm">
                          팔로워 {formatNumber(selectedCreator!.followers)}
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {selectedCreator!.categories.map((c) => (
                            <Badge key={c} variant="outline" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-6">
                      참고: 온트너에서는 세그먼트 정보가 표시되지 않습니다
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* 결과 없음 상태 */
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="font-semibold">분석 결과 없음</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    아직 해당 크리에이터와의 팔로워 유사도가 분석되지 않았습니다.
                    <br />
                    분석이 완료되면 결과를 확인할 수 있습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      <CreatorSearchDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleSelectCreators}
        singleSelect
        excludeIds={[MY_CREATOR.id]}
        title="비교 크리에이터 선택"
      />
    </>
  );
}
