"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import type { Creator } from "@/types/creator";
import mockCreatorsJson from "@/data/mock/creators.json";

interface CreatorSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (creators: Creator[]) => void;
  excludeIds?: string[];
  singleSelect?: boolean;
  title?: string;
}

function formatNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString("ko-KR");
}

// Map mock JSON to the Creator type shape needed for display
function mockToCreator(c: (typeof mockCreatorsJson)[number]): Creator {
  return {
    id: c.id,
    username: c.handle,
    displayName: c.name,
    profileImage: c.profileImage ?? undefined,
    platform: "instagram",
    followerCount: c.followers,
    averageLikes: 0,
    averageComments: 0,
    averageShares: 0,
    averageViews: 0,
    engagementRate: c.engagementRate,
    score: 0,
    categories: typeof c.category === "string" ? [c.category] : (c.category as string[]),
    brands: [],
    isOntnerMember: c.isOntnerMember,
    isCommerceAccount: false,
    isOfficialAccount: false,
    isCelebrity: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function CreatorSearchDialog({
  open,
  onOpenChange,
  onSelect,
  excludeIds = [],
  singleSelect = false,
  title = "크리에이터 검색",
}: CreatorSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const allCreators = useMemo(
    () =>
      mockCreatorsJson
        .filter((c) => !excludeIds.includes(c.id))
        .map(mockToCreator),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [excludeIds.join(",")]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return allCreators;
    const q = query.toLowerCase();
    return allCreators.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q)
    );
  }, [query, allCreators]);

  const toggleSelect = (id: string) => {
    if (singleSelect) {
      setSelected([id]);
      return;
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const creators = allCreators.filter((c) => selected.includes(c.id));
    onSelect(creators);
    setSelected([]);
    setQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름 또는 핸들로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-72 overflow-y-auto divide-y">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              검색 결과가 없습니다
            </p>
          ) : (
            filtered.map((creator) => {
              const isSelected = selected.includes(creator.id);
              return (
                <button
                  key={creator.id}
                  onClick={() => toggleSelect(creator.id)}
                  className="flex items-center gap-3 w-full px-2 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  {!singleSelect && (
                    <Checkbox checked={isSelected} tabIndex={-1} />
                  )}
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {creator.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{creator.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      @{creator.username} · {formatNumber(creator.followerCount)} 팔로워
                    </p>
                  </div>
                  {singleSelect && isSelected && (
                    <span className="text-xs text-primary font-medium shrink-0">선택됨</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={selected.length === 0}
          className="w-full"
        >
          {selected.length > 0
            ? `${selected.length}명 선택 완료`
            : "크리에이터를 선택해주세요"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
