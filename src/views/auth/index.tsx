'use client';

import { useState } from 'react';
import { LoginForm } from '@/widgets/login-form';
import { RegisterForm } from '@/widgets/register-form';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { YandexIcon, VkIcon, TelegramIcon, GosuslugiIcon } from '@/shared/ui/icons';
import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/icons';

export function AuthPage() {
    const [view, setView] = useState<'login' | 'register'>('login');

    return (
         <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50">
             <div className="w-full max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-lg overflow-hidden">
                {/* Left Side: Info */}
                <div className="bg-background p-8 flex-col justify-center text-center order-2 md:order-1 hidden md:flex">
                     <div className="flex justify-center mb-4">
                        <Logo className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold font-headline">Добро пожаловать в ProDvor</h2>
                    <p className="text-muted-foreground mt-2 mb-6">
                        Ваша единая платформа для дворового спорта и киберспорта.
                    </p>
                    <Separator />
                     <p className="text-sm text-muted-foreground mt-6 mb-4">Войти с помощью</p>
                     <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="w-full" type="button"><YandexIcon className="mr-2 h-4 w-4"/> Yandex</Button>
                        <Button variant="outline" className="w-full" type="button"><VkIcon className="mr-2 h-4 w-4"/> VK ID</Button>
                        <Button variant="outline" className="w-full" type="button"><TelegramIcon className="mr-2 h-4 w-4"/> Telegram</Button>
                        <Button variant="outline" className="w-full" type="button"><GosuslugiIcon className="mr-2 h-4 w-4"/> Госуслуги</Button>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="bg-card p-8 flex flex-col justify-center order-1 md:order-2">
                     <AnimatePresence mode="wait">
                         {view === 'login' ? (
                             <motion.div
                                 key="login"
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 exit={{ opacity: 0, x: -20 }}
                                 transition={{ duration: 0.2 }}
                                 className="w-full"
                             >
                                <LoginForm onSwitchToRegister={() => setView('register')} />
                             </motion.div>
                         ) : (
                              <motion.div
                                 key="register"
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 exit={{ opacity: 0, x: -20 }}
                                 transition={{ duration: 0.2 }}
                                 className="w-full"
                             >
                                <RegisterForm onSwitchToLogin={() => setView('login')} />
                             </motion.div>
                         )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
