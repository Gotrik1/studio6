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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import Link from "next/link";
import { Send, Star } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { Textarea } from "@/shared/ui/textarea";
import {
  findCoaches,
  type FindCoachesOutput,
} from "@/shared/api/genkit/flows/find-coaches-flow";
import { Loader2, Sparkles, BrainCircuit } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Skeleton } from "@/shared/ui/skeleton";
import { Separator } from "@/shared/ui/separator";

type Coach = FindCoachesOutput["recommendations"][0]["coach"];

function AiRecommendedCoachCard({
  coach,
  reasoning,
}: {
  coach: Coach;
  reasoning: string;
}) {
  const { toast } = useToast();
  const handleContact = () => {
    toast({
      title: "Запрос отправлен!",
      description: `Ваш запрос на тренировку отправлен тренеру ${coach.name}.`,
    });
  };

  return (
    <Card className="bg-muted/30 shadow-none">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage
            src={coach.avatar || undefined}
            alt={coach.name}
            data-ai-hint={coach.avatarHint}
          />
          <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            <Link href={coach.profileUrl} className="hover:underline">
              {coach.name}
            </Link>
          </CardTitle>
          <CardDescription>{coach.specialization}</CardDescription>
          <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-bold">{coach.rating}</span>
            <span className="text-muted-foreground">({coach.price})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="border-primary/20 bg-primary/5">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle>Почему этот тренер подходит?</AlertTitle>
          <AlertDescription>{reasoning}</AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleContact}>
          <Send className="mr-2 h-4 w-4" /> Связаться
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CoachFinder() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    "Ищу тренера по Valorant для улучшения стрельбы и тактического мышления.",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<FindCoachesOutput | null>(null);

  const handleSearch = async () => {
    if (!prompt) {
      setError("Пожалуйста, опишите, какого тренера вы ищете.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiResult(null);

    try {
      const searchResult = await findCoaches(prompt);
      setAiResult(searchResult);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit /> AI-Подбор тренера
          </CardTitle>
          <CardDescription>
            Опишите свои цели, и наш AI подберет для вас наиболее подходящего
            наставника.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Например: 'Мне нужен тренер по футболу, чтобы улучшить технику дриблинга и удара...'"
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
            {isLoading ? "Идет поиск..." : "Подобрать тренера"}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        )}

        {aiResult && aiResult.recommendations.length > 0 && (
          <div className="space-y-4 animate-in fade-in-50">
            <h3 className="text-xl font-bold">Рекомендации от AI:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiResult.recommendations.map(({ coach, reasoning }) => (
                <AiRecommendedCoachCard
                  key={coach.id}
                  coach={coach}
                  reasoning={reasoning}
                />
              ))}
            </div>
            <Separator />
          </div>
        )}
      </div>
    </div>
  );
}
