'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import type { gallery } from "@/shared/lib/mock-data/profiles";
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { MediaUploadDialog } from '@/widgets/media-upload-dialog';

type GalleryItem = (typeof gallery)[0];

interface GalleryTabProps {
    gallery: GalleryItem[];
    isCurrentUser: boolean;
}

export function GalleryTab({ gallery: initialGallery, isCurrentUser }: GalleryTabProps) {
    const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleAddMedia = (newItem: GalleryItem) => {
        setGallery(prev => [newItem, ...prev]);
    };

    const handleDeleteMedia = (srcToDelete: string) => {
        setGallery(prev => prev.filter(item => item.src !== srcToDelete));
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Галерея</CardTitle>
                        <CardDescription>{isCurrentUser ? "Ваши фото и видео с матчей." : "Фото и видео с матчей."}</CardDescription>
                    </div>
                     {isCurrentUser && (
                        <Button onClick={() => setIsUploadOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Загрузить медиа
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {gallery.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {gallery.map((item, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-lg border">
                                    <Image 
                                        src={item.src} 
                                        alt={item.alt} 
                                        width={600} 
                                        height={400} 
                                        className="aspect-video h-full w-full object-cover transition-transform hover:scale-105"
                                        data-ai-hint={item.dataAiHint}
                                    />
                                    {isCurrentUser && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteMedia(item.src)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                            <p className="text-sm text-muted-foreground">В вашей галерее пока пусто.</p>
                            {isCurrentUser && (
                                <Button variant="link" onClick={() => setIsUploadOpen(true)}>Загрузите свой первый момент</Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            <MediaUploadDialog
                isOpen={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                onAddMedia={handleAddMedia}
            />
        </>
    );
}
