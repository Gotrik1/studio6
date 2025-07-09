"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useMemo } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type {
  BracketMatch,
  BracketRound,
} from "@/entities/tournament/model/types";

// This type is now stricter, ensuring both teams exist for a playable match.
type PlayableMatch = BracketMatch & {
  id: string;
  team1: NonNullable<BracketMatch["team1"]>;
  team2: NonNullable<BracketMatch["team2"]>;
  date: string;
  time: string;
  href: string;
  score?: string;
};

interface ScheduleTabProps {
  rounds: BracketRound[];
}

type GroupedMatches = Record<string, PlayableMatch[]>;

export function ScheduleTab({ rounds }: ScheduleTabProps) {
  const allMatches = useMemo(
    () =>
      rounds
        .flatMap((round: BracketRound) => round.matches)
        .filter(
          (match: BracketMatch): match is PlayableMatch =>
            !!match &&
            "team1" in match &&
            !!match.team1 &&
            "team2" in match &&
            !!match.team2 &&
            "date" in match &&
            !!match.date &&
            "time" in match &&
            !!match.time &&
            "id" in match &&
            !!match.id &&
            "href" in match &&
            !!match.href,
        ),
    [rounds],
  );

  const groupedMatches: GroupedMatches = useMemo(
    () =>
      allMatches.reduce((acc: GroupedMatches, match: PlayableMatch) => {
        const dateStr = format(new Date(match.date), "yyyy-MM-dd");
        if (!acc[dateStr]) {
          acc[dateStr] = [];
        }
        acc[dateStr].push(match);
        return acc;
      }, {} as GroupedMatches),
    [allMatches],
  );

  const sortedDates = Object.keys(groupedMatches).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  if (sortedDates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Расписание матчей</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Расписание для этого турнира еще не опубликовано.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Расписание матчей</CardTitle>
        <CardDescription>Календарь всех игр турнира.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={sortedDates.map((d) => d)}
          className="w-full"
        >
          {sortedDates.map((date: string) => (
            <AccordionItem value={date} key={date}>
              <AccordionTrigger className="text-lg font-semibold">
                {format(new Date(date), "EEEE, d MMMM yyyy", { locale: ru })}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-4 border-l">
                  {groupedMatches[date]
                    .sort((a: PlayableMatch, b: PlayableMatch) =>
                      (a.time || "00:00").localeCompare(b.time || "00:00"),
                    )
                    .map((match: PlayableMatch) => (
                      <Link
                        href={match.href || "#"}
                        key={match.id as string}
                        className="block"
                      >
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="flex flex-col items-center">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm">
                              {match.time}
                            </span>
                          </div>
                          <div className="flex-1 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2 font-medium">
                              <span className="hidden sm:inline">
                                {match.team1?.name}
                              </span>
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={match.team1?.logo || ""}
                                  data-ai-hint={match.team1?.dataAiHint || ""}
                                />
                                <AvatarFallback>
                                  {match.team1?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-bold">{match.score}</p>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={match.team2?.logo || ""}
                                  data-ai-hint={match.team2?.dataAiHint || ""}
                                />
                                <AvatarFallback>
                                  {match.team2?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="hidden sm:inline">
                                {match.team2?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
