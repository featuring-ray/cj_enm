"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  UserPlus,
  MessageSquare,
  ExternalLink,
  Instagram,
  Youtube,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { OtrTierBadge } from "@/components/ontrust";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import rawCreators from "@/data/mock/creators.json";
import rawGroups from "@/data/mock/creator-groups.json";

type Creator = (typeof rawCreators)[number];
type Group = (typeof rawGroups)[number];

const TIER_MAP: Record<string, "purple" | "green" | "blue"> = {
  GOLD: "purple",
  SILVER: "green",
  BRONZE: "blue",
};

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

export default function BookmarkGroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const group: Group | undefined = rawGroups.find((g) => g.id === groupId);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [showDmDialog, setShowDmDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const creators: Creator[] = useMemo(() => {
    if (!group) return [];
    return group.creatorIds
      .map((id) => rawCreators.find((c) => c.id === id))
      .filter(Boolean) as Creator[];
  }, [group]);

  const filteredCreators = useMemo(() => {
    if (!searchText) return creators;
    const q = searchText.toLowerCase();
    return creators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.category.some((cat) => cat.includes(q))
    );
  }, [creators, searchText]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredCreators.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCreators.map((c) => c.id)));
    }
  };

  if (!group) {
    return (
      <>
        <PageHeader title="그룹 상세" description="" />
        <main className="flex-1 p-6">
          <div className="text-center py-16 text-muted-foreground">
            <p>존재하지 않는 그룹입니다</p>
            <Button variant="link" onClick={() => router.push("/ontrust/creator/bookmark")}>
              그룹 목록으로 돌아가기
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={group.name}
        description={`${creators.length}명의 크리에이터 · 최근 업데이트 ${group.updatedAt}`}
      />

      <main className="flex-1 p-4 md:p-6 space-y-4">
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/ontrust/creator/bookmark")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> 그룹 목록
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedIds.size === 0}
              onClick={() => setShowDmDialog(true)}
            >
              <Send className="h-3.5 w-3.5 mr-1" />
              DM 발송 ({selectedIds.size})
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedIds.size === 0}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              캠페인 제안 ({selectedIds.size})
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedIds.size === 0}
              onClick={() => setShowRemoveDialog(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              그룹에서 제거
            </Button>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="크리에이터 이름, 핸들, 카테고리 검색..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />

        {/* Creator Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedIds.size === filteredCreators.length && filteredCreators.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>크리에이터</TableHead>
                  <TableHead>플랫폼</TableHead>
                  <TableHead className="text-right">팔로워</TableHead>
                  <TableHead className="text-right">참여율</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>등급</TableHead>
                  <TableHead>회원</TableHead>
                  <TableHead className="text-right">캠페인수</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreators.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(c.id)}
                        onCheckedChange={() => toggleSelect(c.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/ontrust/creator/${c.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {c.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">@{c.handle}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Instagram className="h-3.5 w-3.5 text-pink-500" />
                        {c.youtubeHandle && <Youtube className="h-3.5 w-3.5 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatNumber(c.followers)}</TableCell>
                    <TableCell className="text-right text-sm">{c.engagementRate}%</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {c.category.map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-[10px]">{cat}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OtrTierBadge tier={TIER_MAP[c.tier] || "blue"} />
                    </TableCell>
                    <TableCell>
                      {c.isOntnerMember ? (
                        <Badge variant="default" className="text-[10px] bg-purple-100 text-purple-700 hover:bg-purple-100">온트너</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">비회원</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm">{c.campaigns?.length ?? 0}</TableCell>
                    <TableCell>
                      <Link href={`/ontrust/creator/${c.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCreators.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                      {searchText ? "검색 결과가 없습니다" : "그룹에 크리에이터가 없습니다"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* DM 발송 Dialog */}
        <Dialog open={showDmDialog} onOpenChange={setShowDmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>DM 발송</DialogTitle>
              <DialogDescription>
                선택한 {selectedIds.size}명의 크리에이터에게 DM을 발송합니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">
                발송 대상: {Array.from(selectedIds).map((id) => {
                  const c = rawCreators.find((cr) => cr.id === id);
                  return c?.name;
                }).filter(Boolean).join(", ")}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDmDialog(false)}>취소</Button>
              <Button onClick={() => { setShowDmDialog(false); setSelectedIds(new Set()); }}>
                <MessageSquare className="h-4 w-4 mr-1" /> DM 발송
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Dialog */}
        <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>그룹에서 제거</DialogTitle>
              <DialogDescription>
                선택한 {selectedIds.size}명을 이 그룹에서 제거하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>취소</Button>
              <Button variant="destructive" onClick={() => { setShowRemoveDialog(false); setSelectedIds(new Set()); }}>
                제거
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
