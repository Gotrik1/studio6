
'use client';

import { useState } from 'react';
import { LoginForm } from '@/widgets/login-form';
import { RegisterForm } from '@/widgets/register-form';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { YandexIcon, VkIcon, TelegramIcon, GosuslugiIcon } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/button';

export function AuthPage() {
    const [view, setView] = useState<'login' | 'register'>('login');

    return (
         <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50">
             <div className="w-full max-w-sm mx-auto">
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
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-center text-sm font-normal text-muted-foreground">Войти с помощью</CardTitle>
                    </CardHeader>
                     <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Button variant="outline" className="w-full" type="button"><YandexIcon className="mr-2 h-4 w-4"/> Yandex</Button>
                        <Button variant="outline" className="w-full" type="button"><VkIcon className="mr-2 h-4 w-4"/> VK ID</Button>
                        <Button variant="outline" className="w-full" type="button"><TelegramIcon className="mr-2 h-4 w-4"/> Telegram</Button>
                        <Button variant="outline" className="w-full" type="button"><GosuslugiIcon className="mr-2 h-4 w-4"/> Госуслуги</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
