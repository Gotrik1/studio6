import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Server, BarChart3, Users, Gavel, ArrowUpCircle } from "lucide-react";

const achievements = [
  { name: "First System Update", icon: ArrowUpCircle, description: "Successfully deploy a system update.", unlocked: true },
  { name: "Community Guardian", icon: Shield, description: "Resolve 100 user reports.", unlocked: true },
  { name: "Platform Growth", icon: Users, description: "Reach 1,000 active users.", unlocked: true },
  { name: "First Ban Hammer", icon: Gavel, description: "Take first moderation action.", unlocked: true },
  { name: "Server Stability", icon: Server, description: "Maintain 99.9% uptime for a month.", unlocked: false },
  { name: "Feature Shipper", icon: BarChart3, description: "Oversee the launch of 5 major features.", unlocked: false },
];

export default function AdministratorProfilePage() {
  const user = {
    name: 'Admin User',
    email: 'admin.user@prodvor.com',
    role: 'Administrator',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-destructive">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="administrator avatar" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="destructive">{user.role}</Badge>
              <Badge variant="secondary">System Operator</Badge>
            </div>
          </div>
          <Button>Admin Panel</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Administrator account with full system privileges.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Platform Metrics</TabsTrigger>
          <TabsTrigger value="achievements">Admin Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Active Users</CardDescription>
                <CardTitle className="font-headline text-4xl">1,257</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Open Reports</CardDescription>
                <CardTitle className="font-headline text-4xl">14</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Server Uptime</CardDescription>
                <CardTitle className="font-headline text-4xl">99.98%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Revenue (Month)</CardDescription>
                <CardTitle className="font-headline text-4xl">$5,230</CardTitle>
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
