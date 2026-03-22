"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderPlus,
  Pencil,
  Trash2,
  Users,
  ChevronRight,
  Plus,
  X,
  AlertCircle,
  Bookmark,
  AlertTriangle,
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
import { Label } from "@/components/ui/label";
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

// ─── 타입 ──────────────────────────────────────────

interface CreatorGroup {
  id: string;
  name: string;
  ownerId: string;
  creatorIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface MockCreator {
  id: string;
  handle: string;
  name: string;
  followers: number;
  engagementRate: number;
  category: string[];
  isOntnerMember: boolean;
  tier: string;
}

const CREATORS = (rawCreators as MockCreator[]).filter((c) => c.isOntnerMember);

function getCreator(id: string) {
  return CREATORS.find((c) => c.id === id);
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString();
}

const MAX_PER_GROUP = 500;

// ─── 메인 컴포넌트 ──────────────────────────────────────

export default function PartnerCreatorBookmarkPage() {
  // 파트너용 그룹 (partner-1 소유)
  const [groups, setGroups] = useState<CreatorGroup[]>(() =>
    (rawGroups as CreatorGroup[]).map((g) => ({
      ...g,
      // 온트너 회원만 필터링
      creatorIds: g.creatorIds.filter((id) => CREATORS.some((c) => c.id === id)),
    }))
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupDialog, setGroupDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CreatorGroup | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  function handleCreateGroup(name: string) {
    const newGroup: CreatorGroup = {
      id: `group-${Date.now()}`,
      name,
      ownerId: "partner-1",
      creatorIds: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setGroups((prev) => [...prev, newGroup]);
    setGroupDialog(false);
    setEditingGroup(null);
  }

  function handleEditGroup(id: string, name: string) {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name, updatedAt: new Date().toISOString().slice(0, 10) } : g))
    );
    setGroupDialog(false);
    setEditingGroup(null);
  }

  function handleDeleteGroup(id: string) {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    if (selectedGroupId === id) setSelectedGroupId(null);
    setDeleteDialog(null);
  }

  function removeCreatorFromGroup(groupId: string, creatorId: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, creatorIds: g.creatorIds.filter((id) => id !== creatorId), updatedAt: new Date().toISOString().slice(0, 10) }
          : g
      )
    );
  }

  return (
    <>
      <PageHeader
        title="관심 크리에이터 관리"
        description="P-A-10 · 관심 크리에이터를 그룹별로 관리합니다. (온트너 회원 한정)"
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditingGroup(null);
              setGroupDialog(true);
            }}
          >
            <FolderPlus className="mr-1.5 h-4 w-4" />
            그룹 추가
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* ─── 안내 ─── */}
        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">
            파트너 계정은 온트너 회원 크리에이터만 북마크/조회할 수 있습니다. 그룹당 최대 {MAX_PER_GROUP}명.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* ─── 그룹 목록 (좌측) ─── */}
          <div className="col-span-4 space-y-3">
            <h3 className="text-sm font-semibold">그룹 목록 ({groups.length})</h3>
            {groups.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Bookmark className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-xs text-muted-foreground">그룹이 없습니다. 새 그룹을 추가하세요.</p>
                </CardContent>
              </Card>
            ) : (
              groups.map((group) => (
                <Card
                  key={group.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${selectedGroupId === group.id ? "ring-2 ring-purple-500 bg-purple-50/30" : ""}`}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  <CardContent className="pt-3 pb-2 px-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{group.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{group.creatorIds.length}명</span>
                          <span>·</span>
                          <span>수정일: {group.updatedAt}</span>
                        </div>
                        {group.creatorIds.length >= MAX_PER_GROUP && (
                          <Badge variant="destructive" className="text-[9px] mt-1">한도 도달</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingGroup(group);
                            setGroupDialog(true);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialog(group.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* ─── 그룹 상세 (우측) ─── */}
          <div className="col-span-8">
            {!selectedGroup ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                  <p className="text-sm text-muted-foreground">좌측에서 그룹을 선택하면 크리에이터 목록이 표시됩니다.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{selectedGroup.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {selectedGroup.creatorIds.length}명 / 최대 {MAX_PER_GROUP}명
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>크리에이터</TableHead>
                        <TableHead className="w-[100px]">팔로워</TableHead>
                        <TableHead className="w-[80px]">참여율</TableHead>
                        <TableHead className="w-[120px]">카테고리</TableHead>
                        <TableHead className="w-[60px]">등급</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedGroup.creatorIds.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                            이 그룹에 크리에이터가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedGroup.creatorIds.map((cid, idx) => {
                          const creator = getCreator(cid);
                          if (!creator) return null;
                          return (
                            <TableRow key={cid}>
                              <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                              <TableCell>
                                <Link href={`/partner/creator/${creator.id}`} className="flex items-center gap-2 hover:underline">
                                  <Avatar className="h-7 w-7">
                                    <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700">
                                      {creator.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-xs font-medium">{creator.name}</p>
                                    <p className="text-[10px] text-muted-foreground">@{creator.handle}</p>
                                  </div>
                                </Link>
                              </TableCell>
                              <TableCell className="text-xs">{formatNumber(creator.followers)}</TableCell>
                              <TableCell className="text-xs">{creator.engagementRate}%</TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  {creator.category.map((cat) => (
                                    <Badge key={cat} variant="outline" className="text-[9px] px-1 py-0">
                                      {cat}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-[9px]">{creator.tier}</Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                                  onClick={() => removeCreatorFromGroup(selectedGroup.id, cid)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ─── 그룹 생성/수정 다이얼로그 ─── */}
      <GroupDialog
        open={groupDialog}
        onOpenChange={setGroupDialog}
        group={editingGroup}
        onSubmit={(name) => {
          if (editingGroup) {
            handleEditGroup(editingGroup.id, name);
          } else {
            handleCreateGroup(name);
          }
        }}
      />

      {/* ─── 그룹 삭제 확인 ─── */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>그룹 삭제</DialogTitle>
            <DialogDescription>
              이 그룹을 삭제하시겠습니까? 그룹 내 크리에이터 북마크가 모두 해제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>취소</Button>
            <Button variant="destructive" onClick={() => deleteDialog && handleDeleteGroup(deleteDialog)}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── 그룹 다이얼로그 ────────────────────────────────

function GroupDialog({
  open,
  onOpenChange,
  group,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  group: CreatorGroup | null;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(group?.name || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{group ? "그룹 수정" : "새 그룹 추가"}</DialogTitle>
          <DialogDescription>
            {group ? "그룹 이름을 수정합니다." : "관심 크리에이터를 관리할 새 그룹을 만듭니다."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label className="text-sm">그룹 이름</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 뷰티 크리에이터 후보"
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={() => onSubmit(name)} disabled={!name.trim()}>
            {group ? "저장" : "생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
