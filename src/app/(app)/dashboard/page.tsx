import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    user: "Команда 'Кибер Орлы'",
    action: "выиграла турнир 'Summer Kickoff 2024'!",
    timestamp: "2 часа назад",
    avatar: "https://placehold.co/40x40.png",
    type: "tournament",
    typeDisplay: "Турнир"
  },
  {
    user: "Alex 'CyberSlasher' Doe",
    action: "открыл достижение 'Тройная угроза'.",
    timestamp: "5 часов назад",
    avatar: "https://placehold.co/40x40.png",
    type: "achievement",
    typeDisplay: "Достижение"
  },
  {
    user: "Maria 'Shadow' Petrova",
    action: "создала новую команду 'Ночные Охотники'.",
    timestamp: "1 день назад",
    avatar: "https://placehold.co/40x40.png",
    type: "team",
    typeDisplay: "Команда"
  },
  {
    user: "Система",
    action: "Доступны новые PRO-функции. Загляните во вкладку PRO-Доступ!",
    timestamp: "2 дня назад",
    avatar: "https://placehold.co/40x40.png",
    type: "system",
    typeDisplay: "Система"
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Лента</h1>
        <p className="text-muted-foreground">С возвращением! Вот что произошло за последнее время.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Лента активности</CardTitle>
          <CardDescription>Последние события на платформе.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={activity.avatar} data-ai-hint="avatar gaming" />
                  <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <Badge variant={activity.type === 'tournament' ? 'default' : 'secondary'} className="capitalize">
                  {activity.typeDisplay}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
