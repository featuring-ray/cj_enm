"use client";

import {
  Users,
  BarChart3,
} from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PortalSidebar, type NavGroup } from "@/components/layout/portal-sidebar";
import type { SessionUser } from "@/types/user";

const navGroups: NavGroup[] = [
  {
    items: [
      { label: "크리에이터", href: "/partner/creator", icon: Users },
    ],
  },
  {
    items: [
      { label: "성과", href: "/partner/performance", icon: BarChart3 },
    ],
  },
];

const mockUser: SessionUser = {
  id: "partner-1",
  email: "partner@test.com",
  name: "파트너사",
  role: "PARTNER",
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PortalSidebar
        portalName="파트너 포털"
        portalBadge={mockUser.name}
        navGroups={navGroups}
        user={mockUser}
      />
      <SidebarInset className="flex flex-col min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
