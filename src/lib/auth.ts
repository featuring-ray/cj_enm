import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { UserRole } from "@/types/user";

declare module "next-auth" {
  interface User {
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      image?: string;
    };
  }
}

// JWT 타입은 callbacks에서 직접 타입 단언으로 처리

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // TODO: Phase 1에서 실제 DB 조회로 교체
        // 개발용 테스트 계정
        const testUsers = [
          {
            id: "admin-1",
            email: "admin@cjenm.com",
            name: "관리자",
            role: "ADMIN" as UserRole,
            password: "admin123",
          },
          {
            id: "partner-1",
            email: "partner@test.com",
            name: "테스트 파트너",
            role: "PARTNER" as UserRole,
            password: "partner123",
          },
          {
            id: "creator-1",
            email: "creator@test.com",
            name: "테스트 크리에이터",
            role: "CREATOR" as UserRole,
            password: "creator123",
          },
        ];

        const user = testUsers.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as Record<string, unknown>).role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = (token as Record<string, unknown>).role as UserRole;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 로그인 후 역할별 리다이렉트는 클라이언트에서 처리
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
