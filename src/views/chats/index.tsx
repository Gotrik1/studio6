'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useSession } from '@/shared/lib/session/client';
import { contacts, messages as allMessages, type Contact } from '@/shared/lib/mock-data/chats';
import { suggestReply } from '@/shared/api/genkit/flows/suggest-reply-flow';

type Message = {
    sender: 'me' | 'other';
    text: string;
};

export function ChatsPage() {
    const { user } = useSession();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [replySuggestions, setReplySuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        if (selectedContact) {
            const newMessages = allMessages[selectedContact.id as keyof typeof allMessages] || [];
            setMessages([...newMessages]);
        } else {
            setMessages([]);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
        const newMessages = allMessages[contact.id as keyof typeof allMessages] || [];
        setMessages([...newMessages]);
        setReplySuggestions([]);
    };
    
    const handleSend = () => {
        if (!input.trim() || !selectedContact) return;
        const newMessage: Message = { sender: 'me', text: input };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setReplySuggestions([]);
    };

    const handleSuggestReplies = async () => {
        if (messages.length === 0) return;
        
        setIsLoadingSuggestions(true);
        setReplySuggestions([]);
        
        const history = messages.map(m => `${m.sender === 'me' ? 'me' : 'other'}: ${m.text}`).join('\n');

        try {
            const { suggestions } = await suggestReply({ history });
            setReplySuggestions(suggestions);
        } catch (e) {
            console.error("Failed to suggest replies:", e);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };
    
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isLoadingSuggestions) {
            handleSend();
        }
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
            <Card className="md:col-span-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Чаты</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-y-auto">
                    <ScrollArea className="h-full">
                        <div className="space-y-1">
                            {contacts.map(contact => (
                                <button
                                    key={contact.id}
                                    className={cn(
                                        "flex items-center gap-3 p-3 w-full text-left transition-colors hover:bg-muted",
                                        selectedContact?.id === contact.id && "bg-muted"
                                    )}
                                    onClick={() => handleSelectContact(contact)}
                                >
                                    <Avatar className="relative">
                                        <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint={contact.avatarHint} />
                                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                        {contact.isOnline && <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />}
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold truncate">{contact.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground self-start">{contact.timestamp}</p>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            
            <Card className="md:col-span-2 flex flex-col">
                {selectedContact ? (
                    <>
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} data-ai-hint={selectedContact.avatarHint} />
                                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleSuggestReplies} disabled={isLoadingSuggestions}>
                                {isLoadingSuggestions ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                                <span className="sr-only">Suggest replies</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <ScrollArea className="h-[calc(100vh-22rem)] p-6">
                                <div className="space-y-6">
                                    {messages.map((message, index) => (
                                       <div key={index} className={cn("flex items-end gap-2", message.sender === 'me' ? 'justify-end' : 'justify-start')}>
                                           {message.sender === 'other' && (
                                               <Avatar className="h-8 w-8 border">
                                                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} data-ai-hint={selectedContact.avatarHint} />
                                                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                                               </Avatar>
                                           )}
                                           <div className={cn(
                                               "max-w-md rounded-lg p-3 text-sm shadow-sm",
                                               message.sender === 'me' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                                           )}>
                                               <p className="whitespace-pre-wrap">{message.text}</p>
                                           </div>
                                           {message.sender === 'me' && user && (
                                               <Avatar className="h-8 w-8 border">
                                                   <AvatarImage src={user.avatar} data-ai-hint="user avatar"/>
                                                   <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                               </Avatar>
                                           )}
                                       </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <div className="p-4 border-t bg-background space-y-2">
                            {replySuggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {replySuggestions.map((suggestion, i) => (
                                        <Button key={i} variant="outline" size="sm" onClick={() => setInput(suggestion)}>
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Input 
                                    placeholder="Напишите сообщение..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <Button onClick={handleSend}><Send className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <Bot className="h-12 w-12 mb-4" />
                        <p className="font-semibold">Выберите чат</p>
                        <p className="text-sm">Выберите чат, чтобы начать общение.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
