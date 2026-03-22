"use client";

import { ArrowDown, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FollowerFlowConfig } from "@/types/auto-dm";

interface FollowerFlowEditorProps {
  flow: FollowerFlowConfig;
  onChange: (flow: FollowerFlowConfig) => void;
  errors?: Partial<Record<string, string>>;
}

export function FollowerFlowEditor({
  flow,
  onChange,
  errors = {},
}: FollowerFlowEditorProps) {
  const update = (field: keyof FollowerFlowConfig, value: string) => {
    onChange({ ...flow, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* 플로우 다이어그램 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <p className="text-xs font-medium text-gray-600 mb-3">
          팔로워 유도 플로우
        </p>
        <div className="flex flex-col items-center gap-1 text-xs">
          <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">
            댓글 트리거 발생
          </div>
          <ArrowDown className="w-4 h-4 text-gray-400" />
          <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">
            팔로우 상태 확인
          </div>
          <div className="flex items-start gap-6 mt-1">
            <div className="flex flex-col items-center gap-1">
              <ArrowDown className="w-4 h-4 text-red-400" />
              <div className="flex items-center gap-1 text-red-600">
                <UserX className="w-3.5 h-3.5" />
                <span>미팔로우</span>
              </div>
              <div className="bg-red-50 text-red-600 px-2 py-1 rounded text-center">
                Action A
                <br />
                팔로우 유도
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ArrowDown className="w-4 h-4 text-green-400" />
              <div className="flex items-center gap-1 text-green-600">
                <UserCheck className="w-3.5 h-3.5" />
                <span>팔로워</span>
              </div>
              <div className="bg-green-50 text-green-600 px-2 py-1 rounded text-center">
                Action B
                <br />
                혜택 제공
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action A: 미팔로우 */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <UserX className="w-4 h-4 text-red-500" />
          <Label className="text-sm font-medium">
            Action A: 미팔로우 시 발송 메시지
          </Label>
        </div>
        <Textarea
          value={flow.actionAMessage}
          onChange={(e) => update("actionAMessage", e.target.value)}
          placeholder="팔로우를 유도하는 메시지를 입력하세요"
          rows={3}
        />
        {errors["followerFlow.actionAMessage"] && (
          <p className="text-xs text-red-500">
            {errors["followerFlow.actionAMessage"]}
          </p>
        )}
        <div>
          <Label className="text-xs text-muted-foreground">버튼명</Label>
          <Input
            value={flow.actionAButtonName}
            onChange={(e) => update("actionAButtonName", e.target.value)}
            placeholder="예: 팔로우 완료했어요"
            maxLength={20}
          />
          {errors["followerFlow.actionAButtonName"] && (
            <p className="text-xs text-red-500">
              {errors["followerFlow.actionAButtonName"]}
            </p>
          )}
        </div>
      </div>

      {/* Action B: 팔로워 */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-green-500" />
          <Label className="text-sm font-medium">
            Action B: 팔로우 중일 때 발송 메시지
          </Label>
        </div>
        <Textarea
          value={flow.actionBMessage}
          onChange={(e) => update("actionBMessage", e.target.value)}
          placeholder="혜택/정보를 제공하는 메시지를 입력하세요"
          rows={3}
        />
        {errors["followerFlow.actionBMessage"] && (
          <p className="text-xs text-red-500">
            {errors["followerFlow.actionBMessage"]}
          </p>
        )}
        <div>
          <Label className="text-xs text-muted-foreground">버튼명</Label>
          <Input
            value={flow.actionBButtonName}
            onChange={(e) => update("actionBButtonName", e.target.value)}
            placeholder="예: 혜택 확인하기"
            maxLength={20}
          />
          {errors["followerFlow.actionBButtonName"] && (
            <p className="text-xs text-red-500">
              {errors["followerFlow.actionBButtonName"]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
