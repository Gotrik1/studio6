import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { login } from '@/features/auth/actions';

export function AuthPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <form action={login} className="w-full max-w-md">
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
        </div>
    );
}
