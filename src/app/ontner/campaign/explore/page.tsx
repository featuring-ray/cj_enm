"use client";

import React, { useState, useEffect } from "react";
import { Search, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { featuringApi } from "@/lib/featuring-api";
import mockCampaignsJson from "@/data/mock/campaigns.json";
import { OntnCategoryTabs } from "@/components/ontner/ontn-category-tabs";
import { OntnFilterBar } from "@/components/ontner/ontn-filter-bar";
import { OntnCampaignCard } from "@/components/ontner/ontn-campaign-card";
import { OntnRecommendBanner } from "@/components/ontner/ontn-recommend-banner";
import { OntnContentRankingFeed } from "@/components/ontner/ontn-content-ranking-feed";

// Positions (0-based index) after which a recommendation banner is inserted
const BANNER_POSITIONS = [7, 19];

type CampaignData = (typeof mockCampaignsJson)[0];

const CATEGORIES = [
  "전체",
  "패션의류",
  "패션잡화",
  "인테리어",
  "디지털/가전",
  "스포츠/레저",
  "문화",
  "식품",
  "생활/건강",
  "뷰티",
  "출산/육아",
  "서비스",
];

export default function OntnerCampaignExplorePage() {
  const [topTab, setTopTab] = useState<"campaign" | "content">("campaign");
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState("전체");
  const [campaignType, setCampaignType] = useState("전체");
  const [settlementType, setSettlementType] = useState("전체");
  const [benefit, setBenefit] = useState("전체");
  const [hasSample, setHasSample] = useState(false);
  const [sortBy, setSortBy] = useState("최근 등록순");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const allCampaigns = await featuringApi.getNewCampaigns();
        setCampaigns(allCampaigns as CampaignData[]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCampaigns = campaigns
    .filter((c) => {
      if (category !== "전체" && c.brandCategory !== category) return false;
      if (campaignType !== "전체" && c.campaignType !== campaignType)
        return false;
      if (settlementType !== "전체" && c.settlementType !== settlementType)
        return false;
      if (benefit !== "전체" && c.benefit !== benefit) return false;
      if (hasSample && !c.hasSample) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "최근 등록순") {
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      }
      if (sortBy === "마감임박순") {
        return (
          new Date(a.recruitEndDate).getTime() -
          new Date(b.recruitEndDate).getTime()
        );
      }
      if (sortBy === "모집인원순") {
        return b.recruitCount - a.recruitCount;
      }
      return 0;
    });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">캠페인 탐색/추천</h1>
        <p className="text-sm text-gray-500 mt-1">
          온트너의 다양한 캠페인을 확인하고 참여할 수 있습니다.
          <br />
          정산계좌 등록 후 참여 가능합니다.
        </p>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
          <Info className="w-3 h-3" />
          <span>참여시 유의사항</span>
        </div>
      </div>

      {/* Top-level Tab Switcher */}
      <div className="flex border-b border-gray-200 px-6">
        <button
          onClick={() => setTopTab("campaign")}
          className={cn("ontn-top-tab", topTab === "campaign" && "ontn-top-tab-active")}
        >
          캠페인 탐색
        </button>
        <button
          onClick={() => setTopTab("content")}
          className={cn("ontn-top-tab", topTab === "content" && "ontn-top-tab-active")}
        >
          콘텐츠 기반 탐색
        </button>
      </div>

      {topTab === "content" ? (
        <OntnContentRankingFeed />
      ) : (
        <>
          {/* Category Tabs */}
          <OntnCategoryTabs
            categories={CATEGORIES}
            value={category}
            onChange={setCategory}
            className="px-6"
          />

          {/* Filter Bar */}
          <div className="px-6 py-3">
            <OntnFilterBar
              campaignType={campaignType}
              onCampaignTypeChange={setCampaignType}
              settlementType={settlementType}
              onSettlementTypeChange={setSettlementType}
              benefit={benefit}
              onBenefitChange={setBenefit}
              hasSample={hasSample}
              onHasSampleChange={setHasSample}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>

          {/* Campaign Grid */}
          <div className="flex-1 px-6 pb-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-gray-200">
                    <div className="aspect-[4/5] bg-gray-100 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">검색 결과가 없습니다</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredCampaigns.flatMap((campaign, index) => {
                  const items: React.ReactNode[] = [
                    <OntnCampaignCard key={campaign.id} campaign={campaign} />,
                  ];
                  if (BANNER_POSITIONS.includes(index)) {
                    items.push(
                      <div key={`recommend-banner-${index}`} className="col-span-full">
                        <OntnRecommendBanner />
                      </div>
                    );
                  }
                  return items;
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
