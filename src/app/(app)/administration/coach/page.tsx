import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, TrendingUp, Trophy, Users, Star, Award } from "lucide-react";

const achievements = [
  { name: "First Victory", icon: Trophy, description: "Coach a team to their first tournament win.", unlocked: true },
  { name: "Prodigy Scout", icon: Star, description: "Discover and mentor a top-ranked player.", unlocked: true },
  { name: "Full Roster", icon: Users, description: "Manage a team with a full and active roster for a season.", unlocked: true },
  { name: "Master Strategist", icon: ClipboardList, description: "Develop 10 unique winning strategies.", unlocked: false },
  { name: "Uprising", icon: TrendingUp, description: "Improve team's rank by 50 positions.", unlocked: false },
  { name: "Coach of the Year", icon: Award, description: "Get voted as Coach of the Year by the community.", unlocked: false },
];

export default function CoachProfilePage() {
  const user = {
    name: 'Coach Carter',
    email: 'coach.carter@prodvor.com',
    role: 'Coach',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="sports coach" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge>{user.role}</Badge>
              <Badge variant="secondary">Certified Mentor</Badge>
            </div>
          </div>
          <Button>View Team</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Experienced coach specializing in Valorant team strategies.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Coaching Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Coaching Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Team Win Rate</CardDescription>
                <CardTitle className="font-headline text-4xl">68%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Players Coached</CardDescription>
                <CardTitle className="font-headline text-4xl">25</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Tournaments Won</CardDescription>
                <CardTitle className="font-headline text-4xl">3</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Avg. Player Growth</CardDescription>
                <CardTitle className="font-headline text-4xl">+250 ELO</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="achievements">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {achievements.map((ach) => (
                  <div key={ach.name} className={`flex flex-col items-center text-center ${ach.unlocked ? '' : 'opacity-40'}`}>
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-primary bg-primary/20 text-primary' : 'border-dashed'}`}>
                      <ach.icon className="h-8 w-8" />
                    </div>
                    <p className="mt-2 font-semibold">{ach.name}</p>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
