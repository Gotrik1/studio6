
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { sponsorshipScout, type SponsorshipScoutOutput } from '@/shared/api/genkit/flows/sponsorship-scout-flow';
import { Loader2, Sparkles, Send, Handshake, DollarSign, Megaphone, Users, UserSearch } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { promotionsList } from '@/shared/lib/mock-data/promotions';
import { sponsoredTeams } from '@/shared/lib/mock-data/sponsorship';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export function SponsorshipDashboard() {
    const { toast } = useToast();
    
    // AI Scout states
    const [scoutPrompt, setScoutPrompt] = useState('Хочу прорекламировать свой бренд энергетических напитков среди молодой аудитории, которая увлекается Valorant.');
    const [isScouting, setIsScouting] = useState(false);
    const [scoutError, setScoutError] = useState<string | null>(null);
    const [scoutResult, setScoutResult] = useState<SponsorshipScoutOutput | null>(null);
    
    const handleScout = async () => {
        setIsScouting(true);
        setScoutError(null);
        setScoutResult(null);
        try {
            const result = await sponsorshipScout(scoutPrompt);
            setScoutResult(result);
        } catch (e) {
            console.error("Scouting failed:", e);
            setScoutError("Не удалось найти команды. Попробуйте изменить запрос.");
        } finally {
            setIsScouting(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Панель управления спонсора</h1>
                <p className="text-muted-foreground">Анализируйте кампании, находите новые таланты и управляйте своими инвестициями.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Общие инвестиции" value="$75,000" icon={DollarSign} />
                <StatCard title="Спонсируемых команд" value="2" icon={Users} />
                <StatCard title="Активных кампаний" value="2" icon={Megaphone} />
                <StatCard title="Охват аудитории" value="2.5M" icon={Handshake} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><UserSearch /> AI-скаут команд</CardTitle>
                            <CardDescription>Опишите ваши маркетинговые цели, и AI подберет наиболее подходящие команды для спонсорства.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea 
                                placeholder="Например: 'Ищем команду по CS:GO 2 с активной аудиторией в Москве для рекламы нашего бренда периферии.'"
                                value={scoutPrompt}
                                onChange={(e) => setScoutPrompt(e.target.value)}
                                disabled={isScouting}
                                className="min-h-[100px]"
                            />
                            <Button onClick={handleScout} disabled={isScouting} className="w-full">
                                {isScouting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                Найти команды
                            </Button>
                        </CardContent>
                    </Card>

                    {isScouting && <Skeleton className="h-64 w-full" />}
                    {scoutError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{scoutError}</AlertDescription></Alert>}
                    {scoutResult && (
                        <Card className="animate-in fade-in-50">
                            <CardHeader>
                                <CardTitle>Рекомендованные команды</CardTitle>
                                <CardDescription>{scoutResult.reasoning}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {scoutResult.recommendations.map(team => (
                                    <Card key={team.slug} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <Image src={team.logo} alt={team.name} width={56} height={56} className="rounded-full border" data-ai-hint={team.logoHint} />
                                                <div>
                                                    <Link href={`/teams/${team.slug}`} className="font-bold hover:underline">{team.name}</Link>
                                                    <p className="text-sm text-muted-foreground">{team.game}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" onClick={() => toast({title: "Предложение отправлено!", description: `Команде ${team.name} отправлено ваше предложение.`})}><Send className="mr-2 h-4 w-4"/>Предложить</Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 italic pl-2 border-l-2">
                                            &quot;{team.pitch}&quot;
                                        </p>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Активные промо-кампании</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {promotionsList.slice(0, 2).map(promo => (
                                <div key={promo.id} className="flex items-center justify-between p-2 -mx-2 rounded-md hover:bg-muted">
                                    <div>
                                        <p className="font-semibold">{promo.title}</p>
                                        <p className="text-sm text-muted-foreground">Заканчивается: {format(new Date(promo.endDate), "d MMMM yyyy", { locale: ru })}</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild><Link href="/promotions">Управлять</Link></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Спонсируемые команды</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Команда</TableHead>
                                    <TableHead className="text-right">Действие</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sponsoredTeams.map(team => (
                                    <TableRow key={team.slug}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Image src={team.logo} alt={team.name} width={24} height={24} className="rounded-full" data-ai-hint={team.logoHint}/>
                                                <span className="font-medium">{team.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild><Link href={`/teams/${team.slug}`}>Профиль</Link></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
