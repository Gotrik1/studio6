
'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { PlusCircle } from 'lucide-react';
import { mockPlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';
import { PlaygroundUploadDialog } from '@/widgets/playground-upload-dialog';

type GalleryItem = {
    src: string;
    alt: string;
    dataAiHint: string;
};

// Initial data from mock activity feed that has photos
const initialGallery: GalleryItem[] = mockPlaygroundActivity
    .filter(item => item.photo)
    .map(item => ({
        src: item.photo!,
        alt: item.comment,
        dataAiHint: item.photoHint || 'playground photo',
    }));


export function PlaygroundMediaTab() {
    const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleAddMedia = (newItem: GalleryItem) => {
        setGallery(prev => [newItem, ...prev]);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Галерея площадки</CardTitle>
                        <CardDescription>Фотографии, загруженные пользователями.</CardDescription>
                    </div>
                    <Button onClick={() => setIsUploadOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить фото
                    </Button>
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                            <p className="text-sm text-muted-foreground">В галерее этой площадки пока пусто.</p>
                            <Button variant="link" onClick={() => setIsUploadOpen(true)}>Загрузите первое фото</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <PlaygroundUploadDialog
                isOpen={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                onAddMedia={handleAddMedia}
            />
        </>
    );
}
