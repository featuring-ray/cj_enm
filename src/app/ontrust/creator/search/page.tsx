"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  CircleDashed,
  Eye,
  Megaphone,
  Send,
  Download,
  Plus,
  GitCompare,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Youtube,
  AlertCircle,
  X,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  OtrSearchPanel,
  OtrFormGrid,
  OtrFormField,
  OtrToolbar,
  OtrTierBadge,
  OtrPlatformToggle,
  OtrTabBar,
  OtrAdvancedFilterPanel,
  defaultAdvancedFilters,
  type AdvancedFilterState,
} from "@/components/ontrust";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import rawCreators from "@/data/mock/creators.json";
import rawContents from "@/data/mock/contents.json";
import rawCampaigns from "@/data/mock/campaigns.json";

// ─── 타입 정의 ──────────────────────────────────────────
type TierLevel = "GOLD" | "SILVER" | "BRONZE";
type CreatorSortField = "engagement" | "followers" | "campaignCount" | "salesPrice";
type SearchScope = "all" | "content" | "profile";
type KeywordCondition = "or" | "and";

interface MockCreator {
  id: string;
  handle: string;
  youtubeHandle?: string;
  name: string;
  followers: number;
  engagementRate: number;
  category: string[];
  isOntnerMember: boolean;
  salesPrice?: number;
  campaigns: string[];
  tier: TierLevel;
  contactEmail: string;
  recentUploadDate: string;
  avgFeedLikes: number;
  avgVideoLikes: number;
  avgVideoViews: number;
  avgShortsViews?: number;
  avgComments: number;
  hasVerificationBadge: boolean;
  estimatedReach: number;
  audienceGender: { male: number; female: number };
  audienceAge: Record<string, number>;
  hasCoPurchase: boolean;
  socialBuzzDetected: boolean;
  ontnerCampaignCount: number;
  avgPerformance?: number;
  avgProductPrice?: number;
  customerAge?: Record<string, number>;
  rewardLinkUsage: boolean;
  biography: string;
  introduction?: string;
}

interface MockContent {
  id: string;
  creatorId: string;
  campaignId?: string;
  platform: string;
  type: string;
  contentType: string;
  title: string;
  thumbnail: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  views: number;
  engagementScore: number;
  category: string;
  postedAt: string;
  socialBuzzDetected?: boolean;
}

interface MockCampaign {
  id: string;
  name: string;
  brand: string;
}

const CREATORS: MockCreator[] = rawCreators as unknown as MockCreator[];
const CONTENTS: MockContent[] = rawContents as unknown as MockContent[];
const CAMPAIGNS: MockCampaign[] = rawCampaigns as unknown as MockCampaign[];

const TIER_MAP: Record<TierLevel, "purple" | "green" | "blue"> = {
  GOLD: "purple",
  SILVER: "green",
  BRONZE: "blue",
};

const CATEGORIES = [
  "뷰티", "패션", "푸드", "테크", "리빙", "육아", "헬스", "여행", "라이프스타일", "인테리어",
];

const CONTENT_CATEGORIES = [
  "문학/종교/역사", "영화/방송", "미술/디자인", "음악/댄스", "육아/키즈",
  "결혼/연애", "홈/리빙", "패션", "뷰티", "문구/완구",
  "다이어트/건강보조식품", "피트니스", "취미", "사진/영상", "스포츠",
  "여행/관광", "F&B", "유명장소/핫플", "시사/이슈/정보", "일상",
  "교육", "자동차/모빌리티", "IT/테크", "건강가전", "공연/전시",
];

const PLATFORMS = [
  { id: "instagram", label: "인스타그램" },
  { id: "youtube", label: "유튜브" },
];

const CREATOR_SORT_OPTIONS: { value: CreatorSortField; label: string }[] = [
  { value: "engagement", label: "인게이지먼트순" },
  { value: "followers", label: "팔로워순" },
  { value: "campaignCount", label: "캠페인이력순" },
  { value: "salesPrice", label: "세일즈단가순" },
];

const CUSTOM_COLUMN_TYPES = ["텍스트", "숫자", "URL", "체크박스", "선택", "첨부 파일", "노트"] as const;

interface CustomColumn {
  id: string;
  name: string;
  type: (typeof CUSTOM_COLUMN_TYPES)[number];
}

type CustomColumnData = Record<string, Record<string, string | number | boolean>>;

const UPLOAD_PERIOD_OPTIONS = [
  { value: "", label: "전체" },
  { value: "1w", label: "1주" },
  { value: "1m", label: "1개월" },
  { value: "3m", label: "3개월" },
  { value: "6m", label: "6개월" },
  { value: "6m+", label: "6개월 이상" },
];

const PAGE_SIZE = 15;
const CONTENT_TOP_LIMIT = 100;

const TABS = [
  { key: "tab01", label: "크리에이터" },
  { key: "tab02", label: "콘텐츠" },
];

// ─── 유틸 ──────────────────────────────────────────────
function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString("ko-KR");
}

