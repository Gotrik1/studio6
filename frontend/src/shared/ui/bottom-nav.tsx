"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  Users,
  Trophy,
  MessageSquare,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Newspaper, label: "Лента" },
  { href: "/teams", icon: Users, label: "Команды" },
  { href: "/tournaments", icon: Trophy, label: "Турниры" },
  { href: "/chats", icon: MessageSquare, label: "Чаты" },
  { href: "/profile", icon: UserIcon, label: "Профиль" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const isActive =
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href !== "/dashboard" &&
              (pathname || "").startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
