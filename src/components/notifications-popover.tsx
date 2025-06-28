'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { notifications as initialNotifications } from '@/lib/mock-data/notifications';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };
  
  const handleMarkAllAsRead = () => {
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  }

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
             <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleMarkAllAsRead}>
                Отметить все как прочитанные
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <DropdownMenuItem key={notification.id} asChild className="cursor-pointer p-0" onSelect={(e) => {e.preventDefault(); handleMarkAsRead(notification.id)}}>
                <Link href={notification.href} className={cn("flex items-start gap-3 p-2", !notification.isRead && "bg-accent/50")}>
                    <div className="flex items-center h-full pt-1">
                        {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <notification.icon className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                    <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium leading-tight">{notification.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    </div>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
                Нет новых уведомлений
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="#" className="flex cursor-pointer items-center justify-center p-2 text-sm text-muted-foreground">
              Показать все
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
