"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, MessageSquare, Settings, Users, LogOut, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "My Events",
    icon: Calendar,
    href: "/dashboard/events",
  },
  {
    label: "Sponsor Matches",
    icon: Users,
    href: "/dashboard/matches",
  },
  {
    label: "Browse Events",
    icon: Compass,
    href: "/events",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/dashboard/messages",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col bg-background border-r border-border h-full">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="font-bold text-lg tracking-tight">E2S</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
        {routes.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <route.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {route.label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-border p-4">
        <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}
