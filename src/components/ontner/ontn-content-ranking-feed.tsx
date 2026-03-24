"use client";

import React, { useState, useMemo } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Search,
  Instagram,
  Youtube,
  Calendar,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { OntnCategoryTabs } from "./ontn-category-tabs";
import popularContentsJson from "@/data/mock/popular-contents.json";
import campaignsJson from "@/data/mock/campaigns.json";

/* ─── Types ─── */
type Period = "1w" | "1m" | "2m" | "6m";
type Platform = "instagram" | "youtube" | "all";
type SortKey = "score" | "likes" | "views" | "comments" | "rank";
type SortDir = "asc" | "desc";

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
  platform: "instagram" | "youtube" | "tiktok";
  creatorHandle: string;
  creatorFollowers: number;
  thumbnailUrl: string;
  period: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    score: number;
  };
  mappedCampaigns: MappedCampaign[];
}

interface MetricFilter {
  min: string;
  max: string;
}

/* ─── Constants ─── */
const PERIODS: { label: string; value: Period }[] = [
  { label: "1주 이하", value: "1w" },
  { label: "1개월 이하", value: "1m" },
  { label: "2개월 이하", value: "2m" },
  { label: "6개월 이상", value: "6m" },
];

// Map UI periods → mock data periods (mock has 1w, 1m, 3m, 6m)
const PERIOD_DATA_MAP: Record<Period, string[]> = {
  "1w": ["1w"],
  "1m": ["1w", "1m"],
  "2m": ["1w", "1m", "3m"],
  "6m": ["1w", "1m", "3m", "6m"],
};

const CATEGORIES = [
  "전체", "패션의류", "패션잡화", "인테리어", "디지털/가전",
  "스포츠/레저", "문화", "식품", "생활/건강", "뷰티", "출산/육아", "서비스",
];

// Campaign lookup for thumbnails & deadlines
const campaignMap = new Map(
  campaignsJson.map((c) => [
    c.id,
    { imageUrl: c.imageUrl, recruitEndDate: c.recruitEndDate, name: c.name },
  ])
);

/* ─── Helpers ─── */
function formatNum(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}천만`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return String(n);
}

function formatFollowers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}천`;
  return String(n);
}

function parseFilterNum(v: string): number | null {
  if (!v.trim()) return null;
  const n = Number(v.replace(/,/g, ""));
  return isNaN(n) ? null : n;
}

/* ─── Metric Filter Input ─── */
function MetricFilterInput({
  label,
  icon,
  value,
  onChange,
  onClear,
}: {
  label: string;
  icon: React.ReactNode;
  value: MetricFilter;
  onChange: (v: MetricFilter) => void;
  onClear: () => void;
}) {
  const hasValue = value.min !== "" || value.max !== "";
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-gray-500 flex items-center gap-1 w-14 flex-shrink-0">
        {icon} {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        placeholder="최소"
        value={value.min}
        onChange={(e) => onChange({ ...value, min: e.target.value })}
        className="w-16 h-6 px-1.5 text-[11px] border border-gray-200 bg-white text-center placeholder:text-gray-300 focus:outline-none focus:border-purple-400"
      />
      <span className="text-[10px] text-gray-300">~</span>
      <input
        type="text"
        inputMode="numeric"
        placeholder="최대"
        value={value.max}
        onChange={(e) => onChange({ ...value, max: e.target.value })}
        className="w-16 h-6 px-1.5 text-[11px] border border-gray-200 bg-white text-center placeholder:text-gray-300 focus:outline-none focus:border-purple-400"
      />
      {hasValue && (
        <button onClick={onClear} className="text-gray-300 hover:text-gray-500">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/* ─── Sortable Table Header Cell ─── */
function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  currentDir: SortDir;
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const isActive = currentSort === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center justify-center gap-0.5 hover:text-purple-600 transition-colors select-none",
        isActive ? "text-purple-600 font-semibold" : "text-gray-500",
        className
      )}
    >
      {label}
      {isActive ? (
        currentDir === "desc" ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronUp className="w-3 h-3" />
        )
      ) : (
        <ChevronsUpDown className="w-2.5 h-2.5 opacity-40" />
      )}
    </button>
  );
}