function formatCurrency(n: number): string {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString("ko-KR")}원`;
}

function calcEngagementScore(c: MockCreator): number {
  return (
    (c.avgComments * 5) +
    (c.avgVideoViews * 0.003) +
    (c.avgFeedLikes * 1) +
    (c.followers * 0.001)
  );
}

function calcContentEngagementScore(c: MockContent, creatorFollowers?: number): number {
  return (c.comments * 5) + (c.views * 0.003) + (c.likes * 1) + ((creatorFollowers ?? 0) * 0.001);
}

function getTopAudienceGender(g: { male: number; female: number }): string {
  if (g.female > g.male) return `여성 ${g.female}%`;
  if (g.male > g.female) return `남성 ${g.male}%`;
  return `동일 50%`;
}

function getTopAudienceAge(ages: Record<string, number>): string {
  const entries = Object.entries(ages);
  if (entries.length === 0) return "—";
  entries.sort((a, b) => b[1] - a[1]);
  return `${entries[0][0]} (${entries[0][1]}%)`;
}

function getTopCustomerAge(ages?: Record<string, number>): string {
  if (!ages) return "—";
  const entries = Object.entries(ages);
  if (entries.length === 0) return "—";
  entries.sort((a, b) => b[1] - a[1]);
  return `${entries[0][0]} (${entries[0][1]}%)`;
}

function isWithinPeriod(dateStr: string, period: string): boolean {
  if (!period) return true;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const dayMs = 86400000;
  switch (period) {
    case "1w": return diffMs <= 7 * dayMs;
    case "1m": return diffMs <= 30 * dayMs;
    case "3m": return diffMs <= 90 * dayMs;
    case "6m": return diffMs <= 180 * dayMs;
    case "6m+": return diffMs > 180 * dayMs;
    default: return true;
  }
}

function getCreatorById(id: string): MockCreator | undefined {
  return CREATORS.find((c) => c.id === id);
}

// ─── 메인 내부 컴포넌트 (useSearchParams 사용) ──────────
function SearchPageContent() {
  const searchParams = useSearchParams();

  // Tab state
  const initialTab = searchParams.get("tab") === "content" ? "tab02" : "tab01";
  const [activeTab, setActiveTab] = useState(initialTab);

  // URL params for pre-populated filters
  const urlCampaign = searchParams.get("campaign") ?? "";
  const urlCategories = searchParams.get("categories")?.split(",").filter(Boolean) ?? [];
  const urlBrand = searchParams.get("brand") ?? "";

  // ──────────────────────────────────────────────────────
  // TAB 1: 크리에이터 탐색
  // ──────────────────────────────────────────────────────
  const [creatorKeyword, setCreatorKeyword] = useState("");
  const [creatorKeywordCondition, setCreatorKeywordCondition] = useState<KeywordCondition>("or");
  const [creatorSearchScope, setCreatorSearchScope] = useState<SearchScope>("all");
  const [creatorExcludeKeyword, setCreatorExcludeKeyword] = useState("");
  const [creatorExcludeAccount, setCreatorExcludeAccount] = useState("");
  const [creatorPlatforms, setCreatorPlatforms] = useState<string[]>([]);
  const [creatorBrandSearch, setCreatorBrandSearch] = useState(urlBrand);
  const [creatorIncludeSimilarBrand, setCreatorIncludeSimilarBrand] = useState(false);
  const [creatorCoPurchase, setCreatorCoPurchase] = useState(false);
  const [creatorAdvancedFilters, setCreatorAdvancedFilters] = useState<AdvancedFilterState>({
    ...defaultAdvancedFilters,
    selectedCategories: urlCategories.filter((c) => CATEGORIES.includes(c)),
  });
  const [creatorSortBy, setCreatorSortBy] = useState<CreatorSortField>("engagement");
  const [creatorPage, setCreatorPage] = useState(1);
  const [creatorSelected, setCreatorSelected] = useState<Set<string>>(new Set());

  // Applied filters (committed on search)
  const [appliedCreatorFilters, setAppliedCreatorFilters] = useState({
    keyword: "",
    keywordCondition: "or" as KeywordCondition,
    searchScope: "all" as SearchScope,
    excludeKeyword: "",
    excludeAccount: "",
    platforms: [] as string[],
    brandSearch: urlBrand,
    includeSimilarBrand: false,
    coPurchase: false,
    advanced: {
      ...defaultAdvancedFilters,
      selectedCategories: urlCategories.filter((c) => CATEGORIES.includes(c)),
    } as AdvancedFilterState,
  });

  const [contactRequestDialogOpen, setContactRequestDialogOpen] = useState(false);
  const [contactRequestTarget, setContactRequestTarget] = useState<MockCreator | null>(null);
  const [contactRequestReason, setContactRequestReason] = useState("");
  const [contactRequestSent, setContactRequestSent] = useState(false);

  // 필터 바 state
  const [quickSearch, setQuickSearch] = useState("");
  const [quickCategories, setQuickCategories] = useState<string[]>([]);
  const [quickFollowerMin, setQuickFollowerMin] = useState("");
  const [quickFollowerMax, setQuickFollowerMax] = useState("");

  // 커스텀 컬럼 state
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [customColumnData, setCustomColumnData] = useState<CustomColumnData>({});
  const [customColumnDialogOpen, setCustomColumnDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState<CustomColumn["type"]>("텍스트");

  const handleCreatorSearch = useCallback(() => {
    setAppliedCreatorFilters({
      keyword: creatorKeyword,
      keywordCondition: creatorKeywordCondition,
      searchScope: creatorSearchScope,
      excludeKeyword: creatorExcludeKeyword,
      excludeAccount: creatorExcludeAccount,
      platforms: creatorPlatforms,
      brandSearch: creatorBrandSearch,
      includeSimilarBrand: creatorIncludeSimilarBrand,
      coPurchase: creatorCoPurchase,
      advanced: { ...creatorAdvancedFilters },
    });
    setCreatorPage(1);
    setCreatorSelected(new Set());
  }, [
    creatorKeyword, creatorKeywordCondition, creatorSearchScope,
    creatorExcludeKeyword, creatorExcludeAccount, creatorPlatforms,
    creatorBrandSearch, creatorIncludeSimilarBrand, creatorCoPurchase,
    creatorAdvancedFilters,
  ]);

  const handleCreatorReset = useCallback(() => {
    setCreatorKeyword("");
    setCreatorKeywordCondition("or");
    setCreatorSearchScope("all");
    setCreatorExcludeKeyword("");
    setCreatorExcludeAccount("");
    setCreatorPlatforms([]);
    setCreatorBrandSearch("");
    setCreatorIncludeSimilarBrand(false);
    setCreatorCoPurchase(false);
    setCreatorAdvancedFilters({ ...defaultAdvancedFilters });
    setAppliedCreatorFilters({
      keyword: "",
      keywordCondition: "or",
      searchScope: "all",
      excludeKeyword: "",
      excludeAccount: "",
      platforms: [],
      brandSearch: "",
      includeSimilarBrand: false,
      coPurchase: false,
      advanced: { ...defaultAdvancedFilters },
    });
    setCreatorPage(1);
    setCreatorSelected(new Set());
  }, []);

  const filteredCreators = useMemo(() => {
    const f = appliedCreatorFilters;
    let list = [...CREATORS];

    // Keyword search
    if (f.keyword) {
      const keywords = f.keyword.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((c) => {
        const matchFn = (kw: string) => {
          if (f.searchScope === "content") {
            return (
              c.category.some((cat) => cat.toLowerCase().includes(kw)) ||
              (c.introduction ?? "").toLowerCase().includes(kw)
            );
          }
          if (f.searchScope === "profile") {
            return (
              c.name.toLowerCase().includes(kw) ||
              c.handle.toLowerCase().includes(kw) ||
              c.biography.toLowerCase().includes(kw)
            );
          }
          // all
          return (
            c.name.toLowerCase().includes(kw) ||
            c.handle.toLowerCase().includes(kw) ||
            c.category.some((cat) => cat.toLowerCase().includes(kw)) ||
            c.biography.toLowerCase().includes(kw) ||
            (c.introduction ?? "").toLowerCase().includes(kw)
          );
        };
        return f.keywordCondition === "and"
          ? keywords.every(matchFn)
          : keywords.some(matchFn);
      });
    }

    // Exclude keyword
    if (f.excludeKeyword) {
      const excludes = f.excludeKeyword.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((c) =>
        !excludes.some((ex) =>
          c.name.toLowerCase().includes(ex) ||
          c.handle.toLowerCase().includes(ex) ||
          c.category.some((cat) => cat.toLowerCase().includes(ex)) ||
          c.biography.toLowerCase().includes(ex)
        )
      );
    }

    // Exclude account
    if (f.excludeAccount) {
      const excludeAccounts = f.excludeAccount.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((c) =>
        !excludeAccounts.some((ex) =>
          c.handle.toLowerCase().includes(ex) ||
          c.name.toLowerCase().includes(ex)
        )
      );
    }

    // Platform
    if (f.platforms.length > 0) {
      list = list.filter((c) => {
        const hasInstagram = f.platforms.includes("instagram");
        const hasYoutube = f.platforms.includes("youtube");
        if (hasInstagram && hasYoutube) return true;
        if (hasYoutube) return !!c.youtubeHandle;
        if (hasInstagram) return !!c.handle;
        return true;
      });
    }

    // Brand search (mock: match against campaign brand names)
    if (f.brandSearch) {
      const brandKw = f.brandSearch.toLowerCase();
      const matchingCampaignIds = CAMPAIGNS
        .filter((camp) => camp.brand.toLowerCase().includes(brandKw))
        .map((camp) => camp.id);
      if (matchingCampaignIds.length > 0) {
        list = list.filter((c) =>
          c.campaigns.some((cid) => matchingCampaignIds.includes(cid))
        );
      } else {
        list = list.filter((c) =>
          c.biography.toLowerCase().includes(brandKw) ||
          (c.introduction ?? "").toLowerCase().includes(brandKw)
        );
      }
    }

    // Co-purchase
    if (f.coPurchase) {
      list = list.filter((c) => c.hasCoPurchase);
    }

    // Advanced filters
    const adv = f.advanced;
    if (adv.selectedCategories.length > 0) {
      list = list.filter((c) =>
        adv.selectedCategories.some((cat) => c.category.includes(cat))
      );
    }
    if (adv.recentUploadPeriod) {
      list = list.filter((c) => isWithinPeriod(c.recentUploadDate, adv.recentUploadPeriod));
    }
    if (adv.followerMin) {
      list = list.filter((c) => c.followers >= Number(adv.followerMin));
    }
    if (adv.followerMax) {
      list = list.filter((c) => c.followers <= Number(adv.followerMax));
    }
    if (adv.hasVerificationBadge !== "all") {
      list = list.filter((c) =>
        adv.hasVerificationBadge === "yes" ? c.hasVerificationBadge : !c.hasVerificationBadge
      );
    }
    if (adv.avgFeedLikesMin) {
      list = list.filter((c) => c.avgFeedLikes >= Number(adv.avgFeedLikesMin));
    }
    if (adv.avgFeedLikesMax) {
      list = list.filter((c) => c.avgFeedLikes <= Number(adv.avgFeedLikesMax));
    }
    if (adv.avgVideoLikesMin) {
      list = list.filter((c) => c.avgVideoLikes >= Number(adv.avgVideoLikesMin));
    }
    if (adv.avgVideoLikesMax) {
      list = list.filter((c) => c.avgVideoLikes <= Number(adv.avgVideoLikesMax));
    }
    if (adv.avgVideoViewsMin) {
      list = list.filter((c) => c.avgVideoViews >= Number(adv.avgVideoViewsMin));
    }
    if (adv.avgVideoViewsMax) {
      list = list.filter((c) => c.avgVideoViews <= Number(adv.avgVideoViewsMax));
    }
    if (adv.erMin) {
      list = list.filter((c) => c.engagementRate >= Number(adv.erMin));
    }
    if (adv.erMax) {
      list = list.filter((c) => c.engagementRate <= Number(adv.erMax));
    }
    if (adv.estimatedReachMin) {
      list = list.filter((c) => c.estimatedReach >= Number(adv.estimatedReachMin));
    }
    if (adv.estimatedReachMax) {
      list = list.filter((c) => c.estimatedReach <= Number(adv.estimatedReachMax));
    }
    if (adv.avgShortsViewsMin) {
      list = list.filter((c) => (c.avgShortsViews ?? 0) >= Number(adv.avgShortsViewsMin));
    }
    if (adv.avgShortsViewsMax) {
      list = list.filter((c) => (c.avgShortsViews ?? 0) <= Number(adv.avgShortsViewsMax));
    }
    if (adv.audienceGender !== "all") {
      list = list.filter((c) =>
        adv.audienceGender === "female"
          ? c.audienceGender.female > c.audienceGender.male
          : c.audienceGender.male > c.audienceGender.female
      );
    }

    // Quick filters (필터 바)
    if (quickSearch) {
      const kw = quickSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.handle.toLowerCase().includes(kw) ||
          c.name.toLowerCase().includes(kw) ||
          c.category.some((cat) => cat.toLowerCase().includes(kw))
      );
    }
    if (quickCategories.length > 0) {
      list = list.filter((c) =>
        quickCategories.some((cat) => c.category.includes(cat))
      );
    }
    if (quickFollowerMin) {
      list = list.filter((c) => c.followers >= Number(quickFollowerMin));
    }
    if (quickFollowerMax) {
      list = list.filter((c) => c.followers <= Number(quickFollowerMax));
    }

    // Sort: OnTner members always boosted to top, then by sort field
    list.sort((a, b) => {
      // OnTner members first
      if (a.isOntnerMember && !b.isOntnerMember) return -1;
      if (!a.isOntnerMember && b.isOntnerMember) return 1;

      switch (creatorSortBy) {
        case "engagement":
          return calcEngagementScore(b) - calcEngagementScore(a);
        case "followers":
          return b.followers - a.followers;
        case "campaignCount":
          return b.ontnerCampaignCount - a.ontnerCampaignCount;
        case "salesPrice":
          return (b.salesPrice ?? 0) - (a.salesPrice ?? 0);
        default:
          return 0;
      }
    });

    return list;
  }, [appliedCreatorFilters, creatorSortBy, quickSearch, quickCategories, quickFollowerMin, quickFollowerMax]);

  const creatorTotalPages = Math.ceil(filteredCreators.length / PAGE_SIZE);
  const creatorPageData = filteredCreators.slice(
    (creatorPage - 1) * PAGE_SIZE,
    creatorPage * PAGE_SIZE
  );

  const toggleCreatorSelect = (id: string) => {
    const next = new Set(creatorSelected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCreatorSelected(next);
  };

  const toggleAllCreators = () => {
    if (creatorPageData.every((c) => creatorSelected.has(c.id))) {
      const next = new Set(creatorSelected);
      creatorPageData.forEach((c) => next.delete(c.id));
      setCreatorSelected(next);
    } else {
      const next = new Set(creatorSelected);
      creatorPageData.forEach((c) => next.add(c.id));
      setCreatorSelected(next);
    }
  };

  const allCreatorPageSelected =
    creatorPageData.length > 0 && creatorPageData.every((c) => creatorSelected.has(c.id));

  // ── 커스텀 컬럼 셀 렌더링 ──
  const updateCustomCell = useCallback(
    (creatorId: string, colId: string, value: string | number | boolean) => {
      setCustomColumnData((prev) => ({
        ...prev,
        [creatorId]: { ...prev[creatorId], [colId]: value },
      }));
    },
    []
  );

  const renderCustomCell = useCallback(
    (creatorId: string, col: CustomColumn) => {
      const val = customColumnData[creatorId]?.[col.id] ?? "";
      const inputStyle = { height: 26, fontSize: 11, width: "100%", border: "1px solid var(--otr-border)", borderRadius: 3, padding: "0 4px" };
      switch (col.type) {
        case "체크박스":
          return (
            <input
              type="checkbox"
              checked={!!val}
              onChange={(e) => updateCustomCell(creatorId, col.id, e.target.checked)}
            />
          );
        case "숫자":
          return (
            <input
              type="number"
              style={inputStyle}
              value={val as string}
              onChange={(e) => updateCustomCell(creatorId, col.id, e.target.value)}
            />
          );
        case "선택":
          return (
            <input
              type="text"
              style={inputStyle}
              placeholder="값 입력"
              value={val as string}
              onChange={(e) => updateCustomCell(creatorId, col.id, e.target.value)}
            />
          );
        case "첨부 파일":
          return (
            <div style={{ fontSize: 10 }}>
              {val ? String(val) : <input type="file" style={{ fontSize: 10, width: 90 }} onChange={(e) => updateCustomCell(creatorId, col.id, e.target.files?.[0]?.name ?? "")} />}
            </div>
          );
        case "노트":
          return (
            <textarea
              style={{ ...inputStyle, height: 40, resize: "none" }}
              value={val as string}
              onChange={(e) => updateCustomCell(creatorId, col.id, e.target.value)}
            />
          );
        default: // 텍스트, URL
          return (
            <input
              type={col.type === "URL" ? "url" : "text"}
              style={inputStyle}
              placeholder={col.type === "URL" ? "https://..." : ""}
              value={val as string}
              onChange={(e) => updateCustomCell(creatorId, col.id, e.target.value)}
            />
          );
      }
    },
    [customColumnData, updateCustomCell]
  );

  // ── CSV 다운로드 ──
  const handleCsvDownload = useCallback(() => {
    const headers = [
      "No", "이름", "핸들", "플랫폼", "바이오그래피", "카테고리",
      "온트너회원여부", "온트너 캠페인 진행횟수", "평균 성과(취급고)",
      "캠페인 상품 평균 단가", "캠페인 주문고객 나이", "리워드링크사용여부",
      "컨택메일", "최근업로드일", "팔로워수", "ER",
      "평균 피드 좋아요 수", "평균 동영상 좋아요 수", "평균 댓글 수",
      "오디언스 성별", "오디언스 나이",
      ...customColumns.map((c) => c.name),
    ];

    const rows = filteredCreators.map((c, i) => [
      i + 1,
      c.name,
      c.handle,
      c.youtubeHandle ? "인스타그램, 유튜브" : "인스타그램",
      c.biography,
      c.category.join(", "),
      c.isOntnerMember ? "Y" : "N",
      c.ontnerCampaignCount,
      c.avgPerformance ?? "",
      c.avgProductPrice ?? "",
      getTopCustomerAge(c.customerAge),
      c.rewardLinkUsage ? "Y" : "N",
      c.contactEmail,
      c.recentUploadDate,
      c.followers,
      c.engagementRate,
      c.avgFeedLikes,
      c.avgVideoLikes,
      c.avgComments,
      getTopAudienceGender(c.audienceGender),
      getTopAudienceAge(c.audienceAge),
      ...customColumns.map((col) => customColumnData[c.id]?.[col.id] ?? ""),
    ]);

    const bom = "\uFEFF";
    const csvContent =
      bom +
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `크리에이터_탐색_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredCreators, customColumns, customColumnData]);

  // Get active platform for advanced filter
  const activePlatform: "instagram" | "youtube" | "" =
    creatorPlatforms.length === 1
      ? (creatorPlatforms[0] as "instagram" | "youtube")
      : "";

  // ──────────────────────────────────────────────────────
  // TAB 2: 콘텐츠 기반 탐색
  // ──────────────────────────────────────────────────────
  const [contentPlatforms, setContentPlatforms] = useState<string[]>([]);
  const [contentIncludeKeyword, setContentIncludeKeyword] = useState("");
  const [contentExcludeKeyword, setContentExcludeKeyword] = useState("");
  const [contentCategories, setContentCategories] = useState<string[]>([]);
  const [contentUploadPeriod, setContentUploadPeriod] = useState("");
  // Advanced content filters
  const [contentAdvLikesMin, setContentAdvLikesMin] = useState("");
  const [contentAdvLikesMax, setContentAdvLikesMax] = useState("");
  const [contentAdvViewsMin, setContentAdvViewsMin] = useState("");
  const [contentAdvViewsMax, setContentAdvViewsMax] = useState("");
  const [contentAdvCommentsMin, setContentAdvCommentsMin] = useState("");
  const [contentAdvCommentsMax, setContentAdvCommentsMax] = useState("");
  const [contentAdvErMin, setContentAdvErMin] = useState("");
  const [contentAdvErMax, setContentAdvErMax] = useState("");
  const [contentAdvGender, setContentAdvGender] = useState("all");
  const [contentAdvAgeMin, setContentAdvAgeMin] = useState("");
  const [contentAdvAgeMax, setContentAdvAgeMax] = useState("");
  const [contentAdvFollowerMin, setContentAdvFollowerMin] = useState("");
  const [contentAdvFollowerMax, setContentAdvFollowerMax] = useState("");
  const [contentAdvVideoLikesMin, setContentAdvVideoLikesMin] = useState("");
  const [contentAdvVideoLikesMax, setContentAdvVideoLikesMax] = useState("");
  const [contentAdvCoPurchase, setContentAdvCoPurchase] = useState(false);
  const [contentAdvBrand, setContentAdvBrand] = useState("");
  const [contentAdvIncludeSimilarBrand, setContentAdvIncludeSimilarBrand] = useState(false);
  const [contentAdvExpanded, setContentAdvExpanded] = useState(false);

  // Applied content filters
  const [appliedContentFilters, setAppliedContentFilters] = useState({
    platforms: [] as string[],
    includeKeyword: "",
    excludeKeyword: "",
    categories: [] as string[],
    uploadPeriod: "",
    likesMin: "", likesMax: "",
    videoLikesMin: "", videoLikesMax: "",
    viewsMin: "", viewsMax: "",
    commentsMin: "", commentsMax: "",
    erMin: "", erMax: "",
    gender: "all",
    ageMin: "", ageMax: "",
    followerMin: "", followerMax: "",
    coPurchase: false,
    brand: "",
    includeSimilarBrand: false,
  });


  const handleContentSearch = useCallback(() => {
    setAppliedContentFilters({
      platforms: contentPlatforms,
      includeKeyword: contentIncludeKeyword,
      excludeKeyword: contentExcludeKeyword,
      categories: contentCategories,
      uploadPeriod: contentUploadPeriod,
      likesMin: contentAdvLikesMin, likesMax: contentAdvLikesMax,
      videoLikesMin: contentAdvVideoLikesMin, videoLikesMax: contentAdvVideoLikesMax,
      viewsMin: contentAdvViewsMin, viewsMax: contentAdvViewsMax,
      commentsMin: contentAdvCommentsMin, commentsMax: contentAdvCommentsMax,
      erMin: contentAdvErMin, erMax: contentAdvErMax,
      gender: contentAdvGender,
      ageMin: contentAdvAgeMin, ageMax: contentAdvAgeMax,
      followerMin: contentAdvFollowerMin, followerMax: contentAdvFollowerMax,
      coPurchase: contentAdvCoPurchase,
      brand: contentAdvBrand,
      includeSimilarBrand: contentAdvIncludeSimilarBrand,
    });
  }, [
    contentPlatforms, contentIncludeKeyword, contentExcludeKeyword,
    contentCategories, contentUploadPeriod,
    contentAdvLikesMin, contentAdvLikesMax,
    contentAdvVideoLikesMin, contentAdvVideoLikesMax,
    contentAdvViewsMin, contentAdvViewsMax,
    contentAdvCommentsMin, contentAdvCommentsMax,
    contentAdvErMin, contentAdvErMax,
    contentAdvGender, contentAdvAgeMin, contentAdvAgeMax,
    contentAdvFollowerMin, contentAdvFollowerMax,
    contentAdvCoPurchase, contentAdvBrand, contentAdvIncludeSimilarBrand,
  ]);

  const handleContentReset = useCallback(() => {
    setContentPlatforms([]);
    setContentIncludeKeyword("");
    setContentExcludeKeyword("");
    setContentCategories([]);
    setContentUploadPeriod("");
    setContentAdvLikesMin(""); setContentAdvLikesMax("");
    setContentAdvVideoLikesMin(""); setContentAdvVideoLikesMax("");
    setContentAdvViewsMin(""); setContentAdvViewsMax("");
    setContentAdvCommentsMin(""); setContentAdvCommentsMax("");
    setContentAdvErMin(""); setContentAdvErMax("");
    setContentAdvGender("all");
    setContentAdvAgeMin(""); setContentAdvAgeMax("");
    setContentAdvFollowerMin(""); setContentAdvFollowerMax("");
    setContentAdvCoPurchase(false);
    setContentAdvBrand("");
    setContentAdvIncludeSimilarBrand(false);
    setAppliedContentFilters({
      platforms: [], includeKeyword: "", excludeKeyword: "",
      categories: [], uploadPeriod: "",
      likesMin: "", likesMax: "",
      videoLikesMin: "", videoLikesMax: "",
      viewsMin: "", viewsMax: "",
      commentsMin: "", commentsMax: "",
      erMin: "", erMax: "",
      gender: "all", ageMin: "", ageMax: "",
      followerMin: "", followerMax: "",
      coPurchase: false, brand: "", includeSimilarBrand: false,
    });
  }, []);

  const filteredContents = useMemo(() => {
    const f = appliedContentFilters;
    let list = [...CONTENTS];

    if (f.platforms.length > 0) {
      list = list.filter((c) => f.platforms.includes(c.platform));
    }
    if (f.includeKeyword) {
      const kw = f.includeKeyword.toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(kw) ||
        c.category.toLowerCase().includes(kw)
      );
    }
    if (f.excludeKeyword) {
      const kw = f.excludeKeyword.toLowerCase();
      list = list.filter((c) =>
        !c.title.toLowerCase().includes(kw) &&
        !c.category.toLowerCase().includes(kw)
      );
    }
    if (f.categories.length > 0) {
      list = list.filter((c) => f.categories.includes(c.category));
    }
    if (f.uploadPeriod) {
      list = list.filter((c) => isWithinPeriod(c.postedAt, f.uploadPeriod));
    }
    // Advanced: feed likes (content-level likes)
    if (f.likesMin) list = list.filter((c) => c.likes >= Number(f.likesMin));
    if (f.likesMax) list = list.filter((c) => c.likes <= Number(f.likesMax));
    // Advanced: video likes (creator-level avgVideoLikes)
    if (f.videoLikesMin || f.videoLikesMax) {
      list = list.filter((c) => {
        const creator = getCreatorById(c.creatorId);
        if (!creator) return true;
        if (f.videoLikesMin && creator.avgVideoLikes < Number(f.videoLikesMin)) return false;
        if (f.videoLikesMax && creator.avgVideoLikes > Number(f.videoLikesMax)) return false;
        return true;
      });
    }
    // Advanced: views
    if (f.viewsMin) list = list.filter((c) => c.views >= Number(f.viewsMin));
    if (f.viewsMax) list = list.filter((c) => c.views <= Number(f.viewsMax));
    // Advanced: comments
    if (f.commentsMin) list = list.filter((c) => c.comments >= Number(f.commentsMin));
    if (f.commentsMax) list = list.filter((c) => c.comments <= Number(f.commentsMax));
    // Advanced: ER% (use creator's ER)
    if (f.erMin || f.erMax) {
      list = list.filter((c) => {
        const creator = getCreatorById(c.creatorId);
        if (!creator) return true;
        if (f.erMin && creator.engagementRate < Number(f.erMin)) return false;
        if (f.erMax && creator.engagementRate > Number(f.erMax)) return false;
        return true;
      });
    }
    // Advanced: audience gender
    if (f.gender !== "all") {
      list = list.filter((c) => {
        const creator = getCreatorById(c.creatorId);
        if (!creator) return true;
        return f.gender === "female"
          ? creator.audienceGender.female > creator.audienceGender.male
          : creator.audienceGender.male > creator.audienceGender.female;
      });
    }
    // Advanced: followers
    if (f.followerMin || f.followerMax) {
      list = list.filter((c) => {
        const creator = getCreatorById(c.creatorId);
        if (!creator) return true;
        if (f.followerMin && creator.followers < Number(f.followerMin)) return false;
        if (f.followerMax && creator.followers > Number(f.followerMax)) return false;
        return true;
      });
    }
    // Advanced: co-purchase
    if (f.coPurchase) {
      list = list.filter((c) => {
        const creator = getCreatorById(c.creatorId);
        return creator ? creator.hasCoPurchase : false;
      });
    }
    // Advanced: brand
    if (f.brand) {
      const brandKw = f.brand.toLowerCase();
      const matchingCampaignIds = CAMPAIGNS
        .filter((camp) => camp.brand.toLowerCase().includes(brandKw))
        .map((camp) => camp.id);
      if (matchingCampaignIds.length > 0) {
        list = list.filter((c) =>
          c.campaignId && matchingCampaignIds.includes(c.campaignId)
        );
      }
    }

    // Sort by engagement score (comments > views > likes > followers; shares excluded)
    list.sort((a, b) =>
      calcContentEngagementScore(b, getCreatorById(b.creatorId)?.followers) -
      calcContentEngagementScore(a, getCreatorById(a.creatorId)?.followers)
    );

    // Top 50
    return list.slice(0, CONTENT_TOP_LIMIT);
  }, [appliedContentFilters]);

  const toggleContentCategory = (cat: string) => {
    setContentCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // 댓글 보정값 계산 (소셜비즈 사용 시 실제 댓글의 약 50%)
  const getAdjustedComments = (content: MockContent): { raw: number; adjusted: number | null; detected: boolean } => {
    const detected = !!content.socialBuzzDetected;
    return {
      raw: content.comments,
      adjusted: detected ? Math.round(content.comments * 0.5) : null,
      detected,
    };
  };

  // ──────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────
  return (
    <TooltipProvider>
      <PageHeader
        title="크리에이터 탐색"
        description="인사이트 · 피처링 전체 크리에이터 풀에서 탐색하고 캠페인에 제안하세요"
      />

      <main className="flex-1 p-4 space-y-3">
        <OtrTabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {/* ════════════════════════════════════════════════ */}
        {/* TAB 01: 크리에이터 탐색                          */}
        {/* ════════════════════════════════════════════════ */}
        {activeTab === "tab01" && (
          <>
            {/* ── 조회 조건 패널 ── */}
            <OtrSearchPanel onSearch={handleCreatorSearch} onReset={handleCreatorReset}>
              <OtrFormGrid columns={4}>
                {/* 키워드 검색 */}
                <OtrFormField label="키워드 검색" span={3}>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="kwCondition"
                          checked={creatorKeywordCondition === "or"}
                          onChange={() => setCreatorKeywordCondition("or")}
                        />
                        OR
                      </label>
                      <label className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="kwCondition"
                          checked={creatorKeywordCondition === "and"}
                          onChange={() => setCreatorKeywordCondition("and")}
                        />
                        AND
                      </label>
                      <select
                        className="ml-4 text-xs"
                        style={{ height: 26, padding: "0 8px" }}
                        value={creatorSearchScope}
                        onChange={(e) => setCreatorSearchScope(e.target.value as SearchScope)}
                      >
                        <option value="all">전체</option>
                        <option value="content">콘텐츠에서 검색</option>
                        <option value="profile">프로필에서 검색</option>
                      </select>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        className="w-full pl-7 pr-3"
                        placeholder="키워드를 입력하세요 (공백으로 구분)"
                        value={creatorKeyword}
                        onChange={(e) => setCreatorKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreatorSearch()}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          className="w-full pl-2 pr-3 text-xs"
                          placeholder="제외 키워드"
                          value={creatorExcludeKeyword}
                          onChange={(e) => setCreatorExcludeKeyword(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          className="w-full pl-2 pr-3 text-xs"
                          placeholder="계정명 제외 키워드"
                          value={creatorExcludeAccount}
                          onChange={(e) => setCreatorExcludeAccount(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </OtrFormField>

                {/* 플랫폼 */}
                <OtrFormField label="플랫폼">
                  <OtrPlatformToggle
                    platforms={PLATFORMS}
                    selected={creatorPlatforms}
                    onChange={setCreatorPlatforms}
                  />
                </OtrFormField>

                {/* 브랜드 검색 */}
                <OtrFormField label="브랜드 검색" span={2}>
                  <div className="space-y-1">
                    <input
                      type="text"
                      className="w-full px-2"
                      placeholder="브랜드명을 입력하세요"
                      value={creatorBrandSearch}
                      onChange={(e) => setCreatorBrandSearch(e.target.value)}
                    />
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={creatorIncludeSimilarBrand}
                        onChange={(e) => setCreatorIncludeSimilarBrand(e.target.checked)}
                      />
                      유사 브랜드 포함
                    </label>
                  </div>
                </OtrFormField>

                {/* 공동구매 */}
                <OtrFormField label="공동구매">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={creatorCoPurchase}
                      onChange={(e) => setCreatorCoPurchase(e.target.checked)}
                    />
                    공동구매 진행 계정만
                  </label>
                </OtrFormField>
              </OtrFormGrid>

              {/* 고급 필터 */}
              <div className="mt-2">
                <OtrAdvancedFilterPanel
                  platform={activePlatform}
                  filters={creatorAdvancedFilters}
                  onChange={setCreatorAdvancedFilters}
                />
              </div>

              <p className="text-[10px] text-muted-foreground mt-2">
                * X, 틱톡, 네이버블로그 탐색은 피처링 화면에서 이용하세요.
              </p>
            </OtrSearchPanel>

            {/* ── 결과 툴바 ── */}
            <OtrToolbar
              leftContent={
                <span className="text-xs text-muted-foreground">
                  총{" "}
                  <strong className="text-foreground">{filteredCreators.length}</strong>명
                  {creatorSelected.size > 0 && (
                    <span className="ml-2 text-[var(--otr-accent-purple)] font-semibold">
                      {creatorSelected.size}명 선택됨
                    </span>
                  )}
                </span>
              }
            >
              {creatorSelected.size >= 2 && (
                <Link href={`/ontrust/creator/similarity?ids=${[...creatorSelected].join(",")}`}>
                  <button className="otr-btn-primary flex items-center gap-1.5">
                    <GitCompare className="w-3.5 h-3.5" />
                    팔로워 유사도 분석 ({creatorSelected.size}명)
                  </button>
                </Link>
              )}
              {creatorSelected.size > 0 && (
                <>
                  <button
                    className="otr-btn-primary flex items-center gap-1.5"
                    onClick={() => {
                      setContactRequestTarget(null);
                      setContactRequestReason("");
                      setContactRequestSent(false);
                      setContactRequestDialogOpen(true);
                    }}
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    컨택 요청 ({creatorSelected.size}명)
                  </button>
                </>
              )}

              <button
                className="otr-btn-toolbar flex items-center gap-1.5"
                onClick={() => setCustomColumnDialogOpen(true)}
              >
                <Plus className="w-3.5 h-3.5" />
                컬럼 추가
              </button>
              <button
                className="otr-btn-toolbar flex items-center gap-1.5"
                onClick={handleCsvDownload}
              >
                <Download className="w-3.5 h-3.5" />
                엑셀 다운로드
              </button>

              <select
                style={{ height: "var(--otr-btn-height)", fontSize: "var(--otr-font-body)" }}
                className="border border-[var(--otr-border)] rounded px-2 bg-background"
                value={creatorSortBy}
                onChange={(e) => setCreatorSortBy(e.target.value as CreatorSortField)}
              >
                {CREATOR_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </OtrToolbar>

            {/* ── 필터 바 ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                padding: "8px 12px",
                background: "var(--otr-bg-toolbar)",
                borderBottom: "1px solid var(--otr-border)",
                fontSize: "var(--otr-font-body)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="아이디 / 카테고리 검색"
                  style={{ height: "var(--otr-input-height)", fontSize: "var(--otr-font-body)", width: 180, border: "1px solid var(--otr-border)", borderRadius: 4, padding: "0 8px" }}
                  value={quickSearch}
                  onChange={(e) => { setQuickSearch(e.target.value); setCreatorPage(1); }}
                />
              </div>

              <span style={{ color: "var(--otr-text-secondary)", fontSize: 11 }}>카테고리</span>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={quickCategories.includes(cat) ? "otr-classification otr-classification-active" : "otr-classification"}
                    style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, border: "1px solid var(--otr-border)", background: quickCategories.includes(cat) ? "var(--otr-accent-purple)" : "white", color: quickCategories.includes(cat) ? "white" : "var(--otr-text-primary)", cursor: "pointer" }}
                    onClick={() => {
                      setQuickCategories((prev) =>
                        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                      );
                      setCreatorPage(1);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <span style={{ color: "var(--otr-text-secondary)", fontSize: 11, marginLeft: 8 }}>팔로워</span>
              <input
                type="number"
                placeholder="최소"
                style={{ height: "var(--otr-input-height)", fontSize: 11, width: 80, border: "1px solid var(--otr-border)", borderRadius: 4, padding: "0 6px" }}
                value={quickFollowerMin}
                onChange={(e) => { setQuickFollowerMin(e.target.value); setCreatorPage(1); }}
              />
              <span style={{ color: "var(--otr-text-secondary)" }}>~</span>
              <input
                type="number"
                placeholder="최대"
                style={{ height: "var(--otr-input-height)", fontSize: 11, width: 80, border: "1px solid var(--otr-border)", borderRadius: 4, padding: "0 6px" }}
                value={quickFollowerMax}
                onChange={(e) => { setQuickFollowerMax(e.target.value); setCreatorPage(1); }}
              />
            </div>

            {/* ── 결과 테이블 ── */}
            <div style={{ overflowX: "auto" }}>
              <table className="otr-sticky-table" style={{ minWidth: 2100 }}>
                <thead>
                  <tr>
                    <th style={{ width: 36, textAlign: "center", position: "sticky", left: 0, zIndex: 2, background: "var(--otr-bg-toolbar)" }}>
                      <input
                        type="checkbox"
                        checked={allCreatorPageSelected}
                        onChange={toggleAllCreators}
                      />
                    </th>
                    <th style={{ width: 36, textAlign: "center", position: "sticky", left: 36, zIndex: 2, background: "var(--otr-bg-toolbar)" }}>No</th>
                    <th style={{ width: 240, position: "sticky", left: 72, zIndex: 2, background: "var(--otr-bg-toolbar)" }}>크리에이터 정보</th>
                    <th style={{ width: 80, textAlign: "center", position: "sticky", left: 312, zIndex: 2, background: "var(--otr-bg-toolbar)" }}>액션</th>
                    <th style={{ width: 130 }}>카테고리</th>
                    <th style={{ width: 65, textAlign: "center" }}>온트너회원</th>
                    <th style={{ width: 75, textAlign: "center" }}>캠페인 진행횟수</th>
                    <th style={{ width: 100, textAlign: "right" }}>평균 성과(취급고)</th>
                    <th style={{ width: 95, textAlign: "right" }}>캠페인 상품 평균 단가</th>
                    <th style={{ width: 90, textAlign: "center" }}>주문고객 나이</th>
                    <th style={{ width: 60, textAlign: "center" }}>리워드링크</th>
                    <th style={{ width: 140 }}>컨택메일</th>
                    <th style={{ width: 90, textAlign: "center" }}>최근업로드일</th>
                    <th style={{ width: 75, textAlign: "right" }}>팔로워수</th>
                    <th style={{ width: 55, textAlign: "right" }}>ER</th>
                    <th style={{ width: 80, textAlign: "right" }}>평균 피드 좋아요 수</th>
                    <th style={{ width: 85, textAlign: "right" }}>평균 동영상 좋아요 수</th>
                    <th style={{ width: 75, textAlign: "right" }}>평균 댓글 수</th>
                    <th style={{ width: 70, textAlign: "center" }}>댓글자동화툴</th>
                    <th style={{ width: 90, textAlign: "center" }}>오디언스 성별</th>
                    <th style={{ width: 100, textAlign: "center" }}>오디언스 나이</th>
                    {customColumns.map((col) => (
                      <th key={col.id} style={{ width: 120, textAlign: "center" }}>
                        <div className="flex items-center justify-center gap-1">
                          <span>{col.name}</span>
                          <button
                            className="text-red-400 hover:text-red-600"
                            style={{ fontSize: 10, lineHeight: 1 }}
                            onClick={() => setCustomColumns((prev) => prev.filter((c) => c.id !== col.id))}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {creatorPageData.length === 0 ? (
                    <tr>
                      <td colSpan={21 + customColumns.length} style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                        검색 결과가 없습니다. 조건을 변경하여 다시 조회하세요.
                      </td>
                    </tr>
                  ) : (
                    creatorPageData.map((creator, idx) => {
                      const rowNum = (creatorPage - 1) * PAGE_SIZE + idx + 1;
                      return (
                        <tr
                          key={creator.id}
                          style={{
                            backgroundColor: creatorSelected.has(creator.id)
                              ? "var(--otr-accent-purple-light)"
                              : undefined,
                          }}
                        >
                          {/* Checkbox */}
                          <td style={{ textAlign: "center", position: "sticky", left: 0, zIndex: 1, background: creatorSelected.has(creator.id) ? "var(--otr-accent-purple-light)" : "var(--otr-bg-toolbar)" }}>
                            <input
                              type="checkbox"
                              checked={creatorSelected.has(creator.id)}
                              onChange={() => toggleCreatorSelect(creator.id)}
                            />
                          </td>
                          {/* No */}
                          <td style={{ textAlign: "center", color: "var(--otr-text-secondary)", position: "sticky", left: 36, zIndex: 1, background: creatorSelected.has(creator.id) ? "var(--otr-accent-purple-light)" : "var(--otr-bg-toolbar)" }}>
                            {rowNum}
                          </td>
                          {/* 크리에이터 정보 */}
                          <td style={{ position: "sticky", left: 72, zIndex: 1, background: creatorSelected.has(creator.id) ? "var(--otr-accent-purple-light)" : "var(--otr-bg-toolbar)" }}>
                            <Link
                              href={`/ontrust/creator/${creator.id}`}
                              className="flex items-start gap-2 hover:underline"
                            >
                              <div
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "50%",
                                  background: "var(--otr-accent-purple-light)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "var(--otr-accent-purple)",
                                  flexShrink: 0,
                                }}
                              >
                                {creator.name.charAt(0)}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div className="flex items-center gap-1">
                                  <span style={{ fontWeight: 600, fontSize: "var(--otr-font-body)" }}>
                                    {creator.name}
                                  </span>
                                  <Instagram className="w-3 h-3 text-pink-500 flex-shrink-0" />
                                  {creator.youtubeHandle && (
                                    <Youtube className="w-3 h-3 text-red-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                                  @{creator.handle}
                                </div>
                                <div style={{ fontSize: 10, color: "var(--otr-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
                                  {creator.biography}
                                </div>
                              </div>
                            </Link>
                          </td>
                          {/* 액션 */}
                          <td style={{ textAlign: "center", position: "sticky", left: 312, zIndex: 1, background: creatorSelected.has(creator.id) ? "var(--otr-accent-purple-light)" : "var(--otr-bg-toolbar)" }}>
                            <div className="flex flex-col gap-1 items-center">
                              <Link href={`/ontrust/creator/${creator.id}`}>
                                <button className="otr-btn-toolbar px-2" style={{ fontSize: 10 }}>
                                  <Eye className="w-3 h-3 inline mr-0.5" />상세
                                </button>
                              </Link>
                              <button
                                className="otr-btn-toolbar px-2"
                                style={{ fontSize: 10 }}
                                onClick={() => {
                                  setContactRequestTarget(creator);
                                  setContactRequestReason("");
                                  setContactRequestSent(false);
                                  setContactRequestDialogOpen(true);
                                }}
                              >
                                <Megaphone className="w-3 h-3 inline mr-0.5" />컨택
                              </button>
                            </div>
                          </td>
                          {/* 카테고리 */}
                          <td>
                            <div className="flex flex-wrap gap-0.5">
                              {creator.category.slice(0, 2).map((cat) => (
                                <span key={cat} className="otr-badge otr-badge-blue">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </td>
                          {/* 온트너 */}
                          <td style={{ textAlign: "center" }}>
                            {creator.isOntnerMember ? (
                              <span className="otr-badge otr-badge-green" style={{ fontSize: 10 }}>Y</span>
                            ) : (
                              <span style={{ color: "#ccc", fontSize: 10 }}>N</span>
                            )}
                          </td>
                          {/* 캠페인 진행횟수 */}
                          <td style={{ textAlign: "center" }}>
                            {creator.ontnerCampaignCount > 0 ? (
                              <span style={{ fontWeight: 600, color: "var(--otr-accent-purple)" }}>
                                {creator.ontnerCampaignCount}회
                              </span>
                            ) : (
                              <span style={{ color: "#ccc" }}>—</span>
                            )}
                          </td>
                          {/* 평균 성과(취급고) */}
                          <td style={{ textAlign: "right" }}>
                            {creator.avgPerformance
                              ? formatCurrency(creator.avgPerformance)
                              : "—"}
                          </td>
                          {/* 캠페인 상품 평균 단가 */}
                          <td style={{ textAlign: "right" }}>
                            {creator.avgProductPrice
                              ? `${formatNumber(creator.avgProductPrice)}원`
                              : "—"}
                          </td>
                          {/* 주문고객 나이 */}
                          <td style={{ textAlign: "center", fontSize: 11 }}>
                            {getTopCustomerAge(creator.customerAge)}
                          </td>
                          {/* 리워드링크 */}
                          <td style={{ textAlign: "center" }}>
                            {creator.rewardLinkUsage ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mx-auto" />
                            ) : (
                              <span style={{ color: "#ccc" }}>—</span>
                            )}
                          </td>
                          {/* 컨택메일 */}
                          <td style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                            {creator.contactEmail || "—"}
                          </td>
                          {/* 최근업로드일 */}
                          <td style={{ textAlign: "center", fontSize: 11 }}>
                            {creator.recentUploadDate || "—"}
                          </td>
                          {/* 팔로워수 */}
                          <td style={{ textAlign: "right", fontWeight: 600 }}>
                            {formatNumber(creator.followers)}
                          </td>
                          {/* ER */}
                          <td style={{ textAlign: "right" }}>
                            <span
                              style={{
                                color: creator.engagementRate >= 5
                                  ? "#22c55e"
                                  : creator.engagementRate >= 3
                                    ? "var(--otr-text-primary)"
                                    : "#ef4444",
                                fontWeight: 600,
                              }}
                            >
                              {creator.engagementRate.toFixed(1)}%
                            </span>
                          </td>
                          {/* 평균 피드 좋아요 */}
                          <td style={{ textAlign: "right" }}>
                            {formatNumber(creator.avgFeedLikes)}
                          </td>
                          {/* 평균 동영상 좋아요 */}
                          <td style={{ textAlign: "right" }}>
                            {formatNumber(creator.avgVideoLikes)}
                          </td>
                          {/* 평균 댓글 수 */}
                          <td style={{ textAlign: "right" }}>
                            {formatNumber(creator.avgComments)}
                          </td>
                          {/* 댓글자동화툴 */}
                          <td style={{ textAlign: "center" }}>
                            {creator.socialBuzzDetected ? (
                              <span style={{ color: "#f59e0b", fontWeight: 600, fontSize: 11 }}>
                                <AlertCircle className="w-3.5 h-3.5 inline mr-0.5" />감지
                              </span>
                            ) : (
                              <span style={{ color: "#ccc", fontSize: 11 }}>—</span>
                            )}
                          </td>
                          {/* 오디언스 성별 */}
                          <td style={{ textAlign: "center", fontSize: 11 }}>
                            {getTopAudienceGender(creator.audienceGender)}
                          </td>
                          {/* 오디언스 나이 */}
                          <td style={{ textAlign: "center", fontSize: 11 }}>
                            {getTopAudienceAge(creator.audienceAge)}
                          </td>
                          {/* 커스텀 컬럼 */}
                          {customColumns.map((col) => (
                            <td key={col.id} style={{ textAlign: "center" }}>
                              {renderCustomCell(creator.id, col)}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── 페이지네이션 ── */}
            {creatorTotalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-2">
                <button
                  className="otr-btn-toolbar px-2"
                  disabled={creatorPage <= 1}
                  onClick={() => setCreatorPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: Math.min(creatorTotalPages, 10) }, (_, i) => {
                  let pageNum: number;
                  if (creatorTotalPages <= 10) {
                    pageNum = i + 1;
                  } else if (creatorPage <= 5) {
                    pageNum = i + 1;
                  } else if (creatorPage >= creatorTotalPages - 4) {
                    pageNum = creatorTotalPages - 9 + i;
                  } else {
                    pageNum = creatorPage - 4 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={pageNum === creatorPage ? "otr-btn-primary px-3" : "otr-btn-toolbar px-3"}
                      onClick={() => setCreatorPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  className="otr-btn-toolbar px-2"
                  disabled={creatorPage >= creatorTotalPages}
                  onClick={() => setCreatorPage((p) => p + 1)}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* TAB 02: 콘텐츠 기반 탐색                        */}
        {/* ════════════════════════════════════════════════ */}
        {activeTab === "tab02" && (
          <>
            <OtrSearchPanel onSearch={handleContentSearch} onReset={handleContentReset}>
              <OtrFormGrid columns={4}>
                {/* 플랫폼 */}
                <OtrFormField label="플랫폼">
                  <OtrPlatformToggle
                    platforms={PLATFORMS}
                    selected={contentPlatforms}
                    onChange={setContentPlatforms}
                  />
                </OtrFormField>

                {/* 키워드 검색 */}
                <OtrFormField label="키워드 검색" span={3}>
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        className="w-full pl-7 pr-3"
                        placeholder="콘텐츠에 포함된 키워드를 입력하세요"
                        value={contentIncludeKeyword}
                        onChange={(e) => setContentIncludeKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleContentSearch()}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          className="w-full pl-2 pr-3 text-xs"
                          placeholder="제외 키워드 (콘텐츠 검색에서 제외)"
                          value={contentExcludeKeyword}
                          onChange={(e) => setContentExcludeKeyword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </OtrFormField>
              </OtrFormGrid>

              {/* 고급 필터 설정 (collapsible) */}
              <div
                style={{
                  border: "1px solid var(--otr-border)",
                  background: "var(--otr-bg-toolbar)",
                  borderRadius: 4,
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => setContentAdvExpanded((v) => !v)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--otr-text-primary)",
                  }}
                >
                  <span>고급 필터 설정</span>
                  <span style={{ fontSize: 11 }}>{contentAdvExpanded ? "▲" : "▼"}</span>
                </button>

                {contentAdvExpanded && (
                  <div style={{ padding: "4px 12px 12px" }}>
                    {/* ── 기본 정보 ── */}
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--otr-text-secondary)", marginBottom: 6, marginTop: 4 }}>
                      [기본 정보]
                    </div>
                    <OtrFormGrid columns={4}>
                      <OtrFormField label="콘텐츠 카테고리" span="full">
                        <div className="flex flex-wrap gap-1">
                          {CONTENT_CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleContentCategory(cat)}
                              className={
                                contentCategories.includes(cat)
                                  ? "otr-classification-active"
                                  : "otr-classification"
                              }
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </OtrFormField>

                      <OtrFormField label="콘텐츠 업로드 시기">
                        <select
                          className="w-full"
                          value={contentUploadPeriod}
                          onChange={(e) => setContentUploadPeriod(e.target.value)}
                        >
                          {UPLOAD_PERIOD_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </OtrFormField>

                      <OtrFormField label="평균 피드 좋아요 수">
                        <div className="flex items-center gap-1">
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최소" value={contentAdvLikesMin} onChange={(e) => setContentAdvLikesMin(e.target.value)} />
                          <span className="text-muted-foreground text-xs shrink-0">~</span>
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최대" value={contentAdvLikesMax} onChange={(e) => setContentAdvLikesMax(e.target.value)} />
                        </div>
                      </OtrFormField>

                      <OtrFormField label="평균 동영상 좋아요 수">
                        <div className="flex items-center gap-1">
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최소" value={contentAdvVideoLikesMin} onChange={(e) => setContentAdvVideoLikesMin(e.target.value)} />
                          <span className="text-muted-foreground text-xs shrink-0">~</span>
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최대" value={contentAdvVideoLikesMax} onChange={(e) => setContentAdvVideoLikesMax(e.target.value)} />
                        </div>
                      </OtrFormField>

                      <OtrFormField label="평균 동영상 조회 수">
                        <div className="flex items-center gap-1">
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최소" value={contentAdvViewsMin} onChange={(e) => setContentAdvViewsMin(e.target.value)} />
                          <span className="text-muted-foreground text-xs shrink-0">~</span>
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최대" value={contentAdvViewsMax} onChange={(e) => setContentAdvViewsMax(e.target.value)} />
                        </div>
                      </OtrFormField>

                      <OtrFormField label="평균 댓글 수">
                        <div className="flex items-center gap-1">
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최소" value={contentAdvCommentsMin} onChange={(e) => setContentAdvCommentsMin(e.target.value)} />
                          <span className="text-muted-foreground text-xs shrink-0">~</span>
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최대" value={contentAdvCommentsMax} onChange={(e) => setContentAdvCommentsMax(e.target.value)} />
                        </div>
                      </OtrFormField>

                      <OtrFormField label="ER(%)">
                        <div className="flex items-center gap-1">
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최소%" value={contentAdvErMin} onChange={(e) => setContentAdvErMin(e.target.value)} />
                          <span className="text-muted-foreground text-xs shrink-0">~</span>
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최대%" value={contentAdvErMax} onChange={(e) => setContentAdvErMax(e.target.value)} />
                        </div>
                      </OtrFormField>
                    </OtrFormGrid>

                    {/* ── 오디언스 ── */}
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--otr-text-secondary)", marginBottom: 6, marginTop: 12 }}>
                      [오디언스]
                    </div>
                    <OtrFormGrid columns={4}>
                      <OtrFormField label="주요 오디언스 성별">
                        <select
                          className="w-full"
                          value={contentAdvGender}
                          onChange={(e) => setContentAdvGender(e.target.value)}
                        >
                          <option value="all">전체</option>
                          <option value="female">여성</option>
                          <option value="male">남성</option>
                        </select>
                      </OtrFormField>

                      <OtrFormField label="주요 오디언스 나이">
                        <div className="flex items-center gap-1">
                          <input type="text" className="flex-1 min-w-0 px-2" placeholder="최소" value={contentAdvAgeMin} onChange={(e) => setContentAdvAgeMin(e.target.value)} />
                          <span className="text-muted-foreground text-xs shrink-0">~</span>
                          <input type="text" className="flex-1 min-w-0 px-2" placeholder="최대" value={contentAdvAgeMax} onChange={(e) => setContentAdvAgeMax(e.target.value)} />
                        </div>
                      </OtrFormField>
                    </OtrFormGrid>

                    {/* ── 크리에이터 정보 ── */}
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--otr-text-secondary)", marginBottom: 6, marginTop: 12 }}>
                      [크리에이터 정보]
                    </div>
                    <OtrFormGrid columns={4}>
                      <OtrFormField label="팔로워 수">
                        <div className="flex items-center gap-1">
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최소" value={contentAdvFollowerMin} onChange={(e) => setContentAdvFollowerMin(e.target.value)} />
                          <span className="text-muted-foreground text-xs shrink-0">~</span>
                          <input type="number" className="flex-1 min-w-0 px-2" placeholder="최대" value={contentAdvFollowerMax} onChange={(e) => setContentAdvFollowerMax(e.target.value)} />
                        </div>
                      </OtrFormField>

                      <OtrFormField label="공동구매 진행 여부">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <div
                            onClick={() => setContentAdvCoPurchase(!contentAdvCoPurchase)}
                            style={{
                              width: 36,
                              height: 20,
                              borderRadius: 10,
                              background: contentAdvCoPurchase ? "var(--otr-accent-purple)" : "#ddd",
                              position: "relative",
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                          >
                            <div
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: "#fff",
                                position: "absolute",
                                top: 2,
                                left: contentAdvCoPurchase ? 18 : 2,
                                transition: "left 0.2s",
                              }}
                            />
                          </div>
                          <span>{contentAdvCoPurchase ? "진행 계정만" : "전체"}</span>
                        </label>
                      </OtrFormField>

                      <OtrFormField label="브랜드 검색" span={2}>
                        <div className="space-y-1">
                          <input
                            type="text"
                            className="w-full px-2"
                            placeholder="브랜드명을 입력하세요"
                            value={contentAdvBrand}
                            onChange={(e) => setContentAdvBrand(e.target.value)}
                          />
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                            <div
                              onClick={() => setContentAdvIncludeSimilarBrand(!contentAdvIncludeSimilarBrand)}
                              style={{
                                width: 36,
                                height: 20,
                                borderRadius: 10,
                                background: contentAdvIncludeSimilarBrand ? "var(--otr-accent-purple)" : "#ddd",
                                position: "relative",
                                cursor: "pointer",
                                transition: "background 0.2s",
                              }}
                            >
                              <div
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  background: "#fff",
                                  position: "absolute",
                                  top: 2,
                                  left: contentAdvIncludeSimilarBrand ? 18 : 2,
                                  transition: "left 0.2s",
                                }}
                              />
                            </div>
                            <span>유사 브랜드군 포함</span>
                          </label>
                        </div>
                      </OtrFormField>
                    </OtrFormGrid>
                  </div>
                )}
              </div>
            </OtrSearchPanel>

            {/* ── 결과 툴바 ── */}
            <OtrToolbar
              leftContent={
                <span className="text-xs text-muted-foreground">
                  Top{" "}
                  <strong className="text-foreground">{filteredContents.length}</strong>개 콘텐츠
                  <span className="ml-2" style={{ color: "var(--otr-text-secondary)", fontSize: 10 }}>
                    (인게이지먼트 상위 인기 콘텐츠 TOP 100, 카테고리별 랭킹)
                  </span>
                </span>
              }
            />

            {/* ── 결과 테이블 ── */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ minWidth: 1800 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 40, textAlign: "center" }}>순위</th>
                      <th style={{ width: 280 }}>콘텐츠 정보</th>
                      <th style={{ width: 70, textAlign: "center" }}>콘텐츠 유형</th>
                      <th style={{ width: 120, textAlign: "center" }}>콘텐츠 카테고리</th>
                      <th style={{ width: 90, textAlign: "center" }}>업로드일</th>
                      <th style={{ width: 75, textAlign: "right" }}>좋아요 수</th>
                      <th style={{ width: 80, textAlign: "right" }}>조회 수</th>
                      <th style={{ width: 130, textAlign: "right" }}>댓글 수</th>
                      <th style={{ width: 260 }}>크리에이터 정보</th>
                      <th style={{ width: 65, textAlign: "center" }}>온트너회원</th>
                      <th style={{ width: 160 }}>컨택메일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContents.length === 0 ? (
                      <tr>
                        <td colSpan={11} style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                          검색 결과가 없습니다. 조건을 변경하여 다시 조회하세요.
                        </td>
                      </tr>
                    ) : (
                      filteredContents.map((content, idx) => {
                        const creator = getCreatorById(content.creatorId);
                        const commentData = getAdjustedComments(content);
                        return (
                          <tr
                            key={content.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              const handle = getCreatorById(content.creatorId)?.handle ?? "";
                              const url = content.platform === "instagram"
                                ? `https://www.instagram.com/${handle}/`
                                : `https://www.youtube.com/@${getCreatorById(content.creatorId)?.youtubeHandle ?? handle}`;
                              window.open(url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            {/* 순위 */}
                            <td style={{ textAlign: "center", fontWeight: 700, color: "var(--otr-accent-purple)" }}>
                              {idx + 1}
                            </td>
                            {/* 콘텐츠 정보 (썸네일 + 제목) */}
                            <td>
                              <div className="flex items-center gap-2">
                                <div
                                  style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 4,
                                    background: "#f3f0ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  {content.thumbnail ? (
                                    <img
                                      src={content.thumbnail}
                                      alt=""
                                      style={{ width: 48, height: 48, objectFit: "cover" }}
                                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                  ) : (
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: "var(--otr-font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                                    {content.title}
                                  </div>
                                  <div className="flex items-center gap-1 mt-0.5" style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                                    {content.platform === "instagram" ? (
                                      <Instagram className="w-3 h-3 text-pink-500" />
                                    ) : (
                                      <Youtube className="w-3 h-3 text-red-500" />
                                    )}
                                    <span>{content.platform === "instagram" ? "인스타그램" : "유튜브"}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            {/* 콘텐츠 유형 */}
                            <td style={{ textAlign: "center" }}>
                              <span
                                className="otr-badge"
                                style={{
                                  fontSize: 10,
                                  background:
                                    content.contentType === "릴스" ? "#fef3c7" :
                                    content.contentType === "숏츠" ? "#fce7f3" :
                                    content.contentType === "동영상" ? "#dbeafe" : "#f3f4f6",
                                  color:
                                    content.contentType === "릴스" ? "#92400e" :
                                    content.contentType === "숏츠" ? "#9d174d" :
                                    content.contentType === "동영상" ? "#1e40af" : "#374151",
                                }}
                              >
                                {content.contentType}
                              </span>
                            </td>
                            {/* 콘텐츠 카테고리 */}
                            <td style={{ textAlign: "center" }}>
                              <span className="otr-badge otr-badge-blue" style={{ fontSize: 10 }}>{content.category}</span>
                            </td>
                            {/* 업로드일 */}
                            <td style={{ textAlign: "center", fontSize: 11 }}>
                              {content.postedAt ? new Date(content.postedAt).toLocaleDateString("ko-KR") : "—"}
                            </td>
                            {/* 좋아요 수 */}
                            <td style={{ textAlign: "right", fontWeight: 600 }}>
                              {formatNumber(content.likes)}
                            </td>
                            {/* 조회 수 */}
                            <td style={{ textAlign: "right", fontWeight: 600 }}>
                              {formatNumber(content.views)}
                            </td>
                            {/* 댓글 수 (소셜비즈 보정값 병기) */}
                            <td style={{ textAlign: "right" }}>
                              <div>
                                <span style={{ fontWeight: 600 }}>{formatNumber(commentData.raw)}</span>
                                {commentData.detected && (
                                  <div style={{ fontSize: 9, marginTop: 2 }}>
                                    <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                                      <AlertCircle className="w-3 h-3 inline mr-0.5" />소셜비즈
                                    </span>
                                    <span style={{ color: "var(--otr-text-secondary)", marginLeft: 4 }}>
                                      보정: ~{formatNumber(commentData.adjusted!)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            {/* 크리에이터 정보 (프로필 썸네일, SNS플랫폼, user name, 바이오그래피) */}
                            <td>
                              {creator ? (
                                <div className="flex items-start gap-2">
                                  <div
                                    style={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: "50%",
                                      background: "var(--otr-accent-purple-light)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: "var(--otr-accent-purple)",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {creator.name.charAt(0)}
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                    <div className="flex items-center gap-1">
                                      <span style={{ fontWeight: 600, fontSize: "var(--otr-font-body)" }}>
                                        @{creator.handle}
                                      </span>
                                      <Instagram className="w-3 h-3 text-pink-500 flex-shrink-0" />
                                      {creator.youtubeHandle && (
                                        <Youtube className="w-3 h-3 text-red-500 flex-shrink-0" />
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: 10,
                                        color: "var(--otr-text-secondary)",
                                        maxWidth: 200,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {creator.biography}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span style={{ color: "#ccc" }}>—</span>
                              )}
                            </td>
                            {/* 온트너회원여부 */}
                            <td style={{ textAlign: "center" }}>
                              {creator?.isOntnerMember ? (
                                <span className="otr-badge otr-badge-green" style={{ fontSize: 10 }}>Y</span>
                              ) : (
                                <span style={{ color: "#ccc", fontSize: 10 }}>N</span>
                              )}
                            </td>
                            {/* 컨택메일 */}
                            <td style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                              {creator?.contactEmail || "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
            </div>
          </>
        )}
      </main>

      {/* ════════════════════════════════════════════════ */}
      {/* 커스텀 컬럼 추가 다이얼로그                      */}
      {/* ════════════════════════════════════════════════ */}
      <Dialog open={customColumnDialogOpen} onOpenChange={setCustomColumnDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>커스텀 컬럼 추가</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">컬럼 이름</label>
              <input
                type="text"
                className="w-full border border-[var(--otr-border)] rounded px-2"
                style={{ height: 30, fontSize: 13 }}
                placeholder="컬럼 이름을 입력하세요"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">컬럼 유형</label>
              <select
                className="w-full border border-[var(--otr-border)] rounded px-2"
                style={{ height: 30, fontSize: 13 }}
                value={newColumnType}
                onChange={(e) => setNewColumnType(e.target.value as CustomColumn["type"])}
              >
                {CUSTOM_COLUMN_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <button className="otr-btn-secondary" onClick={() => setCustomColumnDialogOpen(false)}>
              취소
            </button>
            <button
              className="otr-btn-primary"
              disabled={!newColumnName.trim()}
              style={{ opacity: newColumnName.trim() ? 1 : 0.5 }}
              onClick={() => {
                setCustomColumns((prev) => [
                  ...prev,
                  { id: `custom-${Date.now()}`, name: newColumnName.trim(), type: newColumnType },
                ]);
                setNewColumnName("");
                setNewColumnType("텍스트");
                setCustomColumnDialogOpen(false);
              }}
            >
              추가
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════ */}
      {/* 컨택 요청 발송 다이얼로그                        */}
      {/* ════════════════════════════════════════════════ */}
      <Dialog
        open={contactRequestDialogOpen}
        onOpenChange={(o) => {
          setContactRequestDialogOpen(o);
          if (!o) {
            setContactRequestTarget(null);
            setContactRequestReason("");
            setContactRequestSent(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>컨택 요청 발송</DialogTitle>
          </DialogHeader>
          {contactRequestSent ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
              <p className="text-sm font-medium">컨택 요청이 발송되었습니다</p>
              <p className="text-xs text-muted-foreground">
                CJ 내부 파트너사업부에 요청이 전달되었습니다.<br />
                처리 현황은 캠페인관리 &gt; 컨택 요청 관리에서 확인할 수 있습니다.
              </p>
              <button
                className="otr-btn-primary mt-2 px-6"
                onClick={() => {
                  setContactRequestDialogOpen(false);
                  setContactRequestTarget(null);
                  setContactRequestReason("");
                  setContactRequestSent(false);
                }}
              >
                확인
              </button>
            </div>
          ) : (
            <>
              <div className="py-2 space-y-3">
                <p className="text-xs text-muted-foreground">
                  선택한 크리에이터에 대해 CJ 내부 파트너사업부에 공식 컨택 요청을 발송합니다.
                  실제 연락은 담당자가 기존 방식으로 진행합니다.
                </p>

                {/* 대상 크리에이터 표시 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">대상 크리에이터</label>
                  {contactRequestTarget ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-[var(--otr-border)] text-sm">
                      <span className="font-medium">{contactRequestTarget.name}</span>
                      <span className="text-xs text-muted-foreground">@{contactRequestTarget.handle}</span>
                      {contactRequestTarget.contactEmail && (
                        <span className="text-[10px] text-blue-600 ml-auto flex items-center gap-0.5">
                          ✉ {contactRequestTarget.contactEmail}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-[var(--otr-border)] text-sm">
                      <span className="font-medium">{creatorSelected.size}명</span>
                      <span className="text-xs text-muted-foreground ml-2">선택된 크리에이터</span>
                    </div>
                  )}
                </div>

                {/* 요청 사유 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">요청 사유 *</label>
                  <textarea
                    rows={3}
                    className="w-full border border-[var(--otr-border)] p-2 text-sm resize-none"
                    placeholder="컨택 요청 사유를 입력하세요. (예: 뷰티 카테고리 인게이지먼트 상위 크리에이터, 캠페인 참여 제안 목적)"
                    value={contactRequestReason}
                    onChange={(e) => setContactRequestReason(e.target.value)}
                  />
                </div>

                <div className="text-[10px] text-muted-foreground bg-gray-50 p-2 space-y-0.5">
                  <p>• 요청 데이터는 CJ 온트러스트 DB에 저장됩니다 (POST /contact-request)</p>
                  <p>• 발송된 요청은 캠페인관리 &gt; 컨택 요청 관리(T-A-15)에서 확인 가능합니다</p>
                  <p>• 상태 흐름: 접수 → 검토 중 → 컨택 진행/미진행 → 완료</p>
                </div>
              </div>
              <DialogFooter>
                <button
                  className="otr-btn-secondary"
                  onClick={() => {
                    setContactRequestDialogOpen(false);
                    setContactRequestTarget(null);
                    setContactRequestReason("");
                  }}
                >
                  취소
                </button>
                <button
                  className="otr-btn-primary flex items-center gap-1.5"
                  onClick={() => setContactRequestSent(true)}
                  disabled={!contactRequestReason.trim()}
                  style={{ opacity: contactRequestReason.trim() ? 1 : 0.5 }}
                >
                  <Send className="w-3.5 h-3.5" />
                  컨택 요청 발송
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

// ─── 메인 export (Suspense 래핑) ────────────────────────
export default function OntrustCreatorSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <span className="text-sm text-muted-foreground">로딩 중...</span>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
