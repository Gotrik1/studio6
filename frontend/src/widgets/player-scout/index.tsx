"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  playerScout,
  type PlayerScoutOutput,
} from "@/shared/api/genkit/flows/player-scout-flow";
import { Textarea } from "@/shared/ui/textarea";
import { Loader2, Sparkles, Send, UserSearch } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Skeleton } from "@/shared/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import Link from "next/link";

type Recommendation = PlayerScoutOutput["recommendations"][number];

export function PlayerScout() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    "Ищем защитника для футбольной команды. Важна хорошая коммуникация и доступность по вечерам.",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlayerScoutOutput | null>(null);

  const handleSearch = async () => {
    if (!prompt) {
      setError("Пожалуйста, опишите, какого игрока вы ищете.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const searchResult = await playerScout(prompt);
      setResult(searchResult);
      if (searchResult.recommendations.length === 0) {
        toast({
          title: "Ничего не найдено",
          description: "Попробуйте изменить ваш запрос.",
        });
      }
    } catch (e) {
      console.error(e);
      setError("Не удалось выполнить поиск. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = (playerName: string) => {
    toast({
      title: "Приглашение отправлено!",
      description: `Игрок ${playerName} получил ваше приглашение в команду.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserSearch /> AI-Скаут Игроков
          </CardTitle>
          <CardDescription>
            Опишите идеального кандидата для вашей команды, и наш AI-скаут
            найдет лучших игроков на платформе.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="scout-prompt"
            placeholder="Например: 'Нужен агрессивный нападающий для футбольной команды, свободный для тренировок 3 раза в неделю...'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="min-h-[100px]"
          />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Идет поиск..." : "Найти игроков"}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 space-y-6">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}

        {result?.recommendations.map(
          ({ player, reasoning }: Recommendation) => (
            <Card key={player.id} className="animate-in fade-in-50">
              <CardHeader className="flex-row gap-4 justify-between items-start">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{player.name}</CardTitle>
                    <CardDescription>{player.role}</CardDescription>
                  </div>
                </div>
                <Button onClick={() => handleInvite(player.name)} size="sm">
                  <Send className="mr-2 h-4 w-4" />
                  Пригласить
                </Button>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Почему это хороший кандидат?</AlertTitle>
                  <AlertDescription>{reasoning}</AlertDescription>
                </Alert>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link href={player.profileUrl}>Смотреть полный профиль</Link>
                </Button>
              </CardContent>
            </Card>
          ),
        )}
      </div>
      {!isLoading && result && result.recommendations.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          <p>Подходящих игроков не найдено. Попробуйте уточнить ваш запрос.</p>
        </div>
      )}
    </div>
  );
}
