"use client";

import { useState, useEffect } from "react";
import { Sparkles, Send, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { featuringApi } from "@/lib/featuring-api";
import type { Recommendation } from "@/types/recommendation";
import mockCreatorsJson from "@/data/mock/creators.json";

type MockCreator = (typeof mockCreatorsJson)[number];

const REASON_LABELS: Record<string, { label: string; color: string }> = {
  "성과유사": { label: "성과 유사", color: "bg-blue-100 text-blue-800" },
  "구매기반": { label: "구매 기반", color: "bg-green-100 text-green-800" },
  "카테고리유사": { label: "카테고리 유사", color: "bg-purple-100 text-purple-800" },
};

function getCreatorInfo(id: string): MockCreator | undefined {
  return mockCreatorsJson.find((c) => c.id === id);
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

export default function CreatorRecommendPage() {
  const [campaigns, setCampaigns] = useState<typeof mockCampaignsJson>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  // Keep a local import of campaigns JSON for the dropdown
  const [mockCampaignsJson, setMockCampaignsJson] = useState<
    { id: string; name: string; brand: string; brandCategory: string; status: string }[]
  >([]);

  useEffect(() => {
    async function loadCampaigns() {
      const data = await featuringApi.getNewCampaigns();
      setMockCampaignsJson(data as typeof mockCampaignsJson);
      setCampaigns(data as typeof mockCampaignsJson);
    }
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (!selectedCampaignId) {
      setRecommendation(null);
      return;
    }
    async function loadRecommendations() {
      setLoading(true);
      try {
        const rec = await featuringApi.getCreatorRecommendations(selectedCampaignId);
        setRecommendation(rec);
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, [selectedCampaignId]);

  const handlePropose = (creatorId: string) => {
    const info = getCreatorInfo(creatorId);
    alert(`${info?.name || creatorId}에게 캠페인 제안을 발송합니다.`);
  };

  return (
    <>
      <PageHeader
        title="크리에이터 추천"
        description="캠페인별 AI 기반 크리에이터 추천 Top 10"
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Campaign selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium shrink-0">캠페인 선택</label>
              <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="캠페인을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.brand})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {!selectedCampaignId && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            캠페인을 선택하면 추천 크리에이터가 표시됩니다.
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {!loading && recommendation && (
          <>
            <div className="text-xs text-muted-foreground">
              배치 업데이트: {new Date(recommendation.updatedAt).toLocaleDateString("ko-KR")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendation.creators.slice(0, 10).map((rec, idx) => {
                const info = getCreatorInfo(rec.creatorId);
                const reasonMeta = REASON_LABELS[rec.reason] || {
                  label: rec.reason,
                  color: "bg-gray-100 text-gray-800",
                };
                return (
                  <Card key={rec.creatorId} className="relative">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-sm font-bold">
                              {info?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold truncate">
                              {info?.name || rec.creatorId}
                            </span>
                            <Badge className={`text-xs ${reasonMeta.color} border-0`}>
                              {reasonMeta.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            @{info?.handle || "unknown"} · 팔로워{" "}
                            {formatNumber(info?.followers || 0)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${rec.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-primary">
                              {rec.score}점
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePropose(rec.creatorId)}
                          className="shrink-0"
                        >
                          <Send className="h-3.5 w-3.5 mr-1" />
                          제안하기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {recommendation.creators.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                해당 캠페인에 대한 추천 크리에이터가 없습니다.
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
