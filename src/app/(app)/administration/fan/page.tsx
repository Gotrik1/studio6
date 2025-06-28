import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Ticket, MessageSquare, Heart, UserPlus, Award } from "lucide-react";

const achievements = [
  { name: "First Follow", icon: UserPlus, description: "Follow your first team or player.", unlocked: true },
  { name: "Super Fan", icon: Star, description: "Follow 10 teams.", unlocked: true },
  { name: "Live Spectator", icon: Ticket, description: "Attend a live tournament match.", unlocked: true },
  { name: "Vocal Supporter", icon: MessageSquare, description: "Leave 100 comments on match pages.", unlocked: false },
  { name: "Loyalty", icon: Heart, description: "Be a fan of a team for over a year.", unlocked: false },
  { name: "Fan of the Year", icon: Award, description: "Get voted as Fan of the Year by a team.", unlocked: false },
];

export default function FanProfilePage() {
  const user = {
    name: 'Loyal Larry',
    email: 'larry.fan@prodvor.com',
    role: 'Fan',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="sports fan" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge>{user.role}</Badge>
              <Badge variant="secondary">Cyber Eagles #1 Fan</Badge>
            </div>
          </div>
          <Button variant="outline">Follow</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Dedicated fan supporting the grassroots esports scene.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Fan Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Fan Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Teams Followed</CardDescription>
                <CardTitle className="font-headline text-4xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Matches Watched</CardDescription>
                <CardTitle className="font-headline text-4xl">340</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Comments Posted</CardDescription>
                <CardTitle className="font-headline text-4xl">512</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Player of the Match Votes</CardDescription>
                <CardTitle className="font-headline text-4xl">89</CardTitle>
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
