
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Shield, Gavel, User, Award, Briefcase, Star, Handshake,
  Trophy, Scale, Users, Gamepad2, Activity, Coins, Users2
} from "lucide-react";
import { userList } from "@/lib/mock-data/users";
import { teams } from "@/lib/mock-data/teams";
import { allTournaments } from "@/lib/mock-data/tournaments";

// --- Data Aggregation ---
const totalUsers = userList.length;
const totalTeams = teams.length;
const activeTournaments = allTournaments.filter(t => t.status === 'Идет' || t.status === 'Регистрация').length;

const roleCounts = userList.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

const roleData = Object.entries(roleCounts).map(([name, users]) => ({ name, users })).sort((a,b) => b.users - a.users);

const recentActivities = [
    { text: "Новый пользователь 'Gamer123' зарегистрировался.", time: "5 минут назад" },
    { text: "Команда 'Кибер Орлы' выиграла матч.", time: "1 час назад" },
    { text: "Новый турнир 'Winter Cup' был создан.", time: "3 часа назад" },
    { text: "Пользователь 'Admin' забанил 'CheaterX'.", time: "5 часов назад" },
    { text: "Спонсор 'GamerGear' запустил новую акцию.", time: "8 часов назад" }
];

const managementLinks = [
  { name: "Управление пользователями", href: "/administration/users", icon: Users2 },
  { name: "Геймификация", href: "/administration/gamification", icon: Gamepad2 },
  { name: "Виды спорта", href: "/administration/sports", icon: Activity },
];

const profileLinks = [
  { name: "Администратор", href: "/administration/administrator", icon: Shield },
  { name: "Модератор", href: "/administration/moderator", icon: Gavel },
  { name: "Игрок", href: "/administration/player", icon: User },
  { name: "Тренер", href: "/administration/coach", icon: Award },
  { name: "Судья", href: "/administration/judge", icon: Scale },
  { name: "Менеджер", href: "/administration/manager", icon: Briefcase },
  { name: "Болельщик", href: "/administration/fan", icon: Star },
  { name: "Спонсор", href: "/administration/sponsor", icon: Handshake },
  { name: "Организатор", href: "/administration/organizer", icon: Trophy },
]

export default function AdministrationDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Панель администрирования</h1>
        <p className="text-muted-foreground">
          Обзор ключевых метрик и управление платформой.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего команд</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных турниров</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTournaments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PD в экономике</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123.4M</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Распределение пользователей по ролям</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={roleData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Legend iconSize={10} />
                <Bar dataKey="users" fill="hsl(var(--primary))" name="Пользователи" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Недавняя активность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex h-1.5 w-1.5 translate-y-2 rounded-full bg-primary" />
                  <div className="ml-3 flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
       {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-bold">Быстрый доступ</h2>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Управление</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {managementLinks.map(link => (
                  <Link href={link.href} key={link.name}>
                      <Card className="flex items-center p-4 transition-all hover:shadow-md hover:bg-muted/50">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <link.icon className="h-5 w-5" />
                          </div>
                          <p className="ml-4 font-semibold">{link.name}</p>
                      </Card>
                  </Link>
              ))}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Просмотр профилей</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {profileLinks.map(link => (
                  <Link href={link.href} key={link.name}>
                      <Card className="flex flex-col items-center justify-center p-4 text-center transition-all hover:shadow-md hover:bg-muted/50 h-full">
                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <link.icon className="h-5 w-5" />
                          </div>
                          <p className="mt-2 text-sm font-semibold">{link.name}</p>
                      </Card>
                  </Link>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
}
