import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

export const registerCreatorSchema = z.object({
  email: z.email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
  name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
  username: z
    .string()
    .min(3, "사용자명은 3자 이상이어야 합니다.")
    .regex(/^[a-zA-Z0-9_]+$/, "영문, 숫자, 밑줄만 사용 가능합니다."),
  platform: z.enum(["instagram", "youtube", "tiktok"]),
});

export const registerPartnerSchema = z.object({
  email: z.email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
  name: z.string().min(2, "담당자명은 2자 이상이어야 합니다."),
  companyName: z.string().min(2, "회사명은 2자 이상이어야 합니다."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterCreatorInput = z.infer<typeof registerCreatorSchema>;
export type RegisterPartnerInput = z.infer<typeof registerPartnerSchema>;
