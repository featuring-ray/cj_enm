export type UserRole = "ADMIN" | "PARTNER" | "CREATOR";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  companyName?: string; // 파트너 전용
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}
