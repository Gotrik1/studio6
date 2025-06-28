import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, Megaphone, DollarSign, Target, Users, Award } from "lucide-react";

const achievements = [
  { name: "First Partnership", icon: Handshake, description: "Sponsor your first team or tournament.", unlocked: true },
  { name: "Campaign Master", icon: Megaphone, description: "Run a successful ad campaign with over 1M impressions.", unlocked: false },
  { name: "Community Investor", icon: Users, description: "Sponsor 5 different community teams.", unlocked: true },
  { name: "High Roller", icon: DollarSign, description: "Contribute over $20,000 in prize pools.", unlocked: false },
  { name: "Brand Builder", icon: Target, description: "Achieve a 20% increase in brand recognition.", unlocked: false },
  { name: "Sponsor of the Year", icon: Award, description: "Get voted as Sponsor of the Year by the community.", unlocked: false },
];

export default function SponsorProfilePage() {
  const user = {
    name: 'Sponsor Corp',
    email: 'contact@sponsorcorp.com',
    role: 'Sponsor',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-secondary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="corporate logo" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary">{user.role}</Badge>
              <Badge variant="outline">Official Partner</Badge>
            </div>
          </div>
          <Button>View Campaigns</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Leading sponsor of esports and gaming initiatives.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Sponsorship ROI</TabsTrigger>
          <TabsTrigger value="achievements">Sponsor Milestones</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Campaigns Run</CardDescription>
                <CardTitle className="font-headline text-4xl">18</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Audience Reached</CardDescription>
                <CardTitle className="font-headline text-4xl">2.5M</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Teams Sponsored</CardDescription>
                <CardTitle className="font-headline text-4xl">7</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Investment</CardDescription>
                <CardTitle className="font-headline text-4xl">$75k</CardTitle>
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
