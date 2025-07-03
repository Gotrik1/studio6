
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

const presets = [60, 90, 120, 180];

export function RestTimer() {
    const { toast } = useToast();
    const [duration, setDuration] = useState(90);
    const [timeLeft, setTimeLeft] = useState(90);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive || timeLeft <= 0) {
            if (isActive && timeLeft <= 0) {
                toast({
                    title: "Время отдыха истекло!",
                    description: "Пора начинать следующий подход.",
                });
            }
            setIsActive(false);
            return;
        }
        
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft, toast]);

    const toggleTimer = () => {
        if (timeLeft > 0) {
            setIsActive(!isActive);
        } else { // If timer is at 0, reset and start
            setTimeLeft(duration);
            setIsActive(true);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(duration);
    };
    
    const selectDuration = (newDuration: number) => {
        setIsActive(false);
        setDuration(newDuration);
        setTimeLeft(newDuration);
    }
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <Card className="mx-1 bg-muted/50 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2"><Timer className="h-5 w-5"/> Таймер отдыха</CardTitle>
                <div className="flex gap-1">
                    {presets.map(p => (
                        <Button
                            key={p}
                            size="sm"
                            variant={duration === p ? 'default' : 'outline'}
                            onClick={() => selectDuration(p)}
                        >
                            {p}с
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2">
                 <p className="font-mono text-5xl font-bold">{formatTime(timeLeft)}</p>
                 <div className="flex gap-2">
                     <Button variant="outline" size="icon" onClick={resetTimer} aria-label="Reset timer">
                         <RotateCcw className="h-5 w-5"/>
                     </Button>
                    <Button size="icon" className="w-16 h-16 rounded-full" onClick={toggleTimer} aria-label={isActive ? 'Pause timer' : 'Start timer'}>
                        {isActive ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8"/>}
                    </Button>
                 </div>
            </CardContent>
        </Card>
    );
}
