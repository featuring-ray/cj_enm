"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  CircleDashed,
  Eye,
  Megaphone,
  Bookmark,
  Send,
  GitCompare,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Youtube,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  OtrSearchPanel,
  OtrFormGrid,
  OtrFormField,
  OtrToolbar,
  OtrTierBadge,
  OtrPlatformToggle,
} from "@/components/ontrust";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import rawCreators from "@/data/mock/creators.json";
import rawCampaigns from "@/data/mock/campaigns.json";

// ─── 타입 ───────────────────────────────────────────────
type TierLevel = "GOLD" | "SILVER" | "BRONZE";
type SortField = "followers" | "engagementRate" | "campaignCount" | "salesPrice";

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
  introduction?: string;
}

const CREATORS: MockCreator[] = rawCreators as MockCreator[];

const TIER_MAP: Record<TierLevel, "purple" | "green" | "blue"> = {
  GOLD: "purple",
  SILVER: "green",
  BRONZE: "blue",
};

const CATEGORIES = ["뷰티", "패션", "푸드", "테크", "리빙", "육아", "헬스", "여행", "라이프스타일", "인테리어"];
const PLATFORMS = [
  { id: "instagram", label: "인스타그램" },
  { id: "youtube", label: "유튜브" },
];
const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "engagementRate", label: "인게이지먼트순" },
  { value: "followers", label: "팔로워순" },
  { value: "campaignCount", label: "캠페인이력순" },
  { value: "salesPrice", label: "세일즈단가순" },
];

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}천`;
  return n.toLocaleString("ko-KR");
}

const PAGE_SIZE = 15;

// ─── 메인 컴포넌트 ───────────────────────────────────────
export default function OntrustCreatorSearchPage() {
  // 검색 조건
  const [keyword, setKeyword] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [followerMin, setFollowerMin] = useState("");
  const [followerMax, setFollowerMax] = useState("");
  const [commerceOnly, setCommerceOnly] = useState(false);
  const [excludeOfficial, setExcludeOfficial] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("engagementRate");

  // 적용된 조건 (조회 버튼 클릭 시 반영)
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedPlatforms, setAppliedPlatforms] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [appliedFollowerMin, setAppliedFollowerMin] = useState("");
  const [appliedFollowerMax, setAppliedFollowerMax] = useState("");
  const [appliedCommerceOnly, setAppliedCommerceOnly] = useState(false);
  const [appliedExcludeOfficial, setAppliedExcludeOfficial] = useState(false);
  const [appliedCampaignId, setAppliedCampaignId] = useState("");

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [dmDialogOpen, setDmDialogOpen] = useState(false);
  const [dmTarget, setDmTarget] = useState<MockCreator | null>(null);

  // 필터링 + 정렬
  const filtered = useMemo(() => {
    let list = [...CREATORS];

    if (appliedKeyword) {
      const kw = appliedKeyword.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          c.handle.toLowerCase().includes(kw) ||
          c.category.some((cat) => cat.toLowerCase().includes(kw))
      );
    }
    if (appliedPlatforms.length > 0) {
      list = list.filter((c) => {
        const hasInstagram = appliedPlatforms.includes("instagram");
        const hasYoutube = appliedPlatforms.includes("youtube");
        if (hasInstagram && hasYoutube) return true;
        if (hasYoutube) return !!c.youtubeHandle;
        if (hasInstagram) return !c.youtubeHandle || c.handle;
        return true;
      });
    }
    if (appliedCategories.length > 0) {
      list = list.filter((c) =>
        appliedCategories.some((cat) => c.category.includes(cat))
      );
    }
    if (appliedFollowerMin) {
      list = list.filter((c) => c.followers >= Number(appliedFollowerMin));
    }
    if (appliedFollowerMax) {
      list = list.filter((c) => c.followers <= Number(appliedFollowerMax));
    }
    if (appliedCommerceOnly) {
      list = list.filter((c) => c.campaigns.length > 0);
    }
    if (appliedExcludeOfficial) {
      // mock: exclude GOLD with very high followers as "official" proxy
      list = list.filter((c) => c.followers < 700000);
    }
    if (appliedCampaignId) {
      list = list.filter((c) => c.campaigns.includes(appliedCampaignId));
    }

    // 정렬
    list.sort((a, b) => {
      if (sortBy === "engagementRate") return b.engagementRate - a.engagementRate;
      if (sortBy === "followers") return b.followers - a.followers;
      if (sortBy === "campaignCount") return b.campaigns.length - a.campaigns.length;
      if (sortBy === "salesPrice") return (b.salesPrice ?? 0) - (a.salesPrice ?? 0);
      return 0;
    });

    return list;
  }, [
    appliedKeyword,
    appliedPlatforms,
    appliedCategories,
    appliedFollowerMin,
    appliedFollowerMax,
    appliedCommerceOnly,
    appliedExcludeOfficial,
    appliedCampaignId,
    sortBy,
  ]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = useCallback(() => {
    setAppliedKeyword(keyword);
    setAppliedPlatforms(platforms);
    setAppliedCategories(selectedCategories);
    setAppliedFollowerMin(followerMin);
    setAppliedFollowerMax(followerMax);
    setAppliedCommerceOnly(commerceOnly);
    setAppliedExcludeOfficial(excludeOfficial);
    setAppliedCampaignId(selectedCampaignId);
    setPage(1);
    setSelected(new Set());
  }, [
    keyword,
    platforms,
    selectedCategories,
    followerMin,
    followerMax,
    commerceOnly,
    excludeOfficial,
    selectedCampaignId,
  ]);

  const handleReset = useCallback(() => {
    setKeyword("");
    setPlatforms([]);
    setSelectedCategories([]);
    setFollowerMin("");
    setFollowerMax("");
    setCommerceOnly(false);
    setExcludeOfficial(false);
    setSelectedCampaignId("");
    setAppliedKeyword("");
    setAppliedPlatforms([]);
    setAppliedCategories([]);
    setAppliedFollowerMin("");
    setAppliedFollowerMax("");
    setAppliedCommerceOnly(false);
    setAppliedExcludeOfficial(false);
    setAppliedCampaignId("");
    setPage(1);
    setSelected(new Set());
  }, []);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (pageData.every((c) => selected.has(c.id))) {
      const next = new Set(selected);
      pageData.forEach((c) => next.delete(c.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      pageData.forEach((c) => next.add(c.id));
      setSelected(next);
    }
  };

  const allPageSelected = pageData.length > 0 && pageData.every((c) => selected.has(c.id));
  const selectedCreators = CREATORS.filter((c) => selected.has(c.id));

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <TooltipProvider>
      <PageHeader
        title="크리에이터 탐색"
        description="T-A-01 · 피처링 전체 크리에이터 풀에서 탐색하고 캠페인에 제안하세요"
      />

      <main className="flex-1 p-4 space-y-3">
        {/* ── 조회 조건 패널 ── */}
        <OtrSearchPanel onSearch={handleSearch} onReset={handleReset}>
          <OtrFormGrid columns={4}>
            {/* 검색어 */}
            <OtrFormField label="검색어" span={3}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  className="w-full pl-7 pr-3"
                  placeholder="크리에이터명, 핸들, 브랜드 키워드..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </OtrFormField>

            {/* 플랫폼 */}
            <OtrFormField label="플랫폼">
              <OtrPlatformToggle
                platforms={PLATFORMS}
                selected={platforms}
                onChange={setPlatforms}
              />
            </OtrFormField>

            {/* 카테고리 */}
            <OtrFormField label="카테고리" span={3}>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={
                      selectedCategories.includes(cat)
                        ? "otr-classification-active"
                        : "otr-classification"
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </OtrFormField>

            {/* 팔로워 수 */}
            <OtrFormField label="팔로워 수">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="최소"
                  className="flex-1 min-w-0 px-2"
                  value={followerMin}
                  onChange={(e) => setFollowerMin(e.target.value)}
                />
                <span className="text-muted-foreground text-xs shrink-0">~</span>
                <input
                  type="number"
                  placeholder="최대"
                  className="flex-1 min-w-0 px-2"
                  value={followerMax}
                  onChange={(e) => setFollowerMax(e.target.value)}
                />
              </div>
            </OtrFormField>

            {/* 캠페인 선택 */}
            <OtrFormField label="캠페인 선택" span={2}>
              <select
                className="w-full"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
              >
                <option value="">전체 (캠페인 무관)</option>
                {rawCampaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.brand})
                  </option>
                ))}
              </select>
            </OtrFormField>

            {/* 옵션 */}
            <OtrFormField label="추가 옵션">
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={commerceOnly}
                    onChange={(e) => setCommerceOnly(e.target.checked)}
                  />
                  공구(커머스) 진행 계정만
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={excludeOfficial}
                    onChange={(e) => setExcludeOfficial(e.target.checked)}
                  />
                  공식계정 / 연예인 제외
                </label>
              </div>
            </OtrFormField>

            {/* 비활성 필터 안내 */}
            <OtrFormField label="세일즈 단가">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-not-allowed opacity-60">
                    <AlertCircle className="w-3 h-3" />
                    필터 불가 (테이블에서 확인)
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  데이터 미제공으로 필터링이 불가합니다. 결과 테이블의 세일즈 단가 컬럼을 확인하세요.
                </TooltipContent>
              </Tooltip>
            </OtrFormField>

            <OtrFormField label="온트너 회원">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-not-allowed opacity-60">
                    <AlertCircle className="w-3 h-3" />
                    필터 불가 (뱃지로 표시)
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  검색 필터 불가 — 결과 테이블에서 온트너 뱃지로 확인 가능합니다.
                </TooltipContent>
              </Tooltip>
            </OtrFormField>
          </OtrFormGrid>

          <p className="text-[10px] text-muted-foreground mt-2">
            * X, 틱톡, 네이버블로그 탐색은 피처링 화면에서 이용하세요.
          </p>
        </OtrSearchPanel>

        {/* ── 결과 툴바 ── */}
        <OtrToolbar
          leftContent={
            <span className="text-xs text-muted-foreground">
              총{" "}
              <strong className="text-foreground">{filtered.length}</strong>명
              {selected.size > 0 && (
                <span className="ml-2 text-[var(--otr-accent-purple)] font-semibold">
                  {selected.size}명 선택됨
                </span>
              )}
            </span>
          }
        >
          {/* 선택 시 나타나는 일괄 액션 */}
          {selected.size >= 2 && (
            <Link href={`/ontrust/creator/similarity?ids=${[...selected].join(",")}`}>
              <button className="otr-btn-primary flex items-center gap-1.5">
                <GitCompare className="w-3.5 h-3.5" />
                팔로워 유사도 분석 ({selected.size}명)
              </button>
            </Link>
          )}
          {selected.size > 0 && (
            <>
              <button
                className="otr-btn-toolbar flex items-center gap-1.5"
                onClick={() => setBookmarkDialogOpen(true)}
              >
                <Bookmark className="w-3.5 h-3.5" />
                북마크 추가
              </button>
              <button
                className="otr-btn-toolbar flex items-center gap-1.5"
                onClick={() => setDmDialogOpen(true)}
              >
                <Send className="w-3.5 h-3.5" />
                DM 발송
              </button>
            </>
          )}

          <select
            style={{ height: "var(--otr-btn-height)", fontSize: "var(--otr-font-body)" }}
            className="border border-[var(--otr-border)] rounded px-2 bg-background"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </OtrToolbar>

        {/* ── 결과 테이블 ── */}
        <div>
          <table>
            <thead>
              <tr>
                <th style={{ width: 36, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th style={{ width: 30, textAlign: "center" }}>No</th>
                <th style={{ width: 200 }}>크리에이터</th>
                <th style={{ width: 80, textAlign: "center" }}>플랫폼</th>
                <th style={{ width: 150 }}>카테고리</th>
                <th style={{ width: 80, textAlign: "right" }}>팔로워</th>
                <th style={{ width: 80, textAlign: "right" }}>참여율</th>
                <th style={{ width: 80, textAlign: "center" }}>등급</th>
                <th style={{ width: 110, textAlign: "right" }}>세일즈 단가</th>
                <th style={{ width: 70, textAlign: "center" }}>온트너</th>
                <th style={{ width: 80, textAlign: "center" }}>캠페인 이력</th>
                <th style={{ width: 80, textAlign: "center" }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                    검색 결과가 없습니다. 조건을 변경하여 다시 조회하세요.
                  </td>
                </tr>
              ) : (
                pageData.map((creator, idx) => (
                  <tr
                    key={creator.id}
                    style={{
                      backgroundColor: selected.has(creator.id) ? "var(--otr-accent-purple-light)" : undefined,
                    }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selected.has(creator.id)}
                        onChange={() => toggleSelect(creator.id)}
                      />
                    </td>
                    <td style={{ textAlign: "center", color: "var(--otr-text-secondary)" }}>
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    {/* 크리에이터 */}
                    <td>
                      <Link
                        href={`/ontrust/creator/${creator.id}`}
                        className="flex items-center gap-2 hover:underline"
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
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "var(--otr-font-body)" }}>
                            {creator.name}
                          </div>
                          <div style={{ fontSize: 10, color: "var(--otr-text-secondary)" }}>
                            @{creator.handle}
                          </div>
                        </div>
                      </Link>
                    </td>
                    {/* 플랫폼 */}
                    <td style={{ textAlign: "center" }}>
                      <div className="flex items-center justify-center gap-1">
                        <Instagram className="w-3 h-3 text-pink-500" />
                        {creator.youtubeHandle && (
                          <Youtube className="w-3 h-3 text-red-500" />
                        )}
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
                    {/* 팔로워 */}
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      {formatNumber(creator.followers)}
                    </td>
                    {/* 참여율 */}
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          color: creator.engagementRate >= 5 ? "#22c55e" : creator.engagementRate >= 3 ? "var(--otr-text-primary)" : "#ef4444",
                          fontWeight: 600,
                        }}
                      >
                        {creator.engagementRate.toFixed(1)}%
                      </span>
                    </td>
                    {/* 등급 */}
                    <td style={{ textAlign: "center" }}>
                      <OtrTierBadge tier={TIER_MAP[creator.tier]} />
                    </td>
                    {/* 세일즈 단가 */}
                    <td style={{ textAlign: "right", color: "var(--otr-text-secondary)" }}>
                      {creator.salesPrice
                        ? `${(creator.salesPrice / 10000).toFixed(0)}만원`
                        : "—"}
                    </td>
                    {/* 온트너 */}
                    <td style={{ textAlign: "center" }}>
                      {creator.isOntnerMember ? (
                        <span
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, color: "#22c55e", fontSize: 11 }}
                        >
                          <CheckCircle2 style={{ width: 13, height: 13 }} />
                          회원
                        </span>
                      ) : (
                        <span
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, color: "#999", fontSize: 11 }}
                        >
                          <CircleDashed style={{ width: 13, height: 13 }} />
                          비회원
                        </span>
                      )}
                    </td>
                    {/* 캠페인 이력 */}
                    <td style={{ textAlign: "center" }}>
                      {creator.campaigns.length > 0 ? (
                        <span style={{ fontWeight: 600, color: "var(--otr-accent-purple)" }}>
                          {creator.campaigns.length}회
                        </span>
                      ) : (
                        <span style={{ color: "#ccc" }}>—</span>
                      )}
                    </td>
                    {/* 액션 */}
                    <td style={{ textAlign: "center" }}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="otr-btn-toolbar px-3">액션 ▾</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/ontrust/creator/${creator.id}`}>
                              <Eye className="w-3.5 h-3.5 mr-2" />
                              상세 보기
                            </Link>
                          </DropdownMenuItem>
                          {creator.isOntnerMember ? (
                            <DropdownMenuItem>
                              <Megaphone className="w-3.5 h-3.5 mr-2" />
                              캠페인 참여 제안
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem>
                                <Send className="w-3.5 h-3.5 mr-2" />
                                온트너 가입 제안 (DM)
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Megaphone className="w-3.5 h-3.5 mr-2" />
                                캠페인+가입 제안
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Bookmark className="w-3.5 h-3.5 mr-2" />
                            북마크에 추가
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDmTarget(creator);
                              setDmDialogOpen(true);
                            }}
                          >
                            <Send className="w-3.5 h-3.5 mr-2" />
                            DM 발송
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/ontrust/creator/similarity?ids=${creator.id}`}>
                              <GitCompare className="w-3.5 h-3.5 mr-2" />
                              유사도 분석에 추가
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── 페이지네이션 ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 pt-2">
            <button
              className="otr-btn-toolbar px-2"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={p === page ? "otr-btn-primary px-3" : "otr-btn-toolbar px-3"}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="otr-btn-toolbar px-2"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* ── 북마크 그룹 선택 다이얼로그 ── */}
      <Dialog open={bookmarkDialogOpen} onOpenChange={setBookmarkDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>북마크 그룹에 추가</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <p className="text-xs text-muted-foreground">
              {selected.size}명의 크리에이터를 북마크 그룹에 추가합니다.
            </p>
            <select className="w-full" style={{ height: 30, fontSize: 13 }}>
              <option value="">그룹 선택...</option>
              <option value="group-1">뷰티/패션 타겟</option>
              <option value="group-2">신규 발굴 후보</option>
              <option value="group-3">봄 시즌 캠페인</option>
            </select>
          </div>
          <DialogFooter>
            <button className="otr-btn-secondary" onClick={() => setBookmarkDialogOpen(false)}>
              취소
            </button>
            <button className="otr-btn-primary" onClick={() => setBookmarkDialogOpen(false)}>
              추가
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DM 발송 다이얼로그 ── */}
      <Dialog open={dmDialogOpen} onOpenChange={(o) => { setDmDialogOpen(o); if (!o) setDmTarget(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>DM 발송</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-xs text-muted-foreground">
              {dmTarget
                ? `@${dmTarget.handle}에게 DM을 발송합니다.`
                : `${selected.size}명의 크리에이터에게 DM을 발송합니다.`}
            </p>
            <div className="space-y-1">
              <label className="text-xs font-medium">DM 템플릿 선택</label>
              <select className="w-full" style={{ height: 30, fontSize: 13 }}>
                <option value="">직접 입력</option>
                <option value="template-1">온트너 가입 제안</option>
                <option value="template-2">캠페인 참여 제안</option>
                <option value="template-3">캠페인+가입 통합 제안</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">메시지 내용</label>
              <textarea
                rows={4}
                className="w-full border border-[var(--otr-border)] rounded p-2 text-sm resize-none"
                placeholder="DM 내용을 입력하세요..."
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              * 인스타그램 DM은 텍스트+링크만 발송 가능합니다 (이미지 불가).
            </p>
          </div>
          <DialogFooter>
            <button className="otr-btn-secondary" onClick={() => { setDmDialogOpen(false); setDmTarget(null); }}>
              취소
            </button>
            <button
              className="otr-btn-primary"
              onClick={() => { setDmDialogOpen(false); setDmTarget(null); }}
            >
              발송
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
