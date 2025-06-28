'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/login/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  function LoginButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full" aria-disabled={pending}>
        {pending ? 'Logging in...' : 'Login'}
      </Button>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-primary">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">ProDvor MVP</CardTitle>
          <CardDescription>Enter admin credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                defaultValue="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                defaultValue="superuser"
              />
            </div>
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <LoginButton />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
