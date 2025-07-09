"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Bot, Loader2, Send, User } from "lucide-react";
import { askSupportChatbot } from "@/shared/api/genkit/flows/support-chatbot-flow";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import * as React from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
  isThinking?: boolean;
};

export function SupportChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Здравствуйте! Чем могу помочь?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: input };
    const thinkingMessage: Message = {
      sender: "ai",
      text: "Думаю...",
      isThinking: true,
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await askSupportChatbot(input);
      const aiMessage: Message = { sender: "ai", text: aiResponse.answer };
      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        sender: "ai",
        text: "Произошла ошибка. Пожалуйста, попробуйте позже.",
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[70vh]">
      <CardHeader>
        <CardTitle>AI-Помощник</CardTitle>
        <CardDescription>Задайте свой вопрос в чате.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  msg.sender === "user" ? "justify-end" : "",
                )}
              >
                {msg.sender === "ai" && (
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs rounded-lg px-4 py-2 text-sm shadow-sm",
                    msg.sender === "ai"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {msg.isThinking ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground flex-shrink-0">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Например, 'Как создать команду?'"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
