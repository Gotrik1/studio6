"use client";

import { useState, useEffect, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import {
  Bell,
  UserPlus,
  Trophy,
  Gavel,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  getNotifications,
  markAllNotificationsAsRead,
  type Notification,
} from "@/entities/notification/api/notifications";

const iconMap: { [key: string]: React.ElementType } = {
  FRIEND_REQUEST: UserPlus,
  TOURNAMENT_REGISTERED: Trophy,
  NEW_MESSAGE: MessageSquare,
  DISPUTE_RESOLVED: Gavel,
  MATCH_RESULT: Trophy,
  default: AlertTriangle,
};

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-1 text-xs">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Открыть уведомления</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Уведомления</span>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
            >
              Отметить все как прочитанные
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type] || iconMap.default;
              return (
                <DropdownMenuItem
                  key={notification.id}
                  asChild
                  className="cursor-pointer p-0"
                >
                  <Link
                    href={notification.href || "#"}
                    className={cn(
                      "flex items-start gap-3 p-2",
                      !notification.isRead && "bg-accent/50",
                    )}
                  >
                    <div className="flex items-center h-full pt-1">
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-medium leading-tight">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString(
                          "ru-RU",
                        )}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Нет новых уведомлений
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
