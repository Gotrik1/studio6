"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { LifeBuoy } from "lucide-react";
import { SupportChatbot } from "@/widgets/support-chatbot";
import { getFaqCategories, type FaqCategory } from "@/entities/faq/api/faq";
import { Skeleton } from "@/shared/ui/skeleton";

export function SupportPage() {
  const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFaq = async () => {
      setIsLoading(true);
      const data = await getFaqCategories();
      setFaqCategories(data);
      setIsLoading(false);
    };
    loadFaq();
  }, []);

  return (
    <div className="space-y-8 opacity-0 animate-fade-in-up">
      <div className="text-center space-y-2">
        <LifeBuoy className="mx-auto h-12 w-12 text-primary" />
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Центр поддержки
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Есть вопросы? Задайте их нашему AI-помощнику или ознакомьтесь с часто
          задаваемыми вопросами.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SupportChatbot />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Часто задаваемые вопросы</CardTitle>
              <CardDescription>Ответы на популярные вопросы.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {faqCategories.map((category) => (
                    <AccordionItem value={category.value} key={category.value}>
                      <AccordionTrigger>{category.title}</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {category.questions.map((faq, index) => (
                          <div key={index}>
                            <h4 className="font-semibold">{faq.q}</h4>
                            <p className="text-sm text-muted-foreground">
                              {faq.a}
                            </p>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
