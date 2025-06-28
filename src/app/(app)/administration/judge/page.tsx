import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, ClipboardCheck, Trophy, CalendarDays, Shield, Scale } from "lucide-react";

const achievements = [
  { name: "First Judgement", icon: Gavel, description: "Officiate your first official match.", unlocked: true },
  { name: "Tournament Official", icon: Trophy, description: "Serve as a judge in a major tournament.", unlocked: true },
  { name: "Iron Judge", icon: CalendarDays, description: "Officiate 50 matches in a single season.", unlocked: true },
  { name: "Fair Play Award", icon: Shield, description: "Receive a 99%+ fairness rating from players.", unlocked: false },
  { name: "Dispute Resolver", icon: Scale, description: "Successfully resolve 20 score disputes.", unlocked: false },
  { name: "Certified Pro", icon: ClipboardCheck, description: "Complete the professional judge certification.", unlocked: true },
];

export default function JudgeProfilePage() {
  const user = {
    name: 'Judge Judy',
    email: 'judy.j@prodvor.com',
    role: 'Judge',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-secondary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="judge portrait" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary">{user.role}</Badge>
              <Badge variant="outline">Certified Official</Badge>
            </div>
          </div>
          <Button>View Schedule</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Certified judge for CS:GO 2 and Valorant tournaments.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Officiating Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Judge Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Matches Officiated</CardDescription>
                <CardTitle className="font-headline text-4xl">217</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Tournaments Served</CardDescription>
                <CardTitle className="font-headline text-4xl">15</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Disputes Resolved</CardDescription>
                <CardTitle className="font-headline text-4xl">8</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Player Rating</CardDescription>
                <CardTitle className="font-headline text-4xl">4.9/5.0</CardTitle>
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
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-secondary-foreground bg-secondary' : 'border-dashed'}`}>
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
