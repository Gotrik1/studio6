import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    user: "Team 'Rockets'",
    action: "won the 'Summer Kickoff 2024' tournament!",
    timestamp: "2 hours ago",
    avatar: "https://placehold.co/40x40.png",
    type: "tournament",
  },
  {
    user: "Alex 'CyberSlasher' Doe",
    action: "unlocked the 'Triple Threat' achievement.",
    timestamp: "5 hours ago",
    avatar: "https://placehold.co/40x40.png",
    type: "achievement",
  },
  {
    user: "Maria 'Shadow' Petrova",
    action: "created a new team 'NightCrawlers'.",
    timestamp: "1 day ago",
    avatar: "https://placehold.co/40x40.png",
    type: "team",
  },
  {
    user: "System",
    action: "New PRO features are now available. Check out the monetization tab!",
    timestamp: "2 days ago",
    avatar: "https://placehold.co/40x40.png",
    type: "system",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's been happening.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>Recent events from across the platform.</CardDescription>
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
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
