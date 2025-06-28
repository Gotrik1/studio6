import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { promotionsList, sponsorsList } from "@/lib/mock-data";
import { Clock, Gift, Megaphone, PlusCircle, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function PromotionsPage() {

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Активна": return "default";
            case "Скоро": return "secondary";
            case "Завершена": return "outline";
            default: return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Промо-акции</h1>
                    <p className="text-muted-foreground">
                        Участвуйте в конкурсах и акциях от наших партнеров и выигрывайте призы.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Создать акцию
                </Button>
            </div>

            <Tabs defaultValue="current">
                 <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-2">
                    <TabsTrigger value="current">Текущие акции</TabsTrigger>
                    <TabsTrigger value="past">Прошедшие</TabsTrigger>
                </TabsList>
                <TabsContent value="current">
                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 mt-4">
                        {promotionsList.filter(p => p.status !== 'Завершена').map((promo) => (
                            <Card key={promo.name} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
                                <CardHeader className="relative h-40 w-full p-0">
                                     <Image 
                                        src={promo.image} 
                                        alt={promo.name} 
                                        fill 
                                        className="object-cover"
                                        data-ai-hint={promo.imageHint}
                                    />
                                    <Badge variant={getStatusVariant(promo.status)} className="absolute right-2 top-2">{promo.status}</Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-6">
                                    <p className="text-sm font-semibold text-primary">{promo.sponsor}</p>
                                    <CardTitle className="mt-1 font-headline">{promo.name}</CardTitle>
                                    <CardDescription className="mt-2 line-clamp-2">{promo.description}</CardDescription>
                                     <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                                        <div className="flex items-center"><Gift className="mr-1.5 h-4 w-4" />{promo.prize}</div>
                                        <div className="flex items-center"><Users className="mr-1.5 h-4 w-4" />{promo.participants}</div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/50 p-4">
                                    <Button className="w-full">Участвовать</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="past">
                     <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                        <p className="text-lg font-semibold">Архив акций пуст</p>
                        <p className="mt-1 text-muted-foreground">Здесь будут отображаться завершенные акции и их победители.</p>
                    </div>
                </TabsContent>
            </Tabs>
            
            <Card>
                <CardHeader>
                    <CardTitle>Наши партнеры</CardTitle>
                    <CardDescription>Компании, которые поддерживают наше сообщество и проводят акции.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-8">
                    {sponsorsList.map(sponsor => (
                        <div key={sponsor.name} className="flex flex-col items-center gap-2">
                             <Avatar className="h-20 w-20 border-2">
                                <AvatarImage src={sponsor.logo} alt={sponsor.name} className="object-contain p-2" data-ai-hint={sponsor.logoHint} />
                                <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <p className="text-sm font-medium">{sponsor.name}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
}
