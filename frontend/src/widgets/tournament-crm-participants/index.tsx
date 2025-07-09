"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Check, X, Mail, Trash2, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import Link from "next/link";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  getTournamentApplications,
  getTournamentParticipants,
  approveApplication,
  rejectApplication,
  removeParticipant,
  type Application,
  type Participant,
} from "@/entities/tournament/api/participants";
import { Badge } from "@/shared/ui/badge";

interface CrmTournamentParticipantsProps {
  tournamentId: string;
}

export function CrmTournamentParticipantsWidget({
  tournamentId,
}: CrmTournamentParticipantsProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);
  const [isActionPending, startTransition] = useTransition();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [appsResult, participantsResult] = await Promise.all([
        getTournamentApplications(tournamentId),
        getTournamentParticipants(tournamentId),
      ]);

      if (appsResult.success && appsResult.data) {
        setApplications(appsResult.data);
      } else if (!appsResult.success) {
        throw new Error(appsResult.error);
      }

      if (participantsResult.success && participantsResult.data) {
        setParticipants(participantsResult.data);
      } else if (!participantsResult.success) {
        throw new Error(participantsResult.error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Не удалось загрузить данные участников";
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: `Не удалось загрузить участников: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId, toast]);

  useEffect(() => {
    if (tournamentId) {
      fetchData();
    }
  }, [tournamentId, fetchData]);

  const toggleCollapsible = (id: string) => {
    setOpenCollapsibles((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleAction = async (
    action: () => Promise<{ success: boolean; error?: string }>,
    successMsg: string,
    errorMsg: string,
  ) => {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast({ title: successMsg });
        await fetchData();
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.error || errorMsg,
        });
      }
    });
  };

  const handleAccept = (app: Application) => {
    handleAction(
      () => approveApplication(tournamentId, app.id),
      "Заявка принята",
      `Не удалось принять заявку от ${app.team.name}.`,
    );
  };

  const handleDecline = (app: Application) => {
    handleAction(
      () => rejectApplication(tournamentId, app.id),
      "Заявка отклонена",
      `Не удалось отклонить заявку от ${app.team.name}.`,
    );
  };

  const handleRemove = (team: Participant) => {
    handleAction(
      () => removeParticipant(tournamentId, team.id),
      "Участник удален",
      `Не удалось удалить команду ${team.name}.`,
    );
  };

  if (isLoading) {
    return (
      <Tabs defaultValue="applications">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications">Заявки на участие</TabsTrigger>
          <TabsTrigger value="confirmed">Подтвержденные участники</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="mt-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs defaultValue="applications">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="applications">
          Заявки на участие{" "}
          <Badge className="ml-2">{applications.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="confirmed">
          Подтвержденные участники{" "}
          <Badge className="ml-2">{participants.length}</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="applications" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Заявки</CardTitle>
            <CardDescription>
              Здесь отображаются команды, которые подали заявку на участие в
              турнире.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Команда/Игрок</TableHead>
                  <TableHead>Капитан</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        {app.team.name}
                      </TableCell>
                      <TableCell>{app.team.captain?.name || "N/A"}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDecline(app)}
                          disabled={isActionPending}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAccept(app)}
                          disabled={isActionPending}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      Новых заявок нет
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="confirmed" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Участники</CardTitle>
            <CardDescription>
              Список команд, участие которых было подтверждено. Нажмите на
              строку, чтобы увидеть состав.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10px] p-2"></TableHead>
                    <TableHead>Команда</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Капитан
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Состав
                    </TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.length > 0 ? (
                    participants.map((p) => (
                      <Collapsible
                        asChild
                        key={p.id}
                        open={openCollapsibles.includes(p.id)}
                        onOpenChange={() => toggleCollapsible(p.id)}
                      >
                        <>
                          <TableRow className="cursor-pointer hover:bg-muted/50 data-[state=open]:bg-muted/50">
                            <TableCell className="p-2">
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                            <TableCell className="font-medium">
                              {p.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {p.captain?.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {p.members.length} чел.
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast({ title: "Сообщение отправлено" });
                                  }}
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(p);
                                  }}
                                  disabled={isActionPending}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <tr className="bg-muted/30">
                              <TableCell colSpan={5} className="p-0">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-2 text-sm">
                                    Состав команды:
                                  </h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Игрок</TableHead>
                                        <TableHead>Роль</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {p.members.map((player) => (
                                        <TableRow key={player.id}>
                                          <TableCell className="font-medium flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage
                                                src={player.avatar || ""}
                                              />
                                              <AvatarFallback>
                                                {player.name.charAt(0)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <Link
                                              href={`/profiles/player/${player.id}`}
                                              className="hover:underline"
                                            >
                                              {player.name}
                                            </Link>
                                          </TableCell>
                                          <TableCell>{player.role}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </tr>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        Подтвержденных участников нет
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
