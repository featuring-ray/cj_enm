"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/types/user";

export interface OntnerNavSubItem {
  label: string;
  href: string;
}

export interface OntnerNavGroup {
  label: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  items: OntnerNavSubItem[];
}

interface OntnerSidebarProps {
  navGroups: OntnerNavGroup[];
  user: SessionUser;
  onLogout?: () => void;
}

export function OntnerSidebar({ navGroups, user, onLogout }: OntnerSidebarProps) {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navGroups.forEach((g) => {
      if (g.defaultOpen) initial[g.label] = true;
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
    <aside className="flex flex-col w-[220px] min-h-screen bg-white border-r border-gray-100 shrink-0">
      {/* Logo */}
      <div className="px-6 py-5">
        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-violet-500 to-teal-400 bg-clip-text text-transparent select-none">
          ONTNER
        </span>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-3 px-6 pb-5">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-purple-500 to-teal-400 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-gray-900 truncate">{user.name}님</span>
          <span className="inline-flex items-center mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r from-purple-500 to-teal-400 w-fit">
            {user.role === "CREATOR" ? "크리에이터" : user.role === "PARTNER" ? "파트너" : "관리자"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navGroups.map((group) => {
          const isOpen = !!openGroups[group.label];
          const Icon = group.icon;
          const hasActiveChild = group.items.some(
            (item) => pathname === item.href || pathname.startsWith(item.href + "/")
          );

          return (
            <div key={group.label}>
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "flex items-center w-full px-3 py-2.5 text-sm transition-colors",
                  hasActiveChild
                    ? "text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className="h-4 w-4 mr-2.5 shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Sub Items */}
              {isOpen && (
                <div className="ml-9 mt-0.5 mb-1 space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href + "/"));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block px-2 py-2 text-sm transition-colors",
                          isActive
                            ? "text-purple-600 font-medium underline underline-offset-2"
                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-5">
        <Button
          variant="outline"
          className="w-full text-gray-600 border-gray-200 hover:bg-gray-50"
          onClick={onLogout}
        >
          로그아웃
        </Button>
      </div>
    </aside>
  );
}
