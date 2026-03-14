"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  Tag,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { featuringApi } from "@/lib/featuring-api";
import mockCampaignsJson from "@/data/mock/campaigns.json";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignRecommendModule } from "@/components/ontner/campaign-recommend-module";

type CampaignData = (typeof mockCampaignsJson)[0];

const CATEGORIES = ["전체", "뷰티", "패션", "푸드", "테크", "리빙", "육아"];
const STATUSES = ["전체", "모집중", "진행중", "완료", "제안"];

const STATUS_COLORS: Record<string, string> = {
  모집중: "bg-emerald-50 text-emerald-700 border-emerald-200",
  진행중: "bg-blue-50 text-blue-700 border-blue-200",
  완료: "bg-gray-50 text-gray-600 border-gray-200",
  제안: "bg-amber-50 text-amber-700 border-amber-200",
};

const CURRENT_CREATOR_ID = "creator-1";

export default function OntnerCampaignExplorePage() {
  const [tab, setTab] = useState("all");
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const allCampaigns = await featuringApi.getNewCampaigns();
        setCampaigns(allCampaigns);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchSearch =
      !searchText ||
      c.name.includes(searchText) ||
      c.brand.includes(searchText);
    const matchCategory =
      categoryFilter === "전체" || c.brandCategory === categoryFilter;
    const matchStatus = statusFilter === "전체" || c.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <>
      <PageHeader
        title="캠페인 탐색"
        description="진행 중인 캠페인을 탐색하고 참여를 신청하세요"
      />

      <main className="flex-1 p-4 md:p-6 space-y-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">전체 캠페인</TabsTrigger>
            <TabsTrigger value="recommend" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              추천 캠페인
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* 필터 */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="캠페인명 또는 브랜드 검색..."
                  className="pl-9"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 캠페인 카드 리스트 */}
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-5 space-y-3">
                      <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                      <div className="h-4 bg-muted rounded animate-pulse w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>검색 결과가 없습니다</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredCampaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/ontner/campaign/${campaign.id}`}
                  >
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.brand}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={STATUS_COLORS[campaign.status] || ""}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {campaign.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {campaign.startDate} ~ {campaign.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            {campaign.brandCategory}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-primary">
                          {campaign.reward}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommend" className="space-y-4">
            <CampaignRecommendModule
              creatorId={CURRENT_CREATOR_ID}
              title="나를 위한 추천 캠페인"
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
