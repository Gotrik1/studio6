'use client';

import { useState } from 'react';
import { LoginForm } from '@/widgets/login-form';
import { RegisterForm } from '@/widgets/register-form';
import { AnimatePresence, motion } from 'framer-motion';

export function AuthPage() {
    const [view, setView] = useState<'login' | 'register'>('login');

    return (
         <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50">
             <AnimatePresence mode="wait">
                 {view === 'login' ? (
                     <motion.div
                         key="login"
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                         className="w-full"
                     >
                        <LoginForm onSwitchToRegister={() => setView('register')} />
                     </motion.div>
                 ) : (
                      <motion.div
                         key="register"
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                         className="w-full"
                     >
                        <RegisterForm onSwitchToLogin={() => setView('login')} />
                     </motion.div>
                 )}
            </AnimatePresence>
        </div>
    );
}
