import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, CalendarPlus, Users, ClipboardList, Star, Award } from "lucide-react";

const achievements = [
  { name: "First Event", icon: CalendarPlus, description: "Successfully organize your first tournament.", unlocked: true },
  { name: "Full Bracket", icon: Users, description: "Host a tournament with a full 64-team bracket.", unlocked: false },
  { name: "Community Favorite", icon: Star, description: "Organize an event rated 5 stars by participants.", unlocked: true },
  { name: "Major Host", icon: Trophy, description: "Host a tournament with a prize pool over $10,000.", unlocked: false },
  { name: "Smooth Operator", icon: ClipboardList, description: "Run a tournament with zero disputes or issues.", unlocked: false },
  { name: "Organizer of the Year", icon: Award, description: "Get voted as Organizer of the Year.", unlocked: false },
];

export default function OrganizerProfilePage() {
  const user = {
    name: 'Event Horizon Inc.',
    email: 'events@horizon.com',
    role: 'Organizer',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-destructive">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="event management logo" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="destructive">{user.role}</Badge>
              <Badge variant="secondary">Event Host</Badge>
            </div>
          </div>
          <Button>Create Tournament</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Premier tournament and event organizers for online gaming.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Event Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Organizer Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Tournaments Hosted</CardDescription>
                <CardTitle className="font-headline text-4xl">28</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Participants</CardDescription>
                <CardTitle className="font-headline text-4xl">1,500+</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Prize Pools</CardDescription>
                <CardTitle className="font-headline text-4xl">$125k</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Avg. Event Rating</CardDescription>
                <CardTitle className="font-headline text-4xl">4.8/5</CardTitle>
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
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-destructive bg-destructive/20 text-destructive' : 'border-dashed'}`}>
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
