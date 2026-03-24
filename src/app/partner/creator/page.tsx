"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Instagram, Youtube, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import creatorsData from "@/data/mock/creators.json";

interface CreatorMock {
  id: string;
  handle: string;
  youtubeHandle?: string;
  name: string;
  followers: number;
  engagementRate: number;
  category: string[];
  isOntnerMember: boolean;
  campaigns: string[];
  tier: string;
  contactEmail: string;
  avgComments: number;
  audienceGender: { male: number; female: number };
  audienceAge: Record<string, number>;
  hasCoPurchase: boolean;
  socialBuzzDetected: boolean;
  ontnerCampaignCount: number;
  biography: string;
}

const allCreators = creatorsData as CreatorMock[];
const ontnerCreators = allCreators.filter((c) => c.isOntnerMember);

const CATEGORIES = [
  "뷰티",
  "패션",
  "푸드",
  "테크",
  "리빙",
  "육아",
  "헬스",
  "인테리어",
  "라이프스타일",
];

function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString("ko-KR");
}

function getTopAgeSegment(audienceAge: Record<string, number>): string {
  let topKey = "";
  let topVal = 0;
  for (const [key, val] of Object.entries(audienceAge)) {
    if (val > topVal) {
      topVal = val;
      topKey = key;
    }
  }
  return topKey ? `${topKey} (${topVal}%)` : "-";
}

