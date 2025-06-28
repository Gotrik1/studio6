import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Users, Gamepad2 } from "lucide-react";
import Link from "next/link";

const nextSteps = [
    {
        icon: User,
        title: "Заполните свой профиль",
        description: "Добавьте аватар, расскажите о себе и своих спортивных интересах, чтобы другие могли вас найти.",
        href: "/profile"
    },
    {
        icon: Users,
        title: "Найдите или создайте команду",
        description: "Просмотрите существующие команды или соберите свою собственную, чтобы начать соревноваться.",
        href: "/teams"
    },
    {
        icon: Gamepad2,
        title: "Примите участие в турнире",
        description: "Найдите подходящий турнир и подайте заявку на участие. Слава ждет!",
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
            <Card className="w-full max-w-2xl animate-in fade-in-50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Добро пожаловать, {user.name}!</CardTitle>
                    <CardDescription className="text-lg">Вы успешно зарегистрировались в ProDvor. Вот несколько шагов, чтобы начать.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="mb-4 text-center text-xl font-semibold">Что дальше?</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {nextSteps.map((step) => (
                                <Link href={step.href} key={step.title} className="block h-full">
                                    <div className="group flex h-full flex-col items-center rounded-lg border p-4 text-center transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md">
                                        <step.icon className="mb-2 h-8 w-8 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                                        <p className="font-semibold">{step.title}</p>
                                        <p className="mt-1 text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground">{step.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/dashboard">Перейти на главную</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground">Вы всегда можете вернуться к этим шагам из своего профиля.</p>
                </CardFooter>
            </Card>
        </div>
    )
}
