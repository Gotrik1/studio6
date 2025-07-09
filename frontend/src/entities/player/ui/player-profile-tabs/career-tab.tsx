"use client";

import { Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { CareerHistoryItem } from "@/entities/user/model/types";

interface CareerTabProps {
  careerHistory: CareerHistoryItem[];
  isCurrentUser: boolean;
}

export function CareerTab({ careerHistory, isCurrentUser }: CareerTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>История карьеры</CardTitle>
        <CardDescription>
          {isCurrentUser
            ? "Ваш путь от новичка до капитана."
            : "Путь игрока от новичка до капитана."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {careerHistory.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold">
                {item.teamName}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({item.period})
                </span>
              </h4>
              <p className="text-sm font-medium">Роль: {item.role}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {item.review}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
