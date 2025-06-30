
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Search, MapPin, DollarSign, Star, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import Image from 'next/image';
import { venuesList, type Venue } from '@/shared/lib/mock-data/booking';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/select';
import { sportsList } from '@/shared/lib/mock-data/sports';

const venueFeatures = ['Освещение', 'Раздевалки'];

export function BookingPage() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedSport, setSelectedSport] = useState<string>('all');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    
    const filteredVenues = useMemo(() => {
        return venuesList.filter(venue => {
            const matchesQuery = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || venue.address.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesSport = selectedSport === 'all' || venue.name.toLowerCase().includes(selectedSport.toLowerCase());
            
            const matchesFeatures = selectedFeatures.every(feature => venue.features.includes(feature));

            // Date filtering is complex without a backend, so we'll omit it for this client-side demo.
            
            return matchesQuery && matchesSport && matchesFeatures;
        });
    }, [searchQuery, selectedSport, selectedFeatures]);

    const handleFeatureChange = (feature: string) => {
        setSelectedFeatures(prev => 
            prev.includes(feature) 
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    const handleBook = (venueName: string) => {
        toast({
            title: 'Забронировано!',
            description: `Площадка "${venueName}" успешно забронирована на выбранное вами время.`,
        });
    };
    
    const sportsOptions = sportsList
        .filter(s => s.category === 'Командный') // Filter for relevant sports
        .map(s => s.name);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Поиск и бронирование площадок</h1>
                <p className="text-muted-foreground">
                    Используйте фильтры, чтобы найти идеальное место для вашей следующей игры.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Filter/> Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="search-query">Поиск по названию</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="search-query" 
                                placeholder="Например, Центральный"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="sport-select">Вид спорта</Label>
                         <Select value={selectedSport} onValueChange={setSelectedSport}>
                            <SelectTrigger id="sport-select">
                                <SelectValue placeholder="Все виды спорта"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все виды спорта</SelectItem>
                                {sportsOptions.map(sport => (
                                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Дата</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP", { locale: ru }) : <span>Выберите дату</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-2">
                        <Label>Особенности</Label>
                        <div className="flex items-center space-x-4 pt-2">
                            {venueFeatures.map(feature => (
                                <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={feature} 
                                        checked={selectedFeatures.includes(feature)}
                                        onCheckedChange={() => handleFeatureChange(feature)}
                                    />
                                    <Label htmlFor={feature} className="font-normal">{feature}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
                    <Card key={venue.id} className="flex flex-col">
                        <div className="relative h-48 w-full">
                            <Image src={venue.image} alt={venue.name} fill className="object-cover rounded-t-lg" data-ai-hint={venue.imageHint} />
                        </div>
                        <CardHeader>
                            <CardTitle>{venue.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1.5 pt-1">
                                <MapPin className="h-4 w-4" /> {venue.address}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" />{venue.price}</span>
                                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400" />{venue.rating}/5.0</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                             <Button className="w-full" onClick={() => handleBook(venue.name)}>
                                Забронировать
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             {filteredVenues.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                    <p>Подходящих площадок не найдено. Попробуйте изменить фильтры.</p>
                </div>
            )}
        </div>
    );
}
