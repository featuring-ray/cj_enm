"use client";

import { Send } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PortalSidebar, type NavGroup } from "@/components/layout/portal-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: NavGroup[] = [
  {
    label: "DM 관리",
    items: [
      { label: "DM 어드민 설정", href: "/admin/dm", icon: Send },
    ],
  },
];

const mockUser: SessionUser = {
  id: "sysadmin-1",
  email: "sysadmin@cjenm.com",
  name: "시스템 관리자",
  role: "ADMIN",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PortalSidebar
        portalName="어드민"
        portalBadge="시스템 관리"
        navGroups={navGroups}
        user={mockUser}
      />
      <SidebarInset className="flex flex-col min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
