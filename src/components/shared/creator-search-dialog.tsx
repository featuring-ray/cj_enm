"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, CheckCircle2, CircleDashed, ChevronRight } from "lucide-react";
import { featuringApi } from "@/lib/featuring-api";
import type { Creator } from "@/types/creator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface CreatorSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 이미 선택된 creatorId 목록 (비활성화) */
  excludeIds?: string[];
  /** 단일 선택 모드 */
  singleSelect?: boolean;
  onSelect: (creators: Creator[]) => void;
  title?: string;
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

export function CreatorSearchDialog({
  open,
  onOpenChange,
  excludeIds = [],
  singleSelect = false,
  onSelect,
  title = "크리에이터 검색",
}: CreatorSearchDialogProps) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await featuringApi.searchCreators({
        sortBy: "followers",
        sortOrder: "desc",
        viewMode: "account",
        page: 1,
        pageSize: 50,
      });
      setCreators(result.creators);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      load();
      setSelected(new Set());
      setSearch("");
    }
  }, [open, load]);

  const filtered = creators.filter(
    (c) =>
      !excludeIds.includes(c.id) &&
      (!search ||
        c.displayName.includes(search) ||
        c.username.includes(search))
  );

  function toggleSelect(id: string) {
    if (singleSelect) {
      setSelected(new Set([id]));
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    const picked = creators.filter((c) => selected.has(c.id));
    onSelect(picked);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="크리에이터명 또는 @아이디 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          {loading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-muted rounded animate-pulse w-32" />
                    <div className="h-3 bg-muted rounded animate-pulse w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              검색 결과가 없습니다
            </p>
          ) : (
            <ul className="divide-y">
              {filtered.map((creator) => {
                const isSelected = selected.has(creator.id);
                return (
                  <li
                    key={creator.id}
                    className={`flex items-center gap-3 py-3 cursor-pointer rounded-lg px-2 hover:bg-muted/50 transition-colors ${isSelected ? "bg-primary/5" : ""}`}
                    onClick={() => toggleSelect(creator.id)}
                  >
                    {!singleSelect && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(creator.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                      {creator.displayName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{creator.displayName}</p>
                        {creator.isOntnerMember ? (
                          <span className="flex items-center gap-0.5 text-xs text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" />온트너
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <CircleDashed className="w-3 h-3" />비회원
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">@{creator.username} · {creator.platform}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex gap-1 justify-end mb-0.5">
                        {creator.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs py-0">{cat}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">팔로워 {formatNumber(creator.followerCount)}</p>
                    </div>
                    {singleSelect && isSelected && (
                      <ChevronRight className="w-4 h-4 text-primary" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              {selected.size > 0 ? `${selected.size}명 선택됨` : "크리에이터를 선택하세요"}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
              <Button onClick={handleConfirm} disabled={selected.size === 0}>
                선택 완료
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
