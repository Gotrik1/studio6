
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, Check, Star, AlertTriangle, Crown } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import type { Team } from '@/entities/team/model/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';

export function PlaygroundCard({ playground, kingTeam, isLive }: { playground: Playground, kingTeam?: Team | null, isLive?: boolean }) {
    return (
        <Link href={`/playgrounds/${playground.id}`} className="block h-full">
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary">
                <div className="relative h-40 w-full">
                    <Image src={playground.coverImage} alt={playground.name} fill className="object-cover" data-ai-hint={playground.coverImageHint}/>
                    {isLive && (
                        <Badge variant="destructive" className="absolute top-2 left-2 animate-pulse">LIVE</Badge>
                    )}
                     {playground.status === 'pending_moderation' && (
                        <Badge variant="destructive" className="absolute top-2 right-2 bg-yellow-500/90 hover:bg-yellow-600 text-white">
                            <AlertTriangle className="h-3 w-3 mr-1"/>
                            На модерации
                        </Badge>
                    )}
                    {kingTeam && (
                        <div className="absolute bottom-2 right-2">
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 border-2 border-amber-400">
                                                <AvatarImage src={kingTeam.logo} alt={kingTeam.name} />
                                                <AvatarFallback>{kingTeam.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -top-2 -left-2 rotate-[-30deg]">
                                                <Crown className="h-4 w-4 text-amber-400 fill-amber-400" />
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Король площадки: {kingTeam.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                </div>
                <CardHeader>
                    <CardTitle>{playground.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                        <MapPin className="h-3 w-3" /> {playground.address}
                    </CardDescription>
                </CardHeader>
                 <CardContent className="flex-1">
                     <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{playground.type}</Badge>
                        <Badge variant="outline">{playground.surface}</Badge>
                    </div>
                 </CardContent>
                <CardFooter className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Check className="h-3 w-3"/>{playground.checkIns} отметок</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500"/>{playground.rating}/5.0</span>
                </CardFooter>
            </Card>
        </Link>
    );
}
