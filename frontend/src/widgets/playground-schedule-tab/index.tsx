"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { addDays, format, getHours, getMinutes, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import type { LfgLobby } from "@/entities/lfg/model/types";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/ui/tooltip";
import { Skeleton } from "@/shared/ui/skeleton";

interface PlaygroundScheduleTabProps {
  schedule: LfgLobby[];
  onPlanClick: (day: Date, hour: number) => void;
  isLoading: boolean;
}

const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM
const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

export function PlaygroundScheduleTab({
  schedule,
  onPlanClick,
  isLoading,
}: PlaygroundScheduleTabProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[60vh] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Расписание площадки на неделю</CardTitle>
        <CardDescription>
          Нажмите на свободную ячейку, чтобы запланировать игру.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full h-[60vh]">
          <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-px bg-border">
            {/* Header Row */}
            <div className="sticky top-0 z-10 p-2 bg-card text-center font-semibold">
              Время
            </div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="sticky top-0 z-10 p-2 bg-card text-center font-semibold text-xs sm:text-sm"
              >
                <p className="capitalize">{format(day, "E", { locale: ru })}</p>
                <p className="text-muted-foreground">{format(day, "dd.MM")}</p>
              </div>
            ))}

            {/* Time Slots */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-1 grid-rows-2 col-start-1 bg-card"
              >
                <div className="row-span-2 flex items-center justify-center border-t border-border">
                  <span className="text-xs text-muted-foreground">{`${hour}:00`}</span>
                </div>
              </div>
            ))}

            {/* Main Grid for bookings and empty cells */}
            <div className="col-start-2 col-span-7 row-start-2 row-span-[30] grid grid-cols-7 grid-rows-30 gap-px">
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className="relative col-span-1 grid grid-rows-30"
                >
                  {hours.flatMap((hour) =>
                    [0, 30].map((minute) => (
                      <div
                        key={`${hour}-${minute}`}
                        className="row-span-1 border-t border-l border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => onPlanClick(day, hour)}
                      ></div>
                    )),
                  )}
                  {schedule
                    .filter((booking) => isSameDay(booking.startTime, day))
                    .map((booking) => {
                      const startHour = getHours(booking.startTime);
                      const startMinute = getMinutes(booking.startTime);
                      const endHour = getHours(booking.endTime);
                      const endMinute = getMinutes(booking.endTime);

                      const startRow =
                        (startHour - 8) * 2 + startMinute / 30 + 1;
                      const endRow = (endHour - 8) * 2 + endMinute / 30 + 1;

                      return (
                        <TooltipProvider key={booking.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="absolute col-span-1 bg-primary/20 border-l-4 border-primary p-2 rounded-r-md overflow-hidden cursor-pointer"
                                style={{
                                  gridRowStart: startRow,
                                  gridRowEnd: endRow,
                                }}
                              >
                                <p className="text-xs font-bold text-primary truncate">
                                  {booking.creator.name}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={booking.creator.avatar || ""}
                                  />
                                  <AvatarFallback>
                                    {booking.creator.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <p>{booking.creator.name}</p>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {format(booking.startTime, "HH:mm")} -{" "}
                                {format(booking.endTime, "HH:mm")}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {booking.comment}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
