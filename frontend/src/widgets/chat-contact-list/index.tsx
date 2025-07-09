"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import { getChats } from "@/entities/chat/api/chats";
import { Skeleton } from "@/shared/ui/skeleton";
import { Users } from "lucide-react";
import type { ChatContact } from "@/entities/chat/model/types";

const getAvatarFallback = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

interface ChatContactListProps {
  selectedChatId: string | null;
  onSelectChat: (contact: ChatContact) => void;
}

export function ChatContactList({
  selectedChatId,
  onSelectChat,
}: ChatContactListProps) {
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  const fetchContacts = useCallback(async () => {
    setIsLoadingContacts(true);
    try {
      const fetchedContacts = await getChats();
      setContacts(fetchedContacts);
      if (fetchedContacts.length > 0 && !selectedChatId) {
        onSelectChat(fetchedContacts[0]);
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setIsLoadingContacts(false);
    }
  }, [onSelectChat, selectedChatId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Сообщения</CardTitle>
        <CardDescription>Ваши личные и командные чаты.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {isLoadingContacts ? (
              <div className="p-3 space-y-1">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  className={cn(
                    "flex items-center gap-3 p-3 w-full text-left transition-colors hover:bg-muted",
                    selectedChatId === contact.id && "bg-muted",
                  )}
                  onClick={() => onSelectChat(contact)}
                >
                  <Avatar className="relative">
                    <AvatarImage
                      src={contact.avatar}
                      data-ai-hint={contact.avatarHint}
                    />
                    <AvatarFallback>
                      {contact.type === "team" ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        getAvatarFallback(contact.name)
                      )}
                    </AvatarFallback>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
                    )}
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
