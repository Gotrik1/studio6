
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Search, Mail, Send, MessageCircle, FileQuestion, Bot, Loader2 } from "lucide-react";
import { SupportContactForm } from "@/components/support-contact-form";
import { faqCategories } from '@/lib/mock-data/faq';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { askSupportChatbot } from '@/ai/flows/support-chatbot-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session-client';

function FaqSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaq = useMemo(() => {
    if (!searchQuery) {
      return faqCategories;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    
    return faqCategories.map(category => {
      const filteredQuestions = category.questions.filter(faq => 
        faq.q.toLowerCase().includes(lowercasedQuery) ||
        faq.a.toLowerCase().includes(lowercasedQuery)
      );

      return { ...category, questions: filteredQuestions };
    }).filter(category => category.questions.length > 0);
  }, [searchQuery]);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Часто задаваемые вопросы (FAQ)</CardTitle>
            <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Поиск по базе знаний..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            {filteredFaq.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {filteredFaq.map((category) => (
                        <div key={category.category}>
                            <h3 className="mt-6 mb-2 font-headline text-xl font-semibold">{category.category}</h3>
                            {category.questions.map((faq) => (
                                <AccordionItem key={faq.q} value={faq.q}>
                                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                                    <AccordionContent>{faq.a}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </div>
                    ))}
                </Accordion>
            ) : (
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                    <FileQuestion className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Ничего не найдено</h3>
                    <p className="text-muted-foreground mt-1">По вашему запросу нет совпадений.</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
}

type ChatMessage = {
    sender: 'user' | 'ai';
    text: string;
    isThinking?: boolean;
};

function AiAssistantSection() {
    const { user } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        const thinkingMessage: ChatMessage = { sender: 'ai', text: 'Думаю...', isThinking: true };
        
        setMessages(prev => [...prev, userMessage, thinkingMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await askSupportChatbot(input);
            const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev.slice(0, -1), aiMessage]);
        } catch(e) {
            console.error(e);
            const errorMessage: ChatMessage = { sender: 'ai', text: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.' };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[75vh]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6" /> AI-Помощник</CardTitle>
                <CardDescription>Задайте свой вопрос, и ИИ постарается найти ответ в нашей базе знаний.</CardDescription>
            </CardHeader>
            <ScrollArea className="flex-1 p-6 pt-0">
                <div className="space-y-6">
                   {messages.map((message, index) => (
                       <div key={index} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                           {message.sender === 'ai' && <Avatar className="h-8 w-8 border"><AvatarFallback><Bot/></AvatarFallback></Avatar>}
                           <div className={cn(
                               "max-w-md rounded-lg p-3 text-sm shadow-sm",
                               message.sender === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                           )}>
                                {message.isThinking ? (
                                   <div className="flex items-center gap-2">
                                       <Loader2 className="h-4 w-4 animate-spin"/>
                                       <span>{message.text}</span>
                                   </div>
                               ) : <p className="whitespace-pre-wrap">{message.text}</p>}
                           </div>
                           {message.sender === 'user' && user && <Avatar className="h-8 w-8 border"><AvatarImage src={user.avatar} data-ai-hint="user avatar"/><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>}
                       </div>
                   ))}
                   <div ref={messagesEndRef} />
                </div>
                {messages.length === 0 && (
                    <div className="h-full flex flex-col justify-center items-center text-center text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mb-4"/>
                        <p className="font-semibold">Задайте свой вопрос</p>
                        <p className="text-sm">Например: &quot;Как мне сменить роль в профиле?&quot;</p>
                    </div>
                )}
            </ScrollArea>
            <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                    <Input 
                        placeholder="Напишите ваш вопрос..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function ContactSection() {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Связаться с поддержкой</CardTitle>
              <CardDescription>
                Не нашли ответ? Напишите нам напрямую.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupportContactForm />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Другие способы связи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start"><Mail className="mr-2"/> support@prodvor.com</Button>
                <Button variant="outline" className="w-full justify-start"><Send className="mr-2"/> Telegram</Button>
            </CardContent>
          </Card>
      </div>
    )
}

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Центр Поддержки
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Чем мы можем вам помочь?
        </p>
      </div>

      <Tabs defaultValue="ai-assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai-assistant"><Bot className="mr-2 h-4 w-4" />AI Помощник</TabsTrigger>
            <TabsTrigger value="faq"><FileQuestion className="mr-2 h-4 w-4" />База знаний</TabsTrigger>
            <TabsTrigger value="contact"><Mail className="mr-2 h-4 w-4" />Связаться</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-assistant" className="mt-4">
            <AiAssistantSection />
        </TabsContent>
        <TabsContent value="faq" className="mt-4">
            <FaqSection />
        </TabsContent>
        <TabsContent value="contact" className="mt-4">
            <ContactSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
