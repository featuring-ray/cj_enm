"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Hash,
  Globe,
  MessageCircle,
  Send,
  UserPlus,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostSelector } from "./post-selector";
import { ReplyTextList } from "./reply-text-list";
import { DmButtonEditor } from "./dm-button-editor";
import { FollowerFlowEditor } from "./follower-flow-editor";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";
import { AutomationStatusBadge } from "./automation-status-badge";
import { autoDmRunSchema } from "@/lib/validators/auto-dm";
import type {
  AutomationStatus,
  AutoDmFormState,
  AutoDmFormErrors,
  TriggerMode,
  DmCtaButton,
  FollowerFlowConfig,
} from "@/types/auto-dm";
import { EMPTY_FORM_STATE } from "@/types/auto-dm";

interface AutomationFormProps {
  initialData?: AutoDmFormState;
  status: AutomationStatus;
  automationId?: string;
  sourceDraftId?: string | null;
  sourceCampaignName?: string | null;
}

export function AutomationForm({
  initialData,
  status,
  automationId,
  sourceDraftId,
  sourceCampaignName,
}: AutomationFormProps) {
  const router = useRouter();
  const initial = initialData ?? EMPTY_FORM_STATE;

  // 폼 상태
  const [name, setName] = useState(initial.name);
  const [postId, setPostId] = useState(initial.postId);
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(
    initial.triggerMode
  );
  const [keywordsInput, setKeywordsInput] = useState(initial.keywordsInput);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(
    initial.autoReplyEnabled
  );
  const [replyTexts, setReplyTexts] = useState<string[]>(initial.replyTexts);
  const [dmMessageBody, setDmMessageBody] = useState(initial.dmMessageBody);
  const [dmImageUrl, setDmImageUrl] = useState(initial.dmImageUrl);
  const [buttons, setButtons] = useState(initial.buttons);
  const [followerFlow, setFollowerFlow] = useState<FollowerFlowConfig>(
    initial.followerFlow
  );
  const [errors, setErrors] = useState<AutoDmFormErrors>({});
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);

  // dirty 추적
  const currentState = useMemo(
    () =>
      JSON.stringify({
        name,
        postId,
        triggerMode,
        keywordsInput,
        autoReplyEnabled,
        replyTexts,
        dmMessageBody,
        dmImageUrl,
        buttons,
        followerFlow,
      }),
    [
      name,
      postId,
      triggerMode,
      keywordsInput,
      autoReplyEnabled,
      replyTexts,
      dmMessageBody,
      dmImageUrl,
      buttons,
      followerFlow,
    ]
  );
  const initialState = useMemo(() => JSON.stringify(initial), [initial]);
  const isDirty = currentState !== initialState;

  // beforeunload 가드
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // 키워드 파싱
  const parsedKeywords = useMemo(
    () =>
      keywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    [keywordsInput]
  );

  // 폼 데이터 수집
  const getFormData = useCallback(
    () => ({
      name,
      postId,
      triggerMode,
      keywords: parsedKeywords,
      autoReplyEnabled,
      replyTexts,
      dmMessageBody,
      buttons: buttons as { enabled: boolean; name: string; url: string }[],
      followerFlow,
    }),
    [
      name,
      postId,
      triggerMode,
      parsedKeywords,
      autoReplyEnabled,
      replyTexts,
      dmMessageBody,
      buttons,
      followerFlow,
    ]
  );

  // 밸리데이션 실행
  const validate = (): boolean => {
    const result = autoDmRunSchema.safeParse(getFormData());
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrors: AutoDmFormErrors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!newErrors[path]) {
        newErrors[path] = issue.message;
      }
    });
    setErrors(newErrors);
    return false;
  };

  // 저장 (초안만, 밸리데이션 없음)
  const handleSave = () => {
    alert("저장되었습니다.");
  };

  // 실행
  const handleRun = () => {
    if (!validate()) return;
    alert("자동화가 실행되었습니다.");
    router.push("/ontner/dm/auto");
  };

  // 업데이트
  const handleUpdate = () => {
    if (!validate()) return;
    if (status === "실행 중") {
      setShowUpdateNotice(true);
    } else {
      alert("설정이 업데이트되었습니다.");
    }
  };

  const confirmUpdate = () => {
    setShowUpdateNotice(false);
    alert("설정이 업데이트되었습니다. 새로 유입되는 댓글부터 적용됩니다.");
  };

  // 중단
  const handleStop = () => {
    if (
      confirm(
        "자동화를 중단하시겠습니까? 대기 중이던 발송도 함께 중단됩니다."
      )
    ) {
      alert("자동화가 중단되었습니다.");
      router.push("/ontner/dm/auto");
    }
  };

  // 취소/이탈
  const handleCancel = () => {
    if (isDirty) {
      setShowExitDialog(true);
    } else {
      router.push("/ontner/dm/auto");
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    router.push("/ontner/dm/auto");
  };

  return (
    <div className="pb-24">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold">
          {automationId ? "자동 DM 편집" : "새 자동 DM 만들기"}
        </h2>
        <AutomationStatusBadge status={status} />
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* MD 초안 출처 정보 */}
        {sourceDraftId && sourceCampaignName && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              이 자동화는 MD 초안에서 생성되었습니다. (캠페인: <strong>{sourceCampaignName}</strong>)
            </p>
          </div>
        )}

        {/* 섹션 1: 자동화 이름 */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <Label className="text-sm font-medium">자동화 이름</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="자동화 이름을 입력하세요"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </CardContent>
        </Card>

        {/* 섹션 2: 게시물 선택 */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <Label className="text-sm font-medium">
                어떤 게시물에서 진행할까요?
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              현재 1개 게시물만 선택 가능합니다. (추후 최대 5개 지원 예정)
            </p>
            <PostSelector
              selectedPostId={postId}
              currentAutomationId={automationId}
              onSelect={(id) => {
                setPostId(id);
                setErrors((prev) => ({ ...prev, postId: undefined }));
              }}
              error={errors.postId}
            />
          </CardContent>
        </Card>

        {/* 섹션 3: 트리거 설정 */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-500" />
              <Label className="text-sm font-medium">
                어떤 댓글에 반응할까요?
              </Label>
            </div>

            <div className="space-y-3">
              {/* Option 1 */}
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="triggerMode"
                  value="keywords"
                  checked={triggerMode === "keywords"}
                  onChange={() => setTriggerMode("keywords")}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    특정 단어가 들어간 댓글
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    키워드를 쉼표(,)로 구분하여 입력하세요. OR 조건으로
                    동작합니다.
                  </p>
                </div>
              </label>

              {triggerMode === "keywords" && (
                <div className="ml-7 space-y-2">
                  <Input
                    value={keywordsInput}
                    onChange={(e) => {
                      setKeywordsInput(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        keywords: undefined,
                      }));
                    }}
                    placeholder="예: 참여, 이벤트, 쿠폰"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {parsedKeywords.map((kw, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {parsedKeywords.length}/10개
                  </p>
                  {errors.keywords && (
                    <p className="text-sm text-red-500">{errors.keywords}</p>
                  )}
                </div>
              )}

              {/* Option 2 */}
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="triggerMode"
                  value="all"
                  checked={triggerMode === "all"}
                  onChange={() => setTriggerMode("all")}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      모든 댓글에 반응하기
                    </span>
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    게시물에 달린 모든 댓글에 반응합니다.
                  </p>
                  <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50 rounded text-xs text-amber-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      대량 발송 시 계정 정지 위험이 있으니 주의하세요.
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 섹션 4: 자동 대댓글 */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-500" />
                <Label className="text-sm font-medium">
                  공개 답글(대댓글) 남기기
                </Label>
              </div>
              <Switch
                checked={autoReplyEnabled}
                onCheckedChange={setAutoReplyEnabled}
              />
            </div>

            {autoReplyEnabled && (
              <ReplyTextList
                texts={replyTexts}
                onChange={setReplyTexts}
                error={errors.replyTexts}
              />
            )}
          </CardContent>
        </Card>

        {/* 섹션 5: DM 발송 설정 */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-500" />
              <Label className="text-sm font-medium">
                어떤 메시지를 보낼까요?
              </Label>
            </div>

            {/* DM 본문 */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">DM 본문</Label>
              <Textarea
                value={dmMessageBody}
                onChange={(e) => {
                  setDmMessageBody(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    dmMessageBody: undefined,
                  }));
                }}
                placeholder="DM 메시지를 입력하세요"
                rows={6}
                maxLength={1000}
              />
              <div className="flex justify-between">
                {errors.dmMessageBody && (
                  <span className="text-xs text-red-500">
                    {errors.dmMessageBody}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {dmMessageBody.length}/1,000
                </span>
              </div>
            </div>

            {/* 이미지 URL (mock) */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                이미지 URL (선택)
              </Label>
              <Input
                value={dmImageUrl ?? ""}
                onChange={(e) =>
                  setDmImageUrl(e.target.value || null)
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* 버튼 */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                CTA 버튼 (최대 3개)
              </Label>
              <DmButtonEditor
                buttons={buttons}
                onChange={setButtons}
                errors={errors}
              />
            </div>
          </CardContent>
        </Card>

        {/* 섹션 6: 팔로워 유도 */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-500" />
                <Label className="text-sm font-medium">
                  전송 전, 팔로우를 유도할까요?
                </Label>
              </div>
              <Switch
                checked={followerFlow.enabled}
                onCheckedChange={(checked) =>
                  setFollowerFlow((prev) => ({ ...prev, enabled: checked }))
                }
              />
            </div>

            {followerFlow.enabled && (
              <FollowerFlowEditor
                flow={followerFlow}
                onChange={setFollowerFlow}
                errors={errors}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* 하단 액션바 */}
      <div className="fixed bottom-0 left-[220px] right-0 bg-white border-t px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          {status === "실행 중" && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded">
              <Info className="w-3.5 h-3.5" />
              업데이트 시 새로 유입되는 댓글부터 적용됩니다.
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status === "초안" && (
            <>
              <Button variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button variant="secondary" onClick={handleSave}>
                저장하기
              </Button>
              <Button onClick={handleRun}>실행하기</Button>
            </>
          )}
          {status === "실행 중" && (
            <>
              <Button onClick={handleUpdate}>업데이트</Button>
              <Button variant="destructive" onClick={handleStop}>
                중단하기
              </Button>
            </>
          )}
          {status === "중단됨" && (
            <>
              <Button variant="secondary" onClick={handleUpdate}>
                업데이트
              </Button>
              <Button onClick={handleRun}>실행하기</Button>
            </>
          )}
        </div>
      </div>

      {/* 이탈 확인 모달 */}
      <UnsavedChangesDialog
        open={showExitDialog}
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitDialog(false)}
      />

      {/* 업데이트 확인 모달 */}
      {showUpdateNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 space-y-4">
            <h3 className="font-semibold">설정 업데이트 안내</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                수정된 설정은 업데이트 이후 새로 유입되는 댓글부터 적용됩니다.
              </p>
              <p>
                이미 처리되었거나 발송 대기 상태의 댓글에는 소급 적용되지
                않습니다.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUpdateNotice(false)}
              >
                취소
              </Button>
              <Button onClick={confirmUpdate}>확인</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
