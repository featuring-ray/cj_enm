"use client";

import { Plus, Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyTextListProps {
  texts: string[];
  onChange: (texts: string[]) => void;
  error?: string;
}

export function ReplyTextList({ texts, onChange, error }: ReplyTextListProps) {
  const addText = () => {
    onChange([...texts, ""]);
  };

  const removeText = (index: number) => {
    if (texts.length <= 3) return;
    onChange(texts.filter((_, i) => i !== index));
  };

  const updateText = (index: number, value: string) => {
    const updated = [...texts];
    updated[index] = value;
    onChange(updated);
  };

  // 중복 체크
  const getDuplicateIndices = () => {
    const seen = new Map<string, number>();
    const duplicates = new Set<number>();
    texts.forEach((t, i) => {
      const trimmed = t.trim();
      if (!trimmed) return;
      if (seen.has(trimmed)) {
        duplicates.add(seen.get(trimmed)!);
        duplicates.add(i);
      } else {
        seen.set(trimmed, i);
      }
    });
    return duplicates;
  };

  const duplicates = getDuplicateIndices();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shuffle className="w-3.5 h-3.5" />
        <span>시스템이 랜덤으로 1개를 선택하여 대댓글을 남깁니다.</span>
      </div>

      {texts.map((text, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Textarea
                value={text}
                onChange={(e) => updateText(index, e.target.value)}
                placeholder={`대댓글 ${index + 1}을 입력하세요`}
                maxLength={1000}
                rows={2}
                className={
                  duplicates.has(index)
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              <div className="flex justify-between mt-0.5">
                {duplicates.has(index) && (
                  <span className="text-xs text-red-500">
                    중복된 문구입니다.
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {text.length}/1,000
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 mt-1"
              onClick={() => removeText(index)}
              disabled={texts.length <= 3}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addText}
      >
        <Plus className="w-4 h-4 mr-1.5" />
        대댓글 추가
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
