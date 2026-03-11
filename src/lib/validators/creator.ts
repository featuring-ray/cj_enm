import { z } from "zod/v4";

export const creatorSearchSchema = z.object({
  categories: z.array(z.string()).optional(),
  excludeCategories: z.array(z.string()).optional(),
  brands: z.array(z.string()).optional(),
  includeSimilarBrands: z.boolean().optional(),
  unitPriceRange: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
    })
    .optional(),
  commerceOnly: z.boolean().optional(),
  excludeOfficialAndCelebrity: z.boolean().optional(),
  sortBy: z.enum(["comments", "shares", "views", "likes", "followers"]),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  viewMode: z.enum(["account", "content"]).default("account"),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

export const audienceOverlapSchema = z.object({
  creatorIds: z
    .array(z.string())
    .min(2, "최소 2명의 크리에이터를 선택해주세요."),
});

export type CreatorSearchInput = z.infer<typeof creatorSearchSchema>;
export type AudienceOverlapInput = z.infer<typeof audienceOverlapSchema>;
