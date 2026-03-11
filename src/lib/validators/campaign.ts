import { z } from "zod/v4";

export const createCampaignSchema = z.object({
  title: z.string().min(2, "캠페인 제목은 2자 이상이어야 합니다."),
  description: z.string().min(10, "설명은 10자 이상이어야 합니다."),
  brandId: z.string().min(1, "브랜드를 선택해주세요."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  budget: z.number().positive("예산은 0보다 커야 합니다."),
  unitPrice: z.number().positive("객단가는 0보다 커야 합니다."),
  startDate: z.string(),
  endDate: z.string(),
});

export const campaignProposalSchema = z.object({
  campaignId: z.string(),
  creatorIds: z.array(z.string()).min(1, "최소 1명의 크리에이터를 선택해주세요."),
  message: z.string().min(10, "메시지는 10자 이상이어야 합니다."),
  sendVia: z.enum(["system", "dm", "email"]),
  includeSignupLink: z.boolean().default(false),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type CampaignProposalInput = z.infer<typeof campaignProposalSchema>;
