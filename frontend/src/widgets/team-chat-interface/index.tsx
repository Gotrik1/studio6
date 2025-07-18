"use client";

import { useState, useEffect, useCallback } from "react";
import { getChats } from "@/entities/chat/api/chats";
import type { ChatContact } from "@/entities/chat/model/types";
import { ChatWindow } from "@/widgets/chat-window";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { AlertCircle } from "lucide-react";

export function TeamChatInterface({ teamId }: { teamId: string }) {
  const [teamChat, setTeamChat] = useState<ChatContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allChats = await getChats();
      const foundChat = allChats.find(
        (c) => c.type === "team" && c.teamId === teamId,
      );
      if (foundChat) {
        setTeamChat(foundChat);
      } else {
        // In a real app, you might have a way to create a team chat if it doesn't exist
        setError("Чат для этой команды не найден.");
      }
    } catch (e) {
      console.error(e);
      setError("Не удалось загрузить данные чата.");
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchTeamChat();
    }
  }, [teamId, fetchTeamChat]);

  if (isLoading) {
    return <Skeleton className="h-[calc(100vh-28rem)] w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!teamChat) {
    return <Alert>Чат для этой команды пока не доступен.</Alert>;
  }

  return <ChatWindow chat={teamChat} />;
}
