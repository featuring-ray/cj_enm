"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { AutoDmDraft } from "@/types/auto-dm-draft";
import type { DmCtaButton, FollowerFlowConfig } from "@/types/auto-dm";
import { DEFAULT_BUTTONS, DEFAULT_FOLLOWER_FLOW } from "@/types/auto-dm";

interface DraftFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft?: AutoDmDraft | null;
  onSave: (data: Partial<AutoDmDraft>) => void;
}

export function DraftFormDialog({
  open,
  onOpenChange,
  draft,
  onSave,
}: DraftFormDialogProps) {
  const [name, setName] = useState("");
  const [triggerMode, setTriggerMode] = useState<"keywords" | "all">(
    "keywords"
  );
  const [keywordsInput, setKeywordsInput] = useState("");
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [replyTexts, setReplyTexts] = useState(["", "", ""]);
  const [dmMessageBody, setDmMessageBody] = useState("");
  const [buttons, setButtons] = useState<[DmCtaButton, DmCtaButton, DmCtaButton]>([
    ...DEFAULT_BUTTONS,
  ] as [DmCtaButton, DmCtaButton, DmCtaButton]);
  const [followerFlow, setFollowerFlow] = useState<FollowerFlowConfig>({
    ...DEFAULT_FOLLOWER_FLOW,
  });

  useEffect(() => {
    if (draft) {
      setName(draft.name);
      setTriggerMode(draft.triggerMode);
      setKeywordsInput(draft.keywords.join(", "));
      setAutoReplyEnabled(draft.autoReplyEnabled);
      setReplyTexts(
        draft.replyTexts.length >= 3
          ? [...draft.replyTexts]
          : [...draft.replyTexts, ...Array(3 - draft.replyTexts.length).fill("")]
      );
      setDmMessageBody(draft.dmMessageBody);
      setButtons([...draft.buttons] as [DmCtaButton, DmCtaButton, DmCtaButton]);
      setFollowerFlow({ ...draft.followerFlow });
    } else {
      setName("");
      setTriggerMode("keywords");
      setKeywordsInput("");
      setAutoReplyEnabled(false);
      setReplyTexts(["", "", ""]);
      setDmMessageBody("");
      setButtons([...DEFAULT_BUTTONS] as [DmCtaButton, DmCtaButton, DmCtaButton]);
      setFollowerFlow({ ...DEFAULT_FOLLOWER_FLOW });
    }
  }, [draft, open]);

  const handleSave = () => {
    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    onSave({
      ...(draft ? { id: draft.id } : {}),
      name,
      triggerMode,
      keywords,
      autoReplyEnabled,
      replyTexts,
      dmMessageBody,
      dmImageUrl: null,
      buttons,
      followerFlow,
    });
    onOpenChange(false);
  };

  const updateButton = (
    index: number,
    field: keyof DmCtaButton,
    value: string | boolean
  ) => {
    const next = [...buttons] as [DmCtaButton, DmCtaButton, DmCtaButton];
    next[index] = { ...next[index], [field]: value };
    setButtons(next);
  };

  const addReplyText = () => {
    setReplyTexts([...replyTexts, ""]);
  };

  const updateReplyText = (index: number, value: string) => {
    const next = [...replyTexts];
    next[index] = value;
    setReplyTexts(next);
  };

  const removeReplyText = (index: number) => {
    if (replyTexts.length <= 3) return;
    setReplyTexts(replyTexts.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {draft ? "초안 수정" : "새 초안 만들기"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 초안 이름 */}
          <div className="space-y-2">
            <Label>초안 이름</Label>
            <Input
              placeholder="초안 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 트리거 설정 */}
          <div className="space-y-2">
            <Label>트리거 설정</Label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="triggerMode"
                  value="keywords"
                  checked={triggerMode === "keywords"}
                  onChange={() => setTriggerMode("keywords")}
                  className="accent-primary"
                />
                <span className="text-sm">키워드 트리거</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="triggerMode"
                  value="all"
                  checked={triggerMode === "all"}
                  onChange={() => setTriggerMode("all")}
                  className="accent-primary"
                />
                <span className="text-sm">모든 댓글</span>
              </label>
            </div>
            {triggerMode === "keywords" && (
              <Input
                placeholder="키워드를 쉼표(,)로 구분하여 입력 (예: 참여, 이벤트, 쿠폰)"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
              />
            )}
          </div>

          {/* 자동 대댓글 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>자동 대댓글</Label>
              <Switch
                checked={autoReplyEnabled}
                onCheckedChange={setAutoReplyEnabled}
              />
            </div>
            {autoReplyEnabled && (
              <div className="space-y-2">
                {replyTexts.map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder={`대댓글 ${i + 1}`}
                      value={text}
                      onChange={(e) => updateReplyText(i, e.target.value)}
                    />
                    {replyTexts.length > 3 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeReplyText(i)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addReplyText}
                  className="text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  대댓글 추가
                </Button>
              </div>
            )}
          </div>

          {/* DM 메시지 본문 */}
          <div className="space-y-2">
            <Label>DM 메시지 본문</Label>
            <Textarea
              placeholder="DM으로 발송할 메시지를 입력하세요 (최대 1,000자)"
              value={dmMessageBody}
              onChange={(e) => setDmMessageBody(e.target.value)}
              rows={5}
            />
            <p className="text-xs text-muted-foreground text-right">
              {dmMessageBody.length}/1,000
            </p>
          </div>

          {/* CTA 버튼 */}
          <div className="space-y-3">
            <Label>CTA 버튼 (최대 3개)</Label>
            {buttons.map((btn, i) => (
              <div key={i} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    버튼 {i + 1}
                  </span>
                  <Switch
                    checked={btn.enabled}
                    onCheckedChange={(v) => updateButton(i, "enabled", v)}
                  />
                </div>
                {btn.enabled && (
                  <div className="space-y-2">
                    <Input
                      placeholder="버튼명 (최대 20자)"
                      value={btn.name}
                      onChange={(e) =>
                        updateButton(i, "name", e.target.value)
                      }
                      maxLength={20}
                    />
                    <Input
                      placeholder="URL"
                      value={btn.url}
                      onChange={(e) =>
                        updateButton(i, "url", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 팔로워 유도 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>팔로워 유도</Label>
              <Switch
                checked={followerFlow.enabled}
                onCheckedChange={(v) =>
                  setFollowerFlow({ ...followerFlow, enabled: v })
                }
              />
            </div>
            {followerFlow.enabled && (
              <div className="space-y-3">
                <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                    미팔로우 시
                  </Badge>
                  <Input
                    placeholder="미팔로우 안내 메시지"
                    value={followerFlow.actionAMessage}
                    onChange={(e) =>
                      setFollowerFlow({
                        ...followerFlow,
                        actionAMessage: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="버튼명"
                    value={followerFlow.actionAButtonName}
                    onChange={(e) =>
                      setFollowerFlow({
                        ...followerFlow,
                        actionAButtonName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-3">
                  <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                    팔로우 시
                  </Badge>
                  <Input
                    placeholder="팔로우 보상 메시지"
                    value={followerFlow.actionBMessage}
                    onChange={(e) =>
                      setFollowerFlow({
                        ...followerFlow,
                        actionBMessage: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="버튼명"
                    value={followerFlow.actionBButtonName}
                    onChange={(e) =>
                      setFollowerFlow({
                        ...followerFlow,
                        actionBButtonName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>
            {draft ? "저장" : "생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
