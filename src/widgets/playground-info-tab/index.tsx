
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import type { Playground } from "@/shared/lib/mock-data/playgrounds";
import { MapPin, Shield, CheckCircle2 } from "lucide-react";
import { AiPlaygroundAnalysis } from '@/widgets/ai-playground-analysis';

interface PlaygroundInfoTabProps {
    playground: Playground;
}

export function PlaygroundInfoTab({ playground }: PlaygroundInfoTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <AiPlaygroundAnalysis playground={playground} />
            </div>
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Факты</CardTitle>
                        <CardDescription>Ключевая информация о площадке.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">{playground.address}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="font-medium">Покрытие</p>
                                <p className="text-sm text-muted-foreground">{playground.surface}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                             <div>
                                <p className="font-medium">Удобства</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {playground.features.map(feature => (
                                        <Badge key={feature} variant="secondary">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
