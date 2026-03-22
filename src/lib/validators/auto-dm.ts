import { z } from "zod/v4";

// 실행(Run) / 업데이트(Update) 시에만 사용하는 밸리데이션 스키마
// 저장(Save)은 밸리데이션 없이 그대로 저장
export const autoDmRunSchema = z
  .object({
    name: z.string().min(1, "자동화 이름을 입력해주세요."),
    postId: z.string().min(1, "게시물을 선택해주세요.").nullable(),
    triggerMode: z.enum(["keywords", "all"]),
    keywords: z.array(z.string()),
    autoReplyEnabled: z.boolean(),
    replyTexts: z.array(z.string()),
    dmMessageBody: z
      .string()
      .min(1, "DM 메시지를 입력해주세요.")
      .max(1000, "DM 메시지는 1,000자 이내로 입력해주세요."),
    buttons: z.array(
      z.object({
        enabled: z.boolean(),
        name: z.string().max(20, "버튼명은 20자 이내로 입력해주세요."),
        url: z.string(),
      })
    ),
    followerFlow: z.object({
      enabled: z.boolean(),
      actionAMessage: z.string(),
      actionAButtonName: z.string(),
      actionBMessage: z.string(),
      actionBButtonName: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    // 게시물 필수
    if (!data.postId) {
      ctx.addIssue({
        code: "custom",
        path: ["postId"],
        message: "게시물을 선택해주세요.",
      });
    }

    // 키워드 모드일 때 키워드 필수
    if (data.triggerMode === "keywords") {
      const validKeywords = data.keywords.filter((k) => k.trim().length > 0);
      if (validKeywords.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["keywords"],
          message: "최소 1개의 키워드를 입력해주세요.",
        });
      }
      if (validKeywords.length > 10) {
        ctx.addIssue({
          code: "custom",
          path: ["keywords"],
          message: "키워드는 최대 10개까지 입력 가능합니다.",
        });
      }
    }

    // 자동 대댓글 활성 시 최소 3개 필수 + 중복 불가
    if (data.autoReplyEnabled) {
      const validReplies = data.replyTexts.filter((t) => t.trim().length > 0);
      if (validReplies.length < 3) {
        ctx.addIssue({
          code: "custom",
          path: ["replyTexts"],
          message: "자동 대댓글은 최소 3개를 입력해주세요.",
        });
      }
      const unique = new Set(validReplies.map((t) => t.trim()));
      if (unique.size !== validReplies.length) {
        ctx.addIssue({
          code: "custom",
          path: ["replyTexts"],
          message: "중복된 대댓글이 있습니다. 서로 다른 문구를 입력해주세요.",
        });
      }
    }

    // 활성화된 버튼은 이름+URL 필수
    data.buttons.forEach((btn, i) => {
      if (btn.enabled) {
        if (!btn.name.trim()) {
          ctx.addIssue({
            code: "custom",
            path: [`buttons.${i}.name`],
            message: "버튼명을 입력해주세요.",
          });
        }
        if (!btn.url.trim()) {
          ctx.addIssue({
            code: "custom",
            path: [`buttons.${i}.url`],
            message: "URL을 입력해주세요.",
          });
        }
      }
    });

    // 팔로워 유도 활성 시 메시지/버튼명 필수
    if (data.followerFlow.enabled) {
      if (!data.followerFlow.actionAMessage.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["followerFlow.actionAMessage"],
          message: "미팔로우 안내 메시지를 입력해주세요.",
        });
      }
      if (!data.followerFlow.actionAButtonName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["followerFlow.actionAButtonName"],
          message: "미팔로우 버튼명을 입력해주세요.",
        });
      }
      if (!data.followerFlow.actionBMessage.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["followerFlow.actionBMessage"],
          message: "팔로우 보상 메시지를 입력해주세요.",
        });
      }
      if (!data.followerFlow.actionBButtonName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["followerFlow.actionBButtonName"],
          message: "팔로우 보상 버튼명을 입력해주세요.",
        });
      }
    }
  });

export type AutoDmRunInput = z.infer<typeof autoDmRunSchema>;
