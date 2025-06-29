
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { faqCategories } from '@/shared/lib/mock-data/faq';
import { SupportContactForm } from '@/widgets/support-contact-form';
import { LifeBuoy } from 'lucide-react';

export function SupportPage() {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <LifeBuoy className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">Центр поддержки</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Есть вопросы? Мы здесь, чтобы помочь. Ознакомьтесь с часто задаваемыми вопросами или свяжитесь с нами напрямую.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Часто задаваемые вопросы</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {faqCategories.map(category => (
                                    <div key={category.value}>
                                        <h3 className="mt-6 mb-2 text-lg font-semibold">{category.title}</h3>
                                        {category.questions.map((faq, index) => (
                                            <AccordionItem value={`${category.value}-${index}`} key={index}>
                                                <AccordionTrigger>{faq.q}</AccordionTrigger>
                                                <AccordionContent>
                                                    {faq.a}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </div>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Связаться с нами</CardTitle>
                            <CardDescription>
                                Не нашли ответ? Напишите нам, и мы ответим как можно скорее.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SupportContactForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
