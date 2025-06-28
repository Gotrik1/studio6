'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { gallery } from "@/lib/mock-data/profiles";

type GalleryItem = (typeof gallery)[0];

interface GalleryTabProps {
    gallery: GalleryItem[];
    isCurrentUser: boolean;
}

export function GalleryTab({ gallery, isCurrentUser }: GalleryTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Галерея</CardTitle>
                <CardDescription>{isCurrentUser ? "Ваши фото и видео с матчей." : "Фото и видео с матчей."}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {gallery.map((item, index) => (
                        <div key={index} className="overflow-hidden rounded-lg border">
                            <Image 
                                src={item.src} 
                                alt={item.alt} 
                                width={600} 
                                height={400} 
                                className="aspect-video h-full w-full object-cover transition-transform hover:scale-105"
                                data-ai-hint={item.dataAiHint}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
