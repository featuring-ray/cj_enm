import { NextResponse } from "next/server";
import { z } from "zod/v4";

// 빌드 시 정적 분석 방지 (DB 연결이 없어도 빌드 가능)
export const dynamic = "force-dynamic";

const registerSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("CREATOR"),
    email: z.email(),
    password: z.string().min(6),
    name: z.string().min(2),
    username: z.string().min(3),
    platform: z.enum(["instagram", "youtube", "tiktok"]),
  }),
  z.object({
    role: z.literal("PARTNER"),
    email: z.email(),
    password: z.string().min(6),
    name: z.string().min(2),
    companyName: z.string().min(2),
  }),
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "입력 데이터가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // DB가 설정되지 않은 경우 graceful 처리
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: "현재 가입 신청을 받고 있지 않습니다. 관리자에게 문의해주세요." },
        { status: 503 }
      );
    }

    const { prisma } = await import("@/lib/db");

    // 이메일 중복 확인
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "이미 사용 중인 이메일입니다." },
        { status: 409 }
      );
    }

    // 비밀번호 해시 (Node.js crypto 사용 - 프로덕션에서는 bcryptjs/argon2 권장)
    const { scryptSync, randomBytes } = await import("crypto");
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = `${salt}:${scryptSync(data.password, salt, 64).toString("hex")}`;

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        isActive: false, // 관리자 승인 후 활성화
        ...(data.role === "PARTNER" && { companyName: data.companyName }),
      },
    });

    if (data.role === "CREATOR") {
      await prisma.creatorProfile.create({
        data: {
          userId: user.id,
          username: data.username,
          displayName: data.name,
          platform: data.platform,
        },
      });
    }

    return NextResponse.json({ message: "가입 신청이 완료되었습니다." }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다. 관리자에게 문의해주세요." },
      { status: 500 }
    );
  }
}
