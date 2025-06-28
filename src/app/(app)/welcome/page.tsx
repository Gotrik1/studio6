
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, Gamepad2, Lightbulb, Award, PartyPopper, Coins } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const onboardingQuests = [
    {
        icon: User,
        title: "Заполнить профиль",
        description: "Добавьте аватар и интересы, чтобы вас заметили.",
        reward: "+15 PD",
        href: "/profile"
    },
    {
        icon: Users,
        title: "Вступить в команду",
        description: "Найдите команду или создайте свою, чтобы начать соревноваться.",
        reward: "+20 PD",
        href: "/teams"
    },
    {
        icon: Gamepad2,
        title: "Сыграть первый матч",
        description: "Найдите подходящий турнир и подайте заявку. Слава ждет!",
        reward: "+50 PD",
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
                        <PartyPopper className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Добро пожаловать в ProDvor, {user.name}!</CardTitle>
                    <CardDescription className="text-lg">Ваше путешествие начинается! Выполните первые задания, чтобы получить награды.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="mb-4 text-center text-xl font-semibold">Ваши первые квесты</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {onboardingQuests.map((quest) => (
                                <Link href={quest.href} key={quest.title} className="block h-full">
                                    <div className="group relative flex h-full flex-col items-center rounded-lg border p-6 text-center transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md">
                                        <Badge variant="secondary" className="absolute -top-2 right-2 flex items-center gap-1 border-primary/50 bg-primary/10 text-primary">
                                            <Coins className="h-3 w-3" /> {quest.reward}
                                        </Badge>
                                        <quest.icon className="mb-3 h-10 w-10 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                                        <p className="font-semibold">{quest.title}</p>
                                        <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-accent-foreground">{quest.description}</p>
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
                                    <CardTitle className="text-lg">Приветственный бонус</CardTitle>
                                    <CardDescription>За регистрацию вы получаете <span className="font-bold text-green-500">+25 PD</span> и достижение "Новичок в деле"! </CardDescription>
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
