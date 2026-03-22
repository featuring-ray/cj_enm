"use client";

import { Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { DmCtaButton } from "@/types/auto-dm";

interface DmButtonEditorProps {
  buttons: [DmCtaButton, DmCtaButton, DmCtaButton];
  onChange: (buttons: [DmCtaButton, DmCtaButton, DmCtaButton]) => void;
  errors?: Partial<Record<string, string>>;
}

export function DmButtonEditor({
  buttons,
  onChange,
  errors = {},
}: DmButtonEditorProps) {
  const updateButton = (
    index: number,
    field: keyof DmCtaButton,
    value: string | boolean
  ) => {
    const updated = [...buttons] as [DmCtaButton, DmCtaButton, DmCtaButton];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {buttons.map((btn, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              버튼 {index + 1}
            </Label>
            <Switch
              checked={btn.enabled}
              onCheckedChange={(checked) =>
                updateButton(index, "enabled", checked)
              }
            />
          </div>

          {btn.enabled && (
            <div className="space-y-3 pl-0">
              <div>
                <Label className="text-xs text-muted-foreground">버튼명</Label>
                <Input
                  value={btn.name}
                  onChange={(e) =>
                    updateButton(index, "name", e.target.value)
                  }
                  placeholder="버튼명을 입력하세요"
                  maxLength={20}
                />
                <div className="flex justify-between mt-0.5">
                  {errors[`buttons.${index}.name`] && (
                    <span className="text-xs text-red-500">
                      {errors[`buttons.${index}.name`]}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {btn.name.length}/20
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">URL</Label>
                <div className="relative">
                  <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={btn.url}
                    onChange={(e) =>
                      updateButton(index, "url", e.target.value)
                    }
                    placeholder="https://..."
                    className="pl-8"
                  />
                </div>
                {errors[`buttons.${index}.url`] && (
                  <span className="text-xs text-red-500">
                    {errors[`buttons.${index}.url`]}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Link2 className="w-3.5 h-3.5" />
        링크는 클릭 추적을 위해 리다이렉트 URL로 변환됩니다.
      </p>
    </div>
  );
}
