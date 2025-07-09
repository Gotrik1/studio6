"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { MatchDetails } from "@/entities/match/model/types";
import { Calendar, Clock, MapPin, Shield } from "lucide-react";

interface OverviewTabProps {
  match: MatchDetails;
}

export function OverviewTab({ match }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Информация о матче</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
            {match.date}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
            {match.time} (МСК)
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
            {match.location}
          </div>
          <div className="flex items-center">
            <Shield className="mr-2 h-4 w-4 text-muted-foreground" /> Судья:{" "}
            {match.referee.name}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Ключевые события</CardTitle>
          <CardDescription>Хронология матча.</CardDescription>
        </CardHeader>
        <CardContent>
          {match.events && match.events.length > 0 ? (
            <div className="space-y-4">
              {match.events.map((event, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="font-mono text-sm">{event.time}</div>
                  <div className="h-full w-px bg-border"></div>
                  <div>
                    <p className="font-semibold">{event.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.player} ({event.team})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ключевые события матча не записаны.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
