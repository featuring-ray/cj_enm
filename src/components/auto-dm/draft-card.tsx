"use client";

import { Copy, Edit2, Eye, Send, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AutoDmDraft } from "@/types/auto-dm-draft";

interface DraftCardProps {
  draft: AutoDmDraft;
  onEdit: (draft: AutoDmDraft) => void;
  onDuplicate: (draft: AutoDmDraft) => void;
  onDelete: (draft: AutoDmDraft) => void;
  onPreview: (draft: AutoDmDraft) => void;
  onSend: (draft: AutoDmDraft) => void;
}

export function DraftCard({
  draft,
  onEdit,
  onDuplicate,
  onDelete,
  onPreview,
  onSend,
}: DraftCardProps) {
  const activeButtonCount = draft.buttons.filter((b) => b.enabled).length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {draft.name}
          </h3>
          <Badge
            variant={draft.status === "발송 완료" ? "default" : "secondary"}
            className="shrink-0 text-xs"
          >
            {draft.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 트리거 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {draft.triggerMode === "keywords" ? "키워드" : "모든 댓글"}
          </Badge>
          {draft.triggerMode === "keywords" &&
            draft.keywords.slice(0, 3).map((kw) => (
              <Badge key={kw} variant="secondary" className="text-xs">
                {kw}
              </Badge>
            ))}
          {draft.keywords.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{draft.keywords.length - 3}
            </span>
          )}
        </div>

        {/* DM 본문 미리보기 */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {draft.dmMessageBody || "(메시지 미작성)"}
        </p>

        {/* 기능 뱃지 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {activeButtonCount > 0 && (
            <Badge variant="outline" className="text-xs">
              버튼 {activeButtonCount}개
            </Badge>
          )}
          {draft.autoReplyEnabled && (
            <Badge variant="outline" className="text-xs">
              대댓글
            </Badge>
          )}
          {draft.followerFlow.enabled && (
            <Badge variant="outline" className="text-xs">
              팔로워 유도
            </Badge>
          )}
        </div>

        {/* 수정일 */}
        <p className="text-xs text-muted-foreground">
          수정일:{" "}
          {new Date(draft.updatedAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>

        {/* 액션 */}
        <div className="flex items-center gap-1 pt-1 border-t">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(draft)}
            title="수정"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDuplicate(draft)}
            title="복제"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPreview(draft)}
            title="미리보기"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(draft)}
            title="삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <div className="flex-1" />
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs"
            onClick={() => onSend(draft)}
          >
            <Send className="mr-1 h-3 w-3" />
            발송하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