/* ─── Single Ranking Row ─── */
function ContentRankRow({
  content,
  displayRank,
}: {
  content: PopularContent;
  displayRank: number;
}) {
  const rankClass =
    displayRank === 1
      ? "ontn-rank-badge ontn-rank-badge-gold"
      : displayRank === 2
        ? "ontn-rank-badge ontn-rank-badge-silver"
        : displayRank === 3
          ? "ontn-rank-badge ontn-rank-badge-bronze"
          : "ontn-rank-badge";

  const platformIcon =
    content.platform === "youtube" ? (
      <Youtube className="w-3 h-3 text-red-500" />
    ) : (
      <Instagram className="w-3 h-3 text-pink-500" />
    );

  const platformLabel =
    content.platform === "youtube" ? "YouTube" : "Instagram";

  return (
    <div className="ontn-content-card">
      {/* Main Row */}
      <div className="flex items-stretch">
        {/* Rank */}
        <div className="flex items-center justify-center w-12 flex-shrink-0 border-r border-gray-100">
          <span className={rankClass}>{displayRank}</span>
        </div>

        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-100">
          <img
            src={content.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <span className="ontn-platform-badge absolute bottom-0.5 left-0.5">
            {platformIcon}
            <span className="text-[9px]">{platformLabel}</span>
          </span>
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0 px-3 py-2 flex flex-col justify-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-800 truncate">
              {content.creatorHandle}
            </span>
            <span className="text-[10px] text-gray-400 flex-shrink-0">
              {formatFollowers(content.creatorFollowers)}
            </span>
          </div>
          <span className="inline-block text-[11px] text-purple-600 bg-purple-50 px-1.5 py-0.5 w-fit">
            {content.category}
          </span>
        </div>

        {/* Metrics (desktop) */}
        <div className="hidden sm:flex items-center gap-4 px-4 flex-shrink-0 border-l border-gray-100">
          <div className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <Eye className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-700">
              {formatNum(content.metrics.views)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <Heart className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-700">
              {formatNum(content.metrics.likes)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <MessageCircle className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-700">
              {formatNum(content.metrics.comments)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <span className="text-[10px] text-gray-400">점수</span>
            <span className="text-[11px] font-bold text-purple-600">
              {content.metrics.score.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Metrics (mobile) */}
        <div className="flex sm:hidden items-center gap-2 px-2 flex-shrink-0">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] text-gray-500">
              {formatNum(content.metrics.views)} 조회
            </span>
            <span className="text-[10px] text-gray-500">
              {formatNum(content.metrics.likes)} 좋아요
            </span>
            <span className="text-[11px] font-bold text-purple-600">
              {content.metrics.score.toFixed(1)}점
            </span>
          </div>
        </div>
      </div>

      {/* Mapped Campaigns */}
      {content.mappedCampaigns.length > 0 && (
        <div className="border-t border-gray-100 px-3 py-2 flex flex-wrap gap-2">
          <span className="text-[10px] text-gray-400 self-center mr-1">
            연관 캠페인
          </span>
          {content.mappedCampaigns.slice(0, 2).map((mc) => {
            const detail = campaignMap.get(mc.id);
            return (
              <Link
                key={mc.id}
                href={`/ontner/campaign/${mc.id}`}
                className="ontn-mapped-campaign group flex-1 min-w-[200px] max-w-[320px]"
              >
                {detail?.imageUrl && (
                  <div className="w-10 h-10 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <img src={detail.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-800 truncate">{mc.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>마감 {detail?.recruitEndDate?.replace(/-/g, ".") || "-"}</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-purple-500 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
interface OntnContentRankingFeedProps {
  className?: string;
}

export function OntnContentRankingFeed({ className }: OntnContentRankingFeedProps) {
  // Filters
  const [platform, setPlatform] = useState<Platform>("all");
  const [category, setCategory] = useState("전체");
  const [period, setPeriod] = useState<Period>("1m");
  const [brandSearch, setBrandSearch] = useState("");

  // Metric range filters
  const [likesFilter, setLikesFilter] = useState<MetricFilter>({ min: "", max: "" });
  const [viewsFilter, setViewsFilter] = useState<MetricFilter>({ min: "", max: "" });
  const [commentsFilter, setCommentsFilter] = useState<MetricFilter>({ min: "", max: "" });

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const hasMetricFilters =
    likesFilter.min !== "" || likesFilter.max !== "" ||
    viewsFilter.min !== "" || viewsFilter.max !== "" ||
    commentsFilter.min !== "" || commentsFilter.max !== "";

  const contents = popularContentsJson as PopularContent[];

  const visibleContents = useMemo(() => {
    const dataPeriods = PERIOD_DATA_MAP[period];

    // Deduplicate by best score per creator within matched periods
    const byCreator = new Map<string, PopularContent>();
    for (const c of contents) {
      if (!dataPeriods.includes(c.period)) continue;
      const key = c.creatorHandle;
      const existing = byCreator.get(key);
      if (!existing || c.metrics.score > existing.metrics.score) {
        byCreator.set(key, c);
      }
    }

    let result = Array.from(byCreator.values());

    // Platform
    if (platform !== "all") {
      result = result.filter((c) => c.platform === platform);
    }

    // Category
    if (category !== "전체") {
      result = result.filter((c) => c.category === category);
    }

    // Brand search
    if (brandSearch.trim()) {
      const q = brandSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.creatorHandle.toLowerCase().includes(q) ||
          c.mappedCampaigns.some((mc) => mc.name.toLowerCase().includes(q))
      );
    }

    // Metric range filters
    const likesMin = parseFilterNum(likesFilter.min);
    const likesMax = parseFilterNum(likesFilter.max);
    const viewsMin = parseFilterNum(viewsFilter.min);
    const viewsMax = parseFilterNum(viewsFilter.max);
    const commentsMin = parseFilterNum(commentsFilter.min);
    const commentsMax = parseFilterNum(commentsFilter.max);

    result = result.filter((c) => {
      if (likesMin !== null && c.metrics.likes < likesMin) return false;
      if (likesMax !== null && c.metrics.likes > likesMax) return false;
      if (viewsMin !== null && c.metrics.views < viewsMin) return false;
      if (viewsMax !== null && c.metrics.views > viewsMax) return false;
      if (commentsMin !== null && c.metrics.comments < commentsMin) return false;
      if (commentsMax !== null && c.metrics.comments > commentsMax) return false;
      return true;
    });

    // Sort
    const dir = sortDir === "desc" ? -1 : 1;
    result.sort((a, b) => {
      let diff = 0;
      switch (sortKey) {
        case "score":    diff = a.metrics.score - b.metrics.score; break;
        case "likes":    diff = a.metrics.likes - b.metrics.likes; break;
        case "views":    diff = a.metrics.views - b.metrics.views; break;
        case "comments": diff = a.metrics.comments - b.metrics.comments; break;
        case "rank":     diff = a.rank - b.rank; break;
      }
      return diff * dir;
    });

    return result.slice(0, 50);
  }, [contents, period, platform, category, brandSearch, likesFilter, viewsFilter, commentsFilter, sortKey, sortDir]);

  return (
    <div className={cn("flex flex-col", className)}>
      {/* ── Row 1: Platform + Period ── */}
      <div className="px-6 py-3 flex flex-wrap items-center gap-3 border-b border-gray-100">
        {/* Platform Buttons */}
        <div className="flex items-center">
          <button
            onClick={() => setPlatform("all")}
            className={cn(
              "ontn-filter-dropdown text-xs",
              platform === "all" && "!bg-purple-600 !text-white !border-purple-600"
            )}
          >
            전체
          </button>
          <button
            onClick={() => setPlatform("instagram")}
            className={cn(
              "ontn-filter-dropdown text-xs gap-1 -ml-px",
              platform === "instagram" && "!bg-purple-600 !text-white !border-purple-600"
            )}
          >
            <Instagram className="w-3 h-3" />
            인스타그램
          </button>
          <button
            onClick={() => setPlatform("youtube")}
            className={cn(
              "ontn-filter-dropdown text-xs gap-1 -ml-px",
              platform === "youtube" && "!bg-purple-600 !text-white !border-purple-600"
            )}
          >
            <Youtube className="w-3 h-3" />
            유튜브
          </button>
        </div>

        <div className="w-px h-5 bg-gray-200" />

        {/* Period (업로드 시점) */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400 mr-0.5">업로드</span>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={cn(
                "ontn-period-chip",
                period === p.value && "ontn-period-chip-active"
              )}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 2: Metric Filters ── */}
      <div className="px-6 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-gray-100 bg-gray-50/60">
        <MetricFilterInput
          label="조회수"
          icon={<Eye className="w-3 h-3" />}
          value={viewsFilter}
          onChange={setViewsFilter}
          onClear={() => setViewsFilter({ min: "", max: "" })}
        />
        <MetricFilterInput
          label="좋아요"
          icon={<Heart className="w-3 h-3" />}
          value={likesFilter}
          onChange={setLikesFilter}
          onClear={() => setLikesFilter({ min: "", max: "" })}
        />
        <MetricFilterInput
          label="댓글"
          icon={<MessageCircle className="w-3 h-3" />}
          value={commentsFilter}
          onChange={setCommentsFilter}
          onClear={() => setCommentsFilter({ min: "", max: "" })}
        />
        {hasMetricFilters && (
          <button
            onClick={() => {
              setViewsFilter({ min: "", max: "" });
              setLikesFilter({ min: "", max: "" });
              setCommentsFilter({ min: "", max: "" });
            }}
            className="text-[11px] text-purple-600 hover:underline ml-auto"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* ── Category Tabs ── */}
      <OntnCategoryTabs
        categories={CATEGORIES}
        value={category}
        onChange={setCategory}
        className="px-6"
      />

      {/* ── Search + Counter Header ── */}
      <div className="px-6 py-3 flex items-center gap-3 border-b border-gray-100">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="브랜드/크리에이터 검색"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:border-purple-400"
          />
        </div>
        <span className="text-sm font-semibold text-gray-900">
          TOP {visibleContents.length} 인기 콘텐츠
        </span>
        <span className="ml-auto text-[11px] text-gray-400 hidden sm:block">
          헤더 클릭으로 정렬 변경
        </span>
      </div>

      {/* ── Sortable Table Header (desktop) ── */}
      <div className="hidden sm:flex items-center px-6 h-9 bg-gray-50 border-b border-gray-200 text-[11px] font-medium">
        <span className="w-12 text-center flex-shrink-0 text-gray-500">순위</span>
        <span className="w-20 flex-shrink-0 text-gray-500">썸네일</span>
        <span className="flex-1 min-w-0 px-3 text-gray-500">콘텐츠 정보</span>
        <div className="flex items-center gap-4 px-4 flex-shrink-0 border-l border-gray-200">
          <SortableHeader
            label="조회수"
            sortKey="views"
            currentSort={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="min-w-[48px] text-[11px]"
          />
          <SortableHeader
            label="좋아요"
            sortKey="likes"
            currentSort={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="min-w-[48px] text-[11px]"
          />
          <SortableHeader
            label="댓글"
            sortKey="comments"
            currentSort={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="min-w-[48px] text-[11px]"
          />
          <SortableHeader
            label="점수"
            sortKey="score"
            currentSort={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="min-w-[48px] text-[11px]"
          />
        </div>
      </div>

      {/* ── Content List ── */}
      <div className="px-6 py-4 pb-8 space-y-2.5">
        {visibleContents.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">해당 조건의 인기 콘텐츠가 없습니다</p>
          </div>
        ) : (
          visibleContents.map((content, index) => (
            <ContentRankRow
              key={content.id}
              content={content}
              displayRank={index + 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
