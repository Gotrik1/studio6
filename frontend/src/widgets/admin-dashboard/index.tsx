"use client";

import Link from "next/link";
import {
  managementCards,
  profileCards,
  contentCards,
  systemCards,
} from "@/widgets/file-tree";
import { AdminStatsCards } from "@/widgets/admin-stats-cards";
import { Card, CardHeader, CardTitle } from "@/shared/ui/card";
import * as React from "react";

type AdminSectionCardProps = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

const AdminSectionCard = ({
  title,
  description,
  href,
  icon: Icon,
}: AdminSectionCardProps) => (
  <Link href={href} className="block h-full">
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-2xl cursor-pointer hover:border-primary">
      <CardHeader className="flex-row items-start gap-4 space-y-0 flex-grow pb-4">
        <div className="p-2 bg-muted rounded-md">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardHeader>
    </Card>
  </Link>
);

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 opacity-0 animate-fade-in-up">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Панель администратора
        </h1>
        <p className="text-muted-foreground">
          Обзор и управление всеми разделами платформы ProDvor.
        </p>
      </div>

      <section className="opacity-0 animate-fade-in-up animation-delay-300">
        <AdminStatsCards />
      </section>

      <section className="opacity-0 animate-fade-in-up animation-delay-400">
        <h2 className="font-headline text-2xl font-semibold mb-4">
          Управление платформой
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementCards.map((card) => (
            <AdminSectionCard key={card.href} {...card} />
          ))}
        </div>
      </section>

      <section className="opacity-0 animate-fade-in-up animation-delay-500">
        <h2 className="font-headline text-2xl font-semibold mb-4">
          Демонстрация профилей ролей
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileCards.map((card) => (
            <AdminSectionCard key={card.href} {...card} />
          ))}
        </div>
      </section>

      <section className="opacity-0 animate-fade-in-up animation-delay-600">
        <h2 className="font-headline text-2xl font-semibold mb-4">
          Контент и коммерция
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentCards.map((card) => (
            <AdminSectionCard key={card.href} {...card} />
          ))}
        </div>
      </section>

      <section className="opacity-0 animate-fade-in-up animation-delay-700">
        <h2 className="font-headline text-2xl font-semibold mb-4">
          Система и разработка
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemCards.map((card) => (
            <AdminSectionCard key={card.href} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
