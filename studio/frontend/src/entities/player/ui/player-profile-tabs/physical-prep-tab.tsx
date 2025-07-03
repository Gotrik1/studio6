
'use client';

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { Trophy, Dumbbell, Flame, Star, Activity, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { VolumeChart } from '@/widgets/analytics-charts/volume-chart';
import { PlayerPerformanceCoach } from '@/widgets/player-performance-coach';