export default function PartnerCreatorSearchPage() {
  const router = useRouter();

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [followerMin, setFollowerMin] = useState("");
  const [followerMax, setFollowerMax] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [coPurchaseOnly, setCoPurchaseOnly] = useState(false);
  const [erMin, setErMin] = useState("");
  const [erMax, setErMax] = useState("");

  // Applied filter snapshot for search-on-click behavior
  const [appliedFilters, setAppliedFilters] = useState({
    searchText: "",
    selectedPlatform: "all",
    selectedCategory: "all",
    followerMin: "",
    followerMax: "",
    brandSearch: "",
    coPurchaseOnly: false,
    erMin: "",
    erMax: "",
  });

  const handleSearch = () => {
    setAppliedFilters({
      searchText,
      selectedPlatform,
      selectedCategory,
      followerMin,
      followerMax,
      brandSearch,
      coPurchaseOnly,
      erMin,
      erMax,
    });
  };

  const filteredCreators = useMemo(() => {
    let results = [...ontnerCreators];
    const f = appliedFilters;

    // Text search (name or handle)
    if (f.searchText.trim()) {
      const q = f.searchText.trim().toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q)
      );
    }

    // Platform filter
    if (f.selectedPlatform === "instagram") {
      results = results.filter((c) => !c.youtubeHandle);
    } else if (f.selectedPlatform === "youtube") {
      results = results.filter((c) => !!c.youtubeHandle);
    }

    // Category filter
    if (f.selectedCategory !== "all") {
      results = results.filter((c) => c.category.includes(f.selectedCategory));
    }

    // Follower range
    const fMin = f.followerMin ? Number(f.followerMin) : 0;
    const fMax = f.followerMax ? Number(f.followerMax) : Infinity;
    if (fMin > 0 || fMax < Infinity) {
      results = results.filter(
        (c) => c.followers >= fMin && c.followers <= fMax
      );
    }

    // Brand search (match against biography)
    if (f.brandSearch.trim()) {
      const bq = f.brandSearch.trim().toLowerCase();
      results = results.filter((c) =>
        c.biography.toLowerCase().includes(bq)
      );
    }

    // Co-purchase only
    if (f.coPurchaseOnly) {
      results = results.filter((c) => c.hasCoPurchase);
    }

    // ER range
    const eMin = f.erMin ? Number(f.erMin) : 0;
    const eMax = f.erMax ? Number(f.erMax) : Infinity;
    if (eMin > 0 || eMax < Infinity) {
      results = results.filter(
        (c) => c.engagementRate >= eMin && c.engagementRate <= eMax
      );
    }

    return results;
  }, [appliedFilters]);

  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title="크리에이터 탐색"
        description="온트너 회원 크리에이터를 검색합니다"
      />

      <div className="flex-1 p-6 space-y-4">
        {/* Warning Banner */}
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            파트너 계정은 온트너 회원 크리에이터만 조회할 수 있습니다.
          </span>
        </div>

        {/* Search Panel */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Row 1: Search text, Platform, Category */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="크리에이터 이름 또는 핸들 검색"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9"
                />
              </div>

              <Select
                value={selectedPlatform}
                onValueChange={setSelectedPlatform}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="플랫폼" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 플랫폼</SelectItem>
                  <SelectItem value="instagram">인스타그램</SelectItem>
                  <SelectItem value="youtube">유튜브</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 2: Follower range, Brand search, Co-purchase, ER range, Search button */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  팔로워
                </span>
                <Input
                  type="number"
                  placeholder="최소"
                  value={followerMin}
                  onChange={(e) => setFollowerMin(e.target.value)}
                  className="w-[100px]"
                />
                <span className="text-muted-foreground text-sm">~</span>
                <Input
                  type="number"
                  placeholder="최대"
                  value={followerMax}
                  onChange={(e) => setFollowerMax(e.target.value)}
                  className="w-[100px]"
                />
              </div>

              <div className="relative min-w-[160px]">
                <Input
                  placeholder="브랜드 검색"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="coPurchase"
                  checked={coPurchaseOnly}
                  onCheckedChange={(checked) =>
                    setCoPurchaseOnly(checked === true)
                  }
                />
                <label
                  htmlFor="coPurchase"
                  className="text-sm cursor-pointer whitespace-nowrap"
                >
                  공동구매 가능
                </label>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  참여율
                </span>
                <Input
                  type="number"
                  placeholder="최소%"
                  value={erMin}
                  onChange={(e) => setErMin(e.target.value)}
                  className="w-[80px]"
                />
                <span className="text-muted-foreground text-sm">~</span>
                <Input
                  type="number"
                  placeholder="최대%"
                  value={erMax}
                  onChange={(e) => setErMax(e.target.value)}
                  className="w-[80px]"
                />
              </div>

              <Button onClick={handleSearch} size="sm" className="ml-auto">
                <Search className="h-4 w-4 mr-1" />
                검색
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                검색 결과 {filteredCreators.length}명
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">크리에이터</TableHead>
                    <TableHead className="w-[90px]">플랫폼</TableHead>
                    <TableHead className="w-[140px]">카테고리</TableHead>
                    <TableHead className="text-right w-[90px]">팔로워</TableHead>
                    <TableHead className="text-right w-[80px]">참여율</TableHead>
                    <TableHead className="text-right w-[110px]">평균 댓글</TableHead>
                    <TableHead className="w-[120px]">오디언스 성별</TableHead>
                    <TableHead className="w-[130px]">오디언스 나이</TableHead>
                    <TableHead className="text-right w-[100px]">캠페인 진행횟수</TableHead>
                    <TableHead className="w-[180px]">컨택메일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCreators.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12">
                        <div className="text-muted-foreground">
                          검색 결과가 없습니다
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCreators.map((creator) => (
                      <TableRow
                        key={creator.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          router.push(`/partner/creator/${creator.id}`)
                        }
                      >
                        {/* 크리에이터 (name + handle) */}
                        <TableCell>
                          <div className="font-medium">{creator.name}</div>
                          <div className="text-xs text-muted-foreground">
                            @{creator.handle}
                          </div>
                        </TableCell>

                        {/* 플랫폼 */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Instagram className="h-4 w-4 text-pink-500" />
                            {creator.youtubeHandle && (
                              <Youtube className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>

                        {/* 카테고리 */}
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {creator.category.slice(0, 2).map((cat) => (
                              <Badge
                                key={cat}
                                variant="secondary"
                                className="text-xs"
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>

                        {/* 팔로워 */}
                        <TableCell className="text-right">
                          {formatNumber(creator.followers)}
                        </TableCell>

                        {/* 참여율 */}
                        <TableCell className="text-right">
                          {creator.engagementRate.toFixed(1)}%
                        </TableCell>

                        {/* 평균 댓글 (with socialBuzz indicator) */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span>{formatNumber(creator.avgComments)}</span>
                            {creator.socialBuzzDetected && (
                              <Badge
                                variant="destructive"
                                className="text-[10px] px-1 py-0"
                              >
                                Buzz
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* 오디언스 성별 */}
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-blue-600">
                              M {creator.audienceGender.male}%
                            </span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-pink-600">
                              F {creator.audienceGender.female}%
                            </span>
                          </div>
                        </TableCell>

                        {/* 오디언스 나이 (top segment) */}
                        <TableCell className="text-xs">
                          {getTopAgeSegment(creator.audienceAge)}
                        </TableCell>

                        {/* 캠페인 진행횟수 */}
                        <TableCell className="text-right">
                          {creator.ontnerCampaignCount}회
                        </TableCell>

                        {/* 컨택메일 */}
                        <TableCell className="text-xs text-muted-foreground">
                          {creator.contactEmail}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
