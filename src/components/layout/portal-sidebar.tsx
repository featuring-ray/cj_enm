"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Home, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { SessionUser } from "@/types/user";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

interface PortalSidebarProps {
  portalName: string;
  portalBadge?: string;
  navGroups: NavGroup[];
  user: SessionUser;
}

export function PortalSidebar({
  portalName,
  portalBadge,
  navGroups,
  user,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 활성 자식이 있는 그룹은 기본 열림
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navGroups.forEach((g) => {
      if (!g.label) return;
      const hasActive = g.items.some(
        (item) =>
          !item.disabled &&
          (pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href)))
      );
      if (hasActive) initial[g.label] = true;
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar>
      {/* Header: Logo + Portal Name */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold shrink-0">
            CJ
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">{portalName}</span>
            {portalBadge && (
              <span className="text-xs text-muted-foreground">{portalBadge}</span>
            )}
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        {navGroups.map((group, idx) => {
          const label = group.label ?? `group-${idx}`;
          const isOpen = !!openGroups[label];
          const hasActiveChild = group.items.some(
            (item) =>
              !item.disabled &&
              (pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href)))
          );

          return (
            <SidebarGroup key={idx} className="py-0">
              {/* 그룹 헤더 (접기/펼치기) */}
              {group.label && (
                <button
                  onClick={() => toggleGroup(group.label!)}
                  className={cn(
                    "flex items-center w-full gap-2 px-3 py-2.5 text-xs font-medium transition-colors select-none",
                    hasActiveChild
                      ? "text-sidebar-foreground"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                      !isOpen && "-rotate-90"
                    )}
                  />
                  <span>{group.label}</span>
                </button>
              )}

              {/* 하위 메뉴 (접히는 영역) */}
              {(isOpen || !group.label) && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive =
                        !item.disabled &&
                        (pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href)));

                      if (item.disabled) {
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                className="opacity-40 cursor-not-allowed pl-7"
                              >
                                <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{item.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuItem>
                        );
                      }

                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.label}
                            size="sm"
                            className="pl-7"
                          >
                            <Link href={item.href}>
                              <item.icon
                                className={cn(
                                  "h-3.5 w-3.5",
                                  isActive ? "text-primary" : "text-muted-foreground"
                                )}
                              />
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white bg-primary leading-none">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* Footer: User + Logout */}
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-2 space-y-1">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
          <Separator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                <span>홈으로</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
