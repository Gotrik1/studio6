"use client";

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
  type OnboardingOutput,
  type OnboardingSuggestion,
} from "@/shared/api/genkit/flows/onboarding-assistant-flow";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: { [key: string]: LucideIcon } = LucideIcons as any;

const OnboardingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-10 w-full" />
    <div className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
);

interface WelcomePageProps {
  initialSuggestions: OnboardingOutput | null;
}

export function WelcomePage({ initialSuggestions }: WelcomePageProps) {
  if (!initialSuggestions) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-full max-w-2xl p-8">
          <OnboardingSkeleton />
        </Card>
      </div>
    );
  }

  const { greeting, mainSuggestion, suggestions } = initialSuggestions;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-2xl animate-in fade-in-50">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{greeting}</CardTitle>
          <CardDescription className="text-lg">
            {mainSuggestion}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold">Ваши первые квесты:</h3>
          {suggestions.map((quest: OnboardingSuggestion) => {
            const Icon = iconMap[quest.icon] || LucideIcons.HelpCircle;
            return (
              <Link href={quest.href} key={quest.title} className="block">
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Icon className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">{quest.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {quest.description}
                      </p>
                    </div>
                    {quest.reward && (
                      <div className="text-sm font-bold text-green-500">
                        {quest.reward}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard">
              Перейти на главную <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
