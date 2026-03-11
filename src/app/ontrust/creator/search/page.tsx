"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Users,
  CheckCircle2,
  CircleDashed,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  Megaphone,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { featuringApi } from "@/lib/featuring-api";
import type { Creator, CreatorSearchFilters } from "@/types/creator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CATEGORIES = ["뷰티", "패션", "푸드", "테크", "리빙", "육아", "헬스", "여행"];
const PLATFORMS = [
  { value: "전체", label: "전체" },
  { value: "instagram", label: "인스타그램" },
  { value: "youtube", label: "유튜브" },
];

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

export default function OntrustCreatorSearchPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  // 검색 & 필터
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [commerceOnly, setCommerceOnly] = useState(false);
  const [excludeOfficial, setExcludeOfficial] = useState(false);
  const [sortBy, setSortBy] = useState<CreatorSearchFilters["sortBy"]>("followers");

  const fetchCreators = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const filters: CreatorSearchFilters = {
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          commerceOnly,
          excludeOfficialAndCelebrity: excludeOfficial,
          sortBy,
          sortOrder: "desc",
          viewMode: "account",
          page: p,
          pageSize: PAGE_SIZE,
        };
        const result = await featuringApi.searchCreators(filters);
        setCreators(result.creators);
        setTotal(result.total);
        setPage(p);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategories, commerceOnly, excludeOfficial, sortBy]
  );

  useEffect(() => {
    fetchCreators(1);
  }, [fetchCreators]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // 클라이언트 사이드 필터 (검색어, 플랫폼)
  const filtered = creators.filter((c) => {
    const matchesSearch =
      !searchText ||
      c.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
      c.username.toLowerCase().includes(searchText.toLowerCase());
    const matchesPlatform =
      selectedPlatform === "전체" || c.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const activeFilterCount =
    selectedCategories.length +
    (commerceOnly ? 1 : 0) +
    (excludeOfficial ? 1 : 0) +
    (selectedPlatform !== "전체" ? 1 : 0);

  return (
    <TooltipProvider>
      <PageHeader
        title="크리에이터 탐색"
        description="키워드로 크리에이터를 검색하고 캠페인에 제안하세요"
      />

      <main className="flex-1 p-4 md:p-6 space-y-4">
        {/* 풀텍스트 검색바 + 필터 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="크리에이터명, 핸들, 브랜드명으로 검색..."
              className="pl-9"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as CreatorSearchFilters["sortBy"])}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">팔로워순</SelectItem>
              <SelectItem value="comments">댓글순</SelectItem>
              <SelectItem value="shares">공유순</SelectItem>
              <SelectItem value="views">조회수순</SelectItem>
              <SelectItem value="likes">좋아요순</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                필터
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>검색 필터</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                {/* 플랫폼 */}
                <div>
                  <p className="text-sm font-medium mb-2">플랫폼</p>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setSelectedPlatform(p.value)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedPlatform === p.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 카테고리 */}
                <div>
                  <p className="text-sm font-medium mb-2">카테고리</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setSelectedCategories((prev) =>
                            prev.includes(cat)
                              ? prev.filter((c) => c !== cat)
                              : [...prev, cat]
                          )
                        }
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedCategories.includes(cat)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 팔로워 수 범위 — 스펙에 있음 */}
                <div>
                  <p className="text-sm font-medium mb-2">팔로워 수</p>
                  <div className="flex gap-2 items-center">
                    <Input placeholder="최소" type="number" className="flex-1" />
                    <span className="text-muted-foreground">~</span>
                    <Input placeholder="최대" type="number" className="flex-1" />
                  </div>
                </div>

                {/* 비활성 필터: 세일즈 단가 */}
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="opacity-50 cursor-not-allowed">
                        <p className="text-sm font-medium mb-2">
                          세일즈 단가
                          <Badge variant="outline" className="ml-2 text-[10px]">
                            비활성
                          </Badge>
                        </p>
                        <div className="flex gap-2 items-center">
                          <Input placeholder="최소" disabled className="flex-1" />
                          <span>~</span>
                          <Input placeholder="최대" disabled className="flex-1" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>데이터 미제공으로 필터링이 불가합니다</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* 비활성 필터: 온트너 회원 필터 */}
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="opacity-50 cursor-not-allowed">
                        <label className="flex items-center gap-2">
                          <Checkbox disabled />
                          <span className="text-sm">온트너 회원만 보기</span>
                          <Badge variant="outline" className="text-[10px]">
                            비활성
                          </Badge>
                        </label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>검색 필터 불가 — 결과 테이블에서 뱃지로 확인 가능</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">옵션</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={commerceOnly}
                      onCheckedChange={(v) => setCommerceOnly(!!v)}
                    />
                    <span className="text-sm">공구(커머스) 진행 계정만</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={excludeOfficial}
                      onCheckedChange={(v) => setExcludeOfficial(!!v)}
                    />
                    <span className="text-sm">공식계정 및 연예인 제외</span>
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCategories([]);
                      setCommerceOnly(false);
                      setExcludeOfficial(false);
                      setSelectedPlatform("전체");
                    }}
                  >
                    초기화
                  </Button>
                  <Button className="flex-1" onClick={() => fetchCreators(1)}>
                    적용
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* 활성 필터 태그 */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedPlatform !== "전체" && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => setSelectedPlatform("전체")}
              >
                {PLATFORMS.find((p) => p.value === selectedPlatform)?.label} ×
              </Badge>
            )}
            {selectedCategories.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() =>
                  setSelectedCategories((prev) => prev.filter((c) => c !== cat))
                }
              >
                {cat} ×
              </Badge>
            ))}
            {commerceOnly && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => setCommerceOnly(false)}
              >
                커머스만 ×
              </Badge>
            )}
            {excludeOfficial && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => setExcludeOfficial(false)}
              >
                공식계정 제외 ×
              </Badge>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{total}</span>명
        </p>

        {/* 검색 결과 테이블 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>크리에이터</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead className="text-right">팔로워</TableHead>
                <TableHead className="text-right">참여율</TableHead>
                <TableHead className="text-right">세일즈 단가</TableHead>
                <TableHead>온트너</TableHead>
                <TableHead className="text-center">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">검색 결과가 없습니다</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((creator) => (
                  <TableRow
                    key={creator.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <Link
                        href={`/ontrust/creator/${creator.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                          {creator.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {creator.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{creator.username}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {creator.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(creator.followerCount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {creator.engagementRate.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {creator.avgUnitPrice
                        ? `${creator.avgUnitPrice.toLocaleString("ko-KR")}원`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {creator.isOntnerMember ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          온트너
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CircleDashed className="w-3.5 h-3.5" />
                          비회원
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            액션
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/ontrust/creator/${creator.id}`}>
                              <Eye className="w-3.5 h-3.5 mr-2" />
                              상세 보기
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Megaphone className="w-3.5 h-3.5 mr-2" />
                            캠페인 제안
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bookmark className="w-3.5 h-3.5 mr-2" />
                            북마크
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="w-3.5 h-3.5 mr-2" />
                            DM 발송
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => fetchCreators(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                onClick={() => fetchCreators(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => fetchCreators(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </TooltipProvider>
  );
}
