import { RegisterForm } from '@/widgets/register-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { login } from '@/features/auth/actions';

function LoginForm() {
    return (
        <form action={login}>
            <Card>
                <CardHeader>
                    <CardTitle>Вход в аккаунт</CardTitle>
                    <CardDescription>
                        Нажмите на кнопку, чтобы войти в демонстрационный аккаунт администратора. Это имитирует процесс входа через внешний сервис (например, Keycloak).
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" type="submit">
                        Войти как Superuser
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}


export function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
