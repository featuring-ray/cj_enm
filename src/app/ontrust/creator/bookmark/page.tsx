"use client";

import { useState, useEffect } from "react";
import {
  Bookmark,
  Plus,
  Pencil,
  Trash2,
  Send,
  UserPlus,
  MessageSquare,
  FolderOpen,
  Check,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { featuringApi } from "@/lib/featuring-api";
import mockCreatorsJson from "@/data/mock/creators.json";

type MockCreator = (typeof mockCreatorsJson)[number];

interface BookmarkGroup {
  id: string;
  name: string;
  creatorIds: string[];
  createdAt: string;
}

function getCreatorInfo(id: string): MockCreator | undefined {
  return mockCreatorsJson.find((c) => c.id === id);
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

export default function BookmarkPage() {
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await featuringApi.getBookmarkGroups();
        setGroups(data);
        if (data.length > 0) {
          setSelectedGroupId(data[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const handleAddGroup = () => {
    if (!groupName.trim()) return;
    const newGroup: BookmarkGroup = {
      id: `group-${Date.now()}`,
      name: groupName.trim(),
      creatorIds: [],
      createdAt: new Date().toISOString(),
    };
    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroupId(newGroup.id);
    setGroupName("");
    setAddGroupOpen(false);
  };

  const handleEditGroup = () => {
    if (!groupName.trim() || !selectedGroupId) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroupId ? { ...g, name: groupName.trim() } : g
      )
    );
    setGroupName("");
    setEditGroupOpen(false);
  };

  const handleDeleteGroup = () => {
    setGroups((prev) => prev.filter((g) => g.id !== selectedGroupId));
    setSelectedGroupId(groups.find((g) => g.id !== selectedGroupId)?.id || "");
    setDeleteGroupOpen(false);
  };

  const toggleCreator = (creatorId: string) => {
    setSelectedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });
  };

  const toggleAll = () => {
    if (!selectedGroup) return;
    if (selectedCreators.size === selectedGroup.creatorIds.length) {
      setSelectedCreators(new Set());
    } else {
      setSelectedCreators(new Set(selectedGroup.creatorIds));
    }
  };

  return (
    <>
      <PageHeader
        title="북마크 관리"
        description="크리에이터 그룹별 북마크를 관리합니다"
        actions={
          <Button size="sm" onClick={() => { setGroupName(""); setAddGroupOpen(true); }}>
            <Plus className="h-4 w-4 mr-1.5" />
            그룹 추가
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6">
        <div className="flex gap-6 h-full">
          {/* Left sidebar - groups */}
          <div className="w-60 shrink-0 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              그룹 목록
            </h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setSelectedCreators(new Set());
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between",
                    selectedGroupId === group.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    {group.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {group.creatorIds.length}
                  </Badge>
                </button>
              ))
            )}
          </div>

          {/* Right - creator table */}
          <div className="flex-1 space-y-4">
            {selectedGroup && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold">{selectedGroup.name}</h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => {
                        setGroupName(selectedGroup.name);
                        setEditGroupOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteGroupOpen(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={selectedCreators.size === 0}
                      onClick={() => alert(`${selectedCreators.size}명에게 캠페인 제안을 발송합니다.`)}
                    >
                      <Send className="h-3.5 w-3.5 mr-1" />
                      캠페인 제안
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={selectedCreators.size === 0}
                      onClick={() => alert(`${selectedCreators.size}명에게 회원가입 제안을 발송합니다.`)}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      회원가입 제안
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={selectedCreators.size === 0}
                      onClick={() => alert(`${selectedCreators.size}명에게 DM을 발송합니다.`)}
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      DM 발송
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">
                            <Checkbox
                              checked={
                                selectedGroup.creatorIds.length > 0 &&
                                selectedCreators.size === selectedGroup.creatorIds.length
                              }
                              onCheckedChange={toggleAll}
                            />
                          </TableHead>
                          <TableHead>크리에이터</TableHead>
                          <TableHead>카테고리</TableHead>
                          <TableHead>팔로워</TableHead>
                          <TableHead>참여율</TableHead>
                          <TableHead>온트너</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedGroup.creatorIds.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                              이 그룹에 크리에이터가 없습니다
                            </TableCell>
                          </TableRow>
                        ) : (
                          selectedGroup.creatorIds.map((cid) => {
                            const info = getCreatorInfo(cid);
                            if (!info) return null;
                            return (
                              <TableRow key={cid}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedCreators.has(cid)}
                                    onCheckedChange={() => toggleCreator(cid)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2.5">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs">
                                        {info.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{info.name}</p>
                                      <p className="text-xs text-muted-foreground">@{info.handle}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1 flex-wrap">
                                    {info.category.map((cat) => (
                                      <Badge key={cat} variant="outline" className="text-xs">
                                        {cat}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {formatNumber(info.followers)}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {info.engagementRate}%
                                </TableCell>
                                <TableCell>
                                  {info.isOntnerMember ? (
                                    <Badge variant="secondary" className="text-xs">회원</Badge>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">비회원</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}

            {!selectedGroup && !loading && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                왼쪽에서 그룹을 선택하세요
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Group Dialog */}
      <Dialog open={addGroupOpen} onOpenChange={setAddGroupOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>그룹 추가</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="그룹 이름을 입력하세요"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddGroupOpen(false)}>취소</Button>
            <Button onClick={handleAddGroup} disabled={!groupName.trim()}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={editGroupOpen} onOpenChange={setEditGroupOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>그룹 이름 수정</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="새 그룹 이름"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditGroup()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGroupOpen(false)}>취소</Button>
            <Button onClick={handleEditGroup} disabled={!groupName.trim()}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog open={deleteGroupOpen} onOpenChange={setDeleteGroupOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>그룹 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            &ldquo;{selectedGroup?.name}&rdquo; 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteGroupOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>삭제</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
