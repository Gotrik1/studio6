'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import Image from "next/image";
import type { MatchDetails } from "@/entities/match/model/types";
import { Video } from "lucide-react";

interface MediaTabProps {
    media: MatchDetails['media'];
}

export function MediaTab({ media }: MediaTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Медиагалерея</CardTitle>
                <CardDescription>Лучшие моменты матча в фото и видео.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {media.map((item, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg border">
                            <Image
                                src={item.src}
                                alt={`Media ${index + 1}`}
                                width={600}
                                height={400}
                                className="aspect-video h-full w-full object-cover transition-transform group-hover:scale-105"
                                data-ai-hint={item.hint}
                            />
                            {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <Video className="h-10 w-10 text-white"/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
