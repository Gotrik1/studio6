
'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, CheckCircle, Home } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { AiPlaygroundSummary } from '@/widgets/ai-playground-summary';
import { AiPlaygroundChallenge } from '@/widgets/ai-playground-challenge';
import { PlaygroundLeaderboard } from '@/widgets/playground-leaderboard';
import { AiPlaygroundLore } from '@/widgets/ai-playground-lore';
import { PlaygroundCheckInDialog } from '@/widgets/playground-check-in-dialog';
import type { PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';
import { useSession } from '@/shared/lib/session/client';
import { KingOfTheCourtWidget } from '@/widgets/playground-home-team';


export default function PlaygroundDetailsPage({ playground }: { playground: Playground }) {
    const { user } = useSession();
    const { toast } = useToast();
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);

    const handleCheckIn = (comment: string) => {
        if (!user) return;
        const newActivity: PlaygroundActivity = {
            id: `act-${Date.now()}`,
            user: { name: user.name, avatar: user.avatar },
            comment,
            timestamp: 'Только что',
        };
        // In a real app, this would be an API call
        console.log("New check-in:", newActivity);
        toast({
            title: "Вы отметились!",
            description: `Вы получили 10 PD за чекин на площадке "${playground.name}".`
        });
    };

    return (
        <>
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    <div className="relative h-64 w-full">
                        <Image src={playground.coverImage} alt={playground.name} fill className="object-cover" data-ai-hint={playground.coverImageHint}/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <Badge variant="secondary">{playground.type}</Badge>
                            <h1 className="font-headline text-4xl font-bold mt-1">{playground.name}</h1>
                            <p className="flex items-center gap-2 mt-1"><MapPin className="h-4 w-4" /> {playground.address}</p>
                        </div>
                    </div>
                </Card>

                 {playground.status === 'pending_moderation' && (
                    <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/50 text-yellow-600 [&>svg]:text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>На модерации</AlertTitle>
                        <AlertDescription>
                            Эта площадка ожидает проверки модератором. Она может быть удалена, если является дубликатом или нарушает правила.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <AiPlaygroundSummary playground={playground} />
                        <AiPlaygroundLore playground={playground} />
                         <PlaygroundLeaderboard />
                    </div>
                    <div className="space-y-6">
                        <Button className="w-full" size="lg" onClick={() => setIsCheckInOpen(true)}>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Отметиться (чекин)
                        </Button>
                        <KingOfTheCourtWidget playgroundId={playground.id} />
                        <AiPlaygroundChallenge playground={playground} />
                    </div>
                </div>
            </div>
            <PlaygroundCheckInDialog
                isOpen={isCheckInOpen}
                onOpenChange={setIsCheckInOpen}
                playgroundName={playground.name}
                onCheckIn={handleCheckIn}
            />
        </>
    );
}
