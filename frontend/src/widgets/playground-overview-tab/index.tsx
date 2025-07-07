

'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useToast } from '@/shared/hooks/use-toast';
import { Home, Loader2, User, Star } from 'lucide-react';
import { KingOfTheCourtWidget } from '@/widgets/playground-home-team';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { setHomePlaygroundAction } from './actions';
import { useTransition } from 'react';
import type { Playground } from '@/entities/playground/model/types';
import { Badge } from '@/shared/ui/badge';


interface PlaygroundOverviewTabProps {
  playground: Playground;
}

export function PlaygroundOverviewTab({ playground }: PlaygroundOverviewTabProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSetHome = () => {
    startTransition(async () => {
      const result = await setHomePlaygroundAction(playground.id);
      if (result.success) {
        toast({
          title: 'Домашняя площадка установлена!',
          description: `Площадка "${playground.name}" теперь ваша домашняя.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <KingOfTheCourtWidget homeTeamData={playground.kingOfTheCourt || null} isLoading={false} />
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Покрытие:</span>
              <span className="font-semibold">{playground.surface}</span>
            </div>
            <div className="flex justify-between">
              <span>Рейтинг:</span>
              <span className="font-semibold flex items-center gap-1">
                {playground.rating}/5.0 <Star className="h-4 w-4 text-amber-500" />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Чекинов:</span>
              <span className="font-semibold">{playground.checkIns}</span>
            </div>
            <div>
              <p>Особенности:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {playground.features.map((f) => (
                  <Badge key={f}>{f}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Создатель</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={playground.creator.avatar || ''} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold">{playground.creator.name}</p>
          </CardContent>
        </Card>
        <div className="space-y-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" /> Сделать домашней
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы собираетесь отметить эту площадку как домашнюю для
                  вашей команды. Помните, что это общественное место. В
                  случае препятствования играм других команд (физически,
                  угрозами или иным способом), ваша команда и все ее участники
                  будут дисквалифицированы на срок от 1 года до пожизненного.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleSetHome} disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Подтвердить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
