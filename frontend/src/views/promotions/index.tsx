"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Megaphone, PlusCircle, Coins } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPromotions } from "@/entities/promotion/api/promotions";
import type { Promotion } from "@/entities/promotion/model/types";
import { useToast } from "@/shared/hooks/use-toast";
import { Skeleton } from "@/shared/ui/skeleton";

const PromotionCardSkeleton = () => (
  <Card className="flex flex-col overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent className="flex-1">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mt-2" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPromotions = async () => {
      setIsLoading(true);
      try {
        const data = await getPromotions();
        setPromotions(data);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить промо-акции.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadPromotions();
  }, [toast]);

  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Промо-акции и конкурсы
          </h1>
          <p className="text-muted-foreground">
            Участвуйте в эксклюзивных событиях от наших партнеров и выигрывайте
            ценные призы.
          </p>
        </div>
        <Button asChild>
          <Link href="/promotions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать промо-акцию
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <PromotionCardSkeleton />
            <PromotionCardSkeleton />
            <PromotionCardSkeleton />
          </>
        ) : (
          promotions.map((promo) => (
            <Card key={promo.id} className="flex flex-col overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={promo.imageDataUri}
                  alt={promo.name}
                  fill
                  className="object-cover"
                  data-ai-hint={promo.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <CardTitle className="absolute bottom-4 left-4 text-white font-headline text-2xl shadow-lg">
                  {promo.name}
                </CardTitle>
              </div>
              {promo.sponsor && (
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Image
                      src={promo.sponsor.logo}
                      alt={promo.sponsor.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                      data-ai-hint="sponsor logo"
                    />
                    <span className="text-sm font-medium">
                      от {promo.sponsor.name}
                    </span>
                  </div>
                </CardHeader>
              )}
              <CardContent className="flex-1 p-6">
                <p className="text-sm text-muted-foreground">
                  {promo.description}
                </p>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Приз
                  </p>
                  <p className="font-bold text-primary">{promo.prize}</p>
                </div>
                <Button className="w-full">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Участвовать за{" "}
                  <Coins className="h-4 w-4 mx-1.5 text-amber-300" />
                  {promo.cost}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      {!isLoading && promotions.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          Активных промо-акций нет.
        </p>
      )}
    </div>
  );
}
