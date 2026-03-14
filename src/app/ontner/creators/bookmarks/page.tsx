"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BookmarkX,
  Users,
  Search,
  Trash2,
  Plus,
  Instagram,
  Youtube,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import mockCreatorsJson from "@/data/mock/creators.json";

// 온트너 회원인 크리에이터 중 일부를 북마크로 시뮬레이션
const MOCK_BOOKMARKED_IDS = ["creator-2", "creator-5", "creator-8", "creator-12", "creator-15"];

type MockCreator = {
  id: string;
  handle: string;
  name: string;
  followers: number;
  engagementRate: number;
  category: string[];
  isOntnerMember: boolean;
  tier: string;
};

function formatFollowers(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

const TIER_COLORS: Record<string, string> = {
  GOLD: "text-yellow-600 bg-yellow-50 border-yellow-200",
  SILVER: "text-gray-600 bg-gray-50 border-gray-200",
  BRONZE: "text-amber-700 bg-amber-50 border-amber-200",
};

export default function OntnerBookmarksPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    new Set(MOCK_BOOKMARKED_IDS)
  );
  const [removeTarget, setRemoveTarget] = useState<MockCreator | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const bookmarkedCreators = useMemo(() => {
    return (mockCreatorsJson as MockCreator[]).filter((c) =>
      bookmarkedIds.has(c.id)
    );
  }, [bookmarkedIds]);

  const filteredCreators = useMemo(() => {
    if (!search.trim()) return bookmarkedCreators;
    const q = search.trim().toLowerCase();
    return bookmarkedCreators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.category.some((cat) => cat.includes(q))
    );
  }, [bookmarkedCreators, search]);

  const handleRemoveConfirm = () => {
    if (!removeTarget) return;
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.delete(removeTarget.id);
      return next;
    });
    setRemoveTarget(null);
    setRemoveDialogOpen(false);
  };

  return (
    <>
      <PageHeader
        title="나의 관심 크리에이터"
        description="북마크한 크리에이터 목록을 관리합니다"
      />

      <main className="flex-1 p-4 md:p-6 space-y-4">
        {/* 요약 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Card className="col-span-1">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookmarkedCreators.length}</p>
                  <p className="text-xs text-muted-foreground">관심 크리에이터</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Instagram className="h-4 w-4 text-pink-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {bookmarkedCreators.length}
                  </p>
                  <p className="text-xs text-muted-foreground">인스타그램</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <Youtube className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">유튜브</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이름, 핸들, 카테고리로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/ontner/campaign/explore")}
          >
            <Plus className="h-4 w-4 mr-1" />
            크리에이터 찾기
          </Button>
        </div>

        {/* 크리에이터 테이블 */}
        {filteredCreators.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BookmarkX className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                {search ? "검색 결과가 없습니다" : "아직 관심 크리에이터가 없습니다"}
              </p>
              {!search && (
                <p className="text-xs text-muted-foreground mt-1">
                  캠페인 탐색에서 마음에 드는 크리에이터를 북마크해보세요
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  크리에이터 목록
                  <span className="ml-2 text-muted-foreground font-normal">
                    ({filteredCreators.length}명)
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] pl-6">크리에이터</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="text-right">팔로워</TableHead>
                    <TableHead className="text-right">참여율</TableHead>
                    <TableHead className="text-center">등급</TableHead>
                    <TableHead className="text-center">온트너</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCreators.map((creator) => (
                    <TableRow
                      key={creator.id}
                      className="cursor-pointer hover:bg-muted/50 group"
                    >
                      <TableCell
                        className="pl-6"
                        onClick={() =>
                          router.push(`/ontner/campaign/explore`)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {creator.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{creator.name}</p>
                            <p className="text-xs text-muted-foreground">
                              @{creator.handle}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        onClick={() => router.push(`/ontner/campaign/explore`)}
                      >
                        <div className="flex flex-wrap gap-1">
                          {creator.category.slice(0, 2).map((cat) => (
                            <Badge
                              key={cat}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={() => router.push(`/ontner/campaign/explore`)}
                      >
                        <span className="text-sm">{formatFollowers(creator.followers)}</span>
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={() => router.push(`/ontner/campaign/explore`)}
                      >
                        <span className="text-sm">{creator.engagementRate.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell
                        className="text-center"
                        onClick={() => router.push(`/ontner/campaign/explore`)}
                      >
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            TIER_COLORS[creator.tier] || ""
                          }`}
                        >
                          {creator.tier}
                        </span>
                      </TableCell>
                      <TableCell
                        className="text-center"
                        onClick={() => router.push(`/ontner/campaign/explore`)}
                      >
                        {creator.isOntnerMember ? (
                          <Badge variant="default" className="text-[10px]">회원</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">비회원</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemoveTarget(creator);
                              setRemoveDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>

      {/* 북마크 삭제 확인 다이얼로그 */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관심 크리에이터 삭제</DialogTitle>
            <DialogDescription>
              <strong>{removeTarget?.name}</strong> (@{removeTarget?.handle})을(를) 관심 크리에이터에서 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleRemoveConfirm}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
