"use client";

import React, { useState } from "react";
import { Eye, Heart, MessageCircle, Share2, Play, Youtube, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { OntnCategoryTabs } from "./ontn-category-tabs";
import popularContentsJson from "@/data/mock/popular-contents.json";

type Period = "1w" | "1m" | "3m" | "6m";
type Platform = "instagram" | "youtube" | "tiktok";

interface MappedCampaign {
  id: string;
  name: string;
  reward: string;
  status: string;
  rewardType: string;
}

interface PopularContent {
  id: string;
  rank: number;
  category: string;
  platform: Platform;
  creatorHandle: string;
  creatorFollowers: number;
  thumbnailUrl: string;
  period: Period;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    score: number;
  };
  mappedCampaigns: MappedCampaign[];
}

const PERIODS: { label: string; value: Period }[] = [
  { label: "1주일", value: "1w" },
  { label: "1개월", value: "1m" },
  { label: "3개월", value: "3m" },
  { label: "6개월", value: "6m" },
];

const CATEGORIES = [
  "전체", "패션의류", "패션잡화", "인테리어", "디지털/가전",
  "스포츠/레저", "문화", "식품", "생활/건강", "뷰티", "출산/육아", "서비스",
];

const PLATFORM_ICON: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="w-3 h-3" />,
  youtube:   <Youtube className="w-3 h-3" />,
  tiktok:    <Play className="w-3 h-3" />,
};

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: "Instagram",
  youtube:   "YouTube",
  tiktok:    "TikTok",
};

const PLATFORM_COLOR: Record<Platform, string> = {
  instagram: "text-pink-500",
  youtube:   "text-red-500",
  tiktok:    "text-gray-800",
};

function formatNum(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}천만`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return String(n);
}

function formatFollowers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}천`;
  return String(n);
}

interface ContentCardProps {
  content: PopularContent;
  displayRank: number;
}

function ContentCard({ content, displayRank }: ContentCardProps) {
  const rankClass =
    displayRank === 1 ? "ontn-rank-badge ontn-rank-badge-gold" :
    displayRank === 2 ? "ontn-rank-badge ontn-rank-badge-silver" :
    displayRank === 3 ? "ontn-rank-badge ontn-rank-badge-bronze" :
    "ontn-rank-badge";

  return (
    <div className="ontn-content-card flex flex-col sm:flex-row">
      {/* Rank */}
      <div className="flex sm:flex-col items-center justify-center px-3 py-3 sm:px-4 sm:py-0 flex-shrink-0 sm:w-14 gap-3 sm:gap-0 border-b sm:border-b-0 sm:border-r border-gray-100">
        <span className={rankClass}>{displayRank}</span>
      </div>

      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-full sm:w-28 h-28 sm:h-auto overflow-hidden bg-gray-100">
        <img
          src={content.thumbnailUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        <span className={cn("ontn-platform-badge absolute bottom-1 left-1", PLATFORM_COLOR[content.platform])}>
          {PLATFORM_ICON[content.platform]}
          {PLATFORM_LABEL[content.platform]}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 px-4 py-3 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-800 truncate">{content.creatorHandle}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">팔로워 {formatFollowers(content.creatorFollowers)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <span className="ontn-metric-item">
            <Eye className="w-3 h-3" />
            {formatNum(content.metrics.views)}
          </span>
          <span className="ontn-metric-item">
            <Heart className="w-3 h-3" />
            {formatNum(content.metrics.likes)}
          </span>
          <span className="ontn-metric-item">
            <MessageCircle className="w-3 h-3" />
            {formatNum(content.metrics.comments)}
          </span>
          <span className="ontn-metric-item">
            <Share2 className="w-3 h-3" />
            {formatNum(content.metrics.shares)}
          </span>
        </div>
        <div className="text-xs">
          <span className="text-gray-500">참여점수 </span>
          <span className="text-purple-600 font-bold">{content.metrics.score.toFixed(1)}</span>
        </div>
      </div>

      {/* Mapped Campaigns */}
      <div className="flex-shrink-0 w-full sm:w-56 border-t sm:border-t-0 sm:border-l border-gray-100 px-3 py-3 flex flex-col gap-2">
        <p className="text-xs text-gray-400 font-medium">지금 신청 가능한 캠페인</p>
        {content.mappedCampaigns.map((campaign) => (
          <div key={campaign.id} className="ontn-mapped-campaign">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{campaign.name}</p>
              <p className="text-xs text-gray-500 truncate">{campaign.reward}</p>
            </div>
            <Link
              href={`/ontner/campaign/${campaign.id}`}
              className="ontn-apply-btn flex-shrink-0 text-xs px-2"
              style={{ height: "26px", fontSize: "11px" }}
            >
              신청
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

interface OntnContentRankingFeedProps {
  className?: string;
}

export function OntnContentRankingFeed({ className }: OntnContentRankingFeedProps) {
  const [category, setCategory] = useState("전체");
  const [period, setPeriod] = useState<Period>("1m");

  const contents = popularContentsJson as PopularContent[];

  const visibleContents = contents
    .filter((c) => c.period === period)
    .filter((c) => category === "전체" || c.category === category)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 50);

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Period Filter */}
      <div className="px-6 py-3 flex items-center gap-2 border-b border-gray-100">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            className={cn("ontn-period-chip", period === p.value && "ontn-period-chip-active")}
            onClick={() => setPeriod(p.value)}
          >
            {p.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 hidden sm:block">점수 = 댓글 &gt; 공유 &gt; 조회수 &gt; 좋아요</span>
      </div>

      {/* Category Tabs */}
      <OntnCategoryTabs
        categories={CATEGORIES}
        value={category}
        onChange={setCategory}
        className="px-6"
      />

      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">
          TOP {visibleContents.length} 인기 공구 콘텐츠
        </span>
        <span className="text-xs text-gray-400">연관 캠페인 바로 신청 가능</span>
      </div>

      {/* Content List */}
      <div className="px-6 py-4 pb-8 space-y-3">
        {visibleContents.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">해당 카테고리의 인기 콘텐츠가 없습니다</p>
          </div>
        ) : (
          visibleContents.map((content, index) => (
            <ContentCard key={content.id} content={content} displayRank={index + 1} />
          ))
        )}
      </div>
    </div>
  );
}
