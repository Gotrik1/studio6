"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  sponsorshipScout,
  type SponsorshipScoutOutput,
} from "@/shared/api/genkit/flows/sponsorship-scout-flow";
import { Textarea } from "@/shared/ui/textarea";
import { Loader2, Sparkles, Send, UserSearch } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/shared/ui/skeleton";
import type { TeamSchema as SponsorableTeam } from "@/shared/api/genkit/flows/sponsorship-scout-flow";

export function SponsorScout() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    "Мы - бренд энергетических напитков, наша целевая аудитория - молодежь 16-24 лет, интересующаяся динамичными видами спорта.",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SponsorshipScoutOutput | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const scoutResult = await sponsorshipScout(prompt);
      setResult(scoutResult);
      if (scoutResult.recommendations.length === 0) {
        toast({
          title: "Ничего не найдено",
          description: "Попробуйте изменить ваш запрос.",
        });
      }
    } catch (e) {
      console.error(e);
      setError("Не удалось найти команды. Попробуйте изменить ваш запрос.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = (teamName: string) => {
    toast({
      title: "Запрос отправлен!",
      description: `Ваш запрос на сотрудничество был отправлен команде ${teamName}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserSearch /> AI-Скаут Команд
          </CardTitle>
          <CardDescription>
            Опишите ваши маркетинговые цели, и наш AI подберет команды, которые
            наилучшим образом соответствуют вашему бренду.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Например: 'Мы - производитель спортивного питания, ищем футбольные команды с большой аудиторией...'"
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
            {isLoading ? "Идет поиск..." : "Найти команды"}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}

        {result && result.recommendations.length > 0 && (
          <div className="space-y-6 animate-in fade-in-50">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Обоснование выбора от AI</AlertTitle>
              <AlertDescription>{result.reasoning}</AlertDescription>
            </Alert>
            {result.recommendations.map((team: SponsorableTeam) => (
              <Card key={team.slug}>
                <CardHeader className="flex-row gap-4 justify-between items-start">
                  <div className="flex gap-4">
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={56}
                      height={56}
                      className="rounded-lg border"
                      data-ai-hint={team.logoHint}
                    />
                    <div>
                      <CardTitle className="text-lg hover:underline">
                        <Link href={`/teams/${team.slug}`}>{team.name}</Link>
                      </CardTitle>
                      <CardDescription>{team.pitch}</CardDescription>
                    </div>
                  </div>
                  <Button onClick={() => handleContact(team.name)} size="sm">
                    <Send className="mr-2 h-4 w-4" />
                    Связаться
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
      {!isLoading && result && result.recommendations.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          <p>Подходящих команд не найдено. Попробуйте уточнить ваш запрос.</p>
        </div>
      )}
    </div>
  );
}
