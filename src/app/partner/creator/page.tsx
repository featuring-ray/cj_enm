"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { featuringApi } from "@/lib/featuring-api";
import type { Creator, CreatorSearchFilters } from "@/types/creator";
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

const CATEGORIES = ["뷰티", "패션", "푸드", "테크", "리빙", "스킨케어"];

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

export default function PartnerCreatorSearchPage() {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [followerMin, setFollowerMin] = useState("");
  const [followerMax, setFollowerMax] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 20;

  const fetchCreators = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const result = await featuringApi.searchCreators({
          categories:
            selectedCategory !== "all" ? [selectedCategory] : undefined,
          sortBy: "followers" as CreatorSearchFilters["sortBy"],
          sortOrder: "desc",
          viewMode: "account",
          page: p,
          pageSize: PAGE_SIZE,
        });
        let filtered = result.creators.filter((c) => c.isOntnerMember);

        // 검색어 필터
        if (searchText.trim()) {
          const q = searchText.trim().toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.displayName.toLowerCase().includes(q) ||
              c.username.toLowerCase().includes(q)
          );
        }

        // 팔로워 범위 필터
        const min = followerMin ? Number(followerMin) : 0;
        const max = followerMax ? Number(followerMax) : Infinity;
        if (min > 0 || max < Infinity) {
          filtered = filtered.filter(
            (c) => c.followerCount >= min && c.followerCount <= max
          );
        }

        setCreators(filtered);
        setTotal(filtered.length);
        setPage(p);
      } catch (err) {
        console.error("크리에이터 검색 실패:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, searchText, followerMin, followerMax]
  );

  useEffect(() => {
    fetchCreators(1);
  }, [fetchCreators]);

  const handleSearch = () => {
    fetchCreators(1);
  };

  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title="크리에이터 탐색"
        description="온트너 회원 크리에이터를 검색합니다"
      />

      <div className="flex-1 p-6 space-y-4">
        {/* 필터 영역 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* 검색어 */}
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

              {/* 카테고리 */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[140px]">
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

              {/* 팔로워 범위 */}
              <Input
                type="number"
                placeholder="팔로워 최소"
                value={followerMin}
                onChange={(e) => setFollowerMin(e.target.value)}
                className="w-[120px]"
              />
              <span className="text-muted-foreground text-sm">~</span>
              <Input
                type="number"
                placeholder="팔로워 최대"
                value={followerMax}
                onChange={(e) => setFollowerMax(e.target.value)}
                className="w-[120px]"
              />

              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4 mr-1" />
                검색
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 결과 테이블 */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                검색 결과 {total}명
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">이름</TableHead>
                  <TableHead>핸들</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead className="text-right">팔로워</TableHead>
                  <TableHead className="text-right">참여율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="text-muted-foreground">
                        검색 중...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : creators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="text-muted-foreground">
                        검색 결과가 없습니다
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  creators.map((creator) => (
                    <TableRow
                      key={creator.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(`/partner/creator/${creator.id}`)
                      }
                    >
                      <TableCell className="font-medium">
                        {creator.displayName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        @{creator.username}
                      </TableCell>
                      <TableCell>
                        {creator.categories.slice(0, 2).join(", ")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(creator.followerCount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {creator.engagementRate.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
