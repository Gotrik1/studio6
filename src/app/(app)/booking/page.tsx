import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Map, SlidersHorizontal, PlusCircle, Star, Sun, Trash2, RefreshCcw, MapPin, ShowerHead, Shirt } from "lucide-react";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import { venuesList, myBookings } from "@/lib/mock-data";

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Подтверждено": return "default";
        case "Завершено": return "outline";
        case "Отменено": return "destructive";
        default: return "secondary";
    }
};

const getFeatureIcon = (feature: string) => {
    switch (feature) {
        case 'Душевые': return <ShowerHead className="h-4 w-4" />;
        case 'Раздевалки': return <Shirt className="h-4 w-4" />;
        case 'Освещение': return <Sun className="h-4 w-4" />;
        case 'Прокат инвентаря': return <Shirt className="h-4 w-4" />; // Placeholder icon
        default: return null;
    }
}

export default function BookingPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Бронирование площадок</h1>
                    <p className="text-muted-foreground">Найдите и забронируйте идеальное место для вашей следующей игры.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Предложить новую площадку
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Поиск по названию, адресу или типу..." className="w-full pl-10" />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="w-full md:w-auto">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Фильтры
                            </Button>
                            <Button variant="outline" className="w-full md:w-auto">
                                <Map className="mr-2 h-4 w-4" />
                                Показать на карте
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* My Bookings Section */}
            <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold">Мои бронирования</h2>
                {myBookings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {myBookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{booking.venueName}</CardTitle>
                                    <CardDescription>{booking.date} в {booking.time}</CardDescription>
                                </CardHeader>
                                <CardFooter className="flex justify-between">
                                    <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                                    <div className="flex gap-2">
                                        {booking.status === "Отменено" ? (
                                             <Button variant="ghost" size="icon" title="Удалить из истории"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                                        ) : (
                                             <Button variant="outline" size="sm"><RefreshCcw className="mr-2 h-4 w-4"/>Повторить</Button>
                                        )}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                     <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                        <p className="text-lg font-semibold">У вас пока нет бронирований</p>
                        <p className="mt-1 text-muted-foreground">Найдите площадку ниже и запланируйте свою первую игру!</p>
                    </div>
                )}
            </div>
            
            <Separator />
            
            {/* Available Venues Section */}
             <div className="space-y-4">
                 <h2 className="font-headline text-2xl font-bold">Доступные площадки</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {venuesList.map((venue) => (
                        <Card key={venue.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
                            <div className="relative">
                                <Image
                                    src={venue.image}
                                    alt={venue.name}
                                    width={600}
                                    height={400}
                                    className="aspect-video w-full object-cover"
                                    data-ai-hint={venue.imageHint}
                                />
                                <Badge variant="secondary" className="absolute right-2 top-2">{venue.price}</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle>{venue.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{venue.address}</CardDescription>
                            </CardHeader>
                             <CardContent className="flex-1 space-y-4">
                               <div className="flex items-center justify-between text-sm text-muted-foreground">
                                   <Badge variant="outline">{venue.surfaceType}</Badge>
                                   <div className="flex items-center gap-1 font-semibold text-amber-500">
                                       <Star className="h-4 w-4" />
                                       <span>{venue.rating}</span>
                                   </div>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                    {venue.features.map(feature => (
                                        <div key={feature} className="flex items-center gap-1.5 rounded-full border bg-muted/50 px-2 py-0.5 text-xs">
                                           {getFeatureIcon(feature)}
                                           <span>{feature}</span>
                                        </div>
                                    ))}
                               </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Забронировать</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
