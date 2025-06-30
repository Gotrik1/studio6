
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { generateNutritionPlan, type GenerateNutritionPlanOutput } from '@/shared/api/genkit/flows/generate-nutrition-plan-flow';
import { Skeleton } from '@/shared/ui/skeleton';
import { useNutrition } from '@/app/providers/nutrition-provider';

// Schema for the form
const nutritionistFormSchema = z.object({
  goal: z.enum(['Набор массы', 'Снижение веса', 'Поддержание веса']),
  activityLevel: z.enum(['Низкий', 'Средний', 'Высокий']),
  dietaryPreferences: z.string().optional(),
});
type NutritionistFormValues = z.infer<typeof nutritionistFormSchema>;

export function AiNutritionist() {
    const { setTargets } = useNutrition();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateNutritionPlanOutput | null>(null);

    const form = useForm<NutritionistFormValues>({
        resolver: zodResolver(nutritionistFormSchema),
        defaultValues: {
            goal: 'Набор массы',
            activityLevel: 'Средний',
            dietaryPreferences: '',
        },
    });

    const onSubmit = async (data: NutritionistFormValues) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const plan = await generateNutritionPlan(data);
            setResult(plan);
            setTargets({
                calories: plan.dailyCalories,
                protein: plan.macronutrients.protein,
                fat: plan.macronutrients.fat,
                carbs: plan.macronutrients.carbs,
            });
        } catch (e) {
            console.error(e);
            setError("Не удалось сгенерировать план питания. Попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> AI-Диетолог</CardTitle>
                <CardDescription>Получите персональный план питания и рекомендации по калориям, основанные на ваших целях.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="goal" render={({ field }) => (<FormItem><FormLabel>Ваша цель</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Набор массы">Набор массы</SelectItem><SelectItem value="Снижение веса">Снижение веса</SelectItem><SelectItem value="Поддержание веса">Поддержание веса</SelectItem></SelectContent></Select></FormItem>)} />
                            <FormField control={form.control} name="activityLevel" render={({ field }) => (<FormItem><FormLabel>Уровень активности</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Низкий">Низкий (офисная работа)</SelectItem><SelectItem value="Средний">Средний (3-5 тренировок/нед)</SelectItem><SelectItem value="Высокий">Высокий (6+ тренировок/нед)</SelectItem></SelectContent></Select></FormItem>)} />
                            <FormField control={form.control} name="dietaryPreferences" render={({ field }) => (<FormItem><FormLabel>Предпочтения (необязательно)</FormLabel><FormControl><Input placeholder="Например, вегетарианство, без лактозы" {...field} /></FormControl></FormItem>)} />
                        </div>
                        {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                         <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Сгенерировать план
                        </Button>
                    </CardContent>
                </form>
            </Form>
            
            {isLoading && (
                 <CardFooter className="flex-col items-start gap-6 border-t pt-6">
                    <Skeleton className="h-8 w-1/3" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                         <Skeleton className="h-24 w-full" />
                         <Skeleton className="h-24 w-full" />
                         <Skeleton className="h-24 w-full" />
                         <Skeleton className="h-24 w-full" />
                    </div>
                     <Skeleton className="h-8 w-1/3" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                     </div>
                 </CardFooter>
            )}

            {result && (
                <CardFooter className="flex-col items-start gap-6 border-t pt-6 animate-in fade-in-50">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-2">Ваш дневной рацион:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="text-center"><CardHeader><CardTitle>{result.dailyCalories.toLocaleString()}</CardTitle><CardDescription>Ккал/день</CardDescription></CardHeader></Card>
                            <Card className="text-center"><CardHeader><CardTitle>{result.macronutrients.protein}г</CardTitle><CardDescription>Белки</CardDescription></CardHeader></Card>
                            <Card className="text-center"><CardHeader><CardTitle>{result.macronutrients.fat}г</CardTitle><CardDescription>Жиры</CardDescription></CardHeader></Card>
                            <Card className="text-center"><CardHeader><CardTitle>{result.macronutrients.carbs}г</CardTitle><CardDescription>Углеводы</CardDescription></CardHeader></Card>
                        </div>
                    </div>
                     <div className="w-full">
                         <h3 className="text-lg font-semibold mb-2">Примерное меню на день:</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.mealPlan.map(meal => (
                                <Card key={meal.mealName}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{meal.mealName} (~{meal.calories} ккал)</CardTitle>
                                        <CardDescription>{meal.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                         </div>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
