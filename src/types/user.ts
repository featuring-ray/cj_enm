export type UserRole = "ADMIN" | "PARTNER" | "CREATOR" | "AGENCY";

export type MemberType = "individual" | "agency";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  companyName?: string; // 파트너 전용
  memberType?: MemberType; // 크리에이터: individual, 에이전시: agency
  creatorCodes?: { id: string; name: string }[]; // 에이전시 소속 크리에이터 목록
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  memberType?: MemberType;
  creatorCodes?: { id: string; name: string }[];
}
