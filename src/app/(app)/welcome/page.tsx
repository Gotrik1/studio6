
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Users, Gamepad2, Lightbulb, Award } from "lucide-react";
import Link from "next/link";

const nextSteps = [
    {
        icon: User,
        title: "1. Заполните свой профиль",
        description: "Добавьте аватар и интересы, чтобы другие могли вас найти.",
        href: "/profile"
    },
    {
        icon: Users,
        title: "2. Найдите команду",
        description: "Просмотрите команды или создайте свою, чтобы начать соревноваться.",
        href: "/teams"
    },
    {
        icon: Gamepad2,
        title: "3. Участвуйте в турнире",
        description: "Найдите подходящий турнир и подайте заявку. Слава ждет!",
        href: "/tournaments"
    }
];


export default async function WelcomePage() {
    const user = await getSession();

    if (!user) {
        redirect("/auth");
    }

    return (
        <div className="flex min-h-full items-center justify-center p-4">
            <Card className="w-full max-w-3xl animate-in fade-in-50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Добро пожаловать в ProDvor, {user.name}!</CardTitle>
                    <CardDescription className="text-lg">Вы успешно начали свой путь. Вот план вашего старта.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="mb-4 text-center text-xl font-semibold">Ваши первые шаги к славе</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {nextSteps.map((step) => (
                                <Link href={step.href} key={step.title} className="block h-full">
                                    <div className="group flex h-full flex-col items-center rounded-lg border p-6 text-center transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md">
                                        <step.icon className="mb-3 h-10 w-10 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                                        <p className="font-semibold">{step.title}</p>
                                        <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-accent-foreground">{step.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card className="bg-muted/50">
                             <CardHeader className="flex-row items-center gap-4">
                                <Award className="h-8 w-8 text-amber-500 shrink-0"/>
                                <div>
                                    <CardTitle className="text-lg">Первое достижение!</CardTitle>
                                    <CardDescription>Вы получили ачивку "Новичок в деле" за регистрацию. Так держать!</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="bg-muted/50">
                            <CardHeader className="flex-row items-center gap-4">
                                <Lightbulb className="h-8 w-8 text-blue-500 shrink-0"/>
                                <div>
                                    <CardTitle className="text-lg">Совет от ИИ-помощника</CardTitle>
                                    <CardDescription>Команды с полным профилем и логотипом получают на 50% больше приглашений на турниры.</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-4 pt-6">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/dashboard">К ленте новостей!</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground">Вы всегда можете найти подсказки в разделе "Поддержка".</p>
                </CardFooter>
            </Card>
        </div>
    )
}
