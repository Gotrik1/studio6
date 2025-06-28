import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const proFeatures = [
  "Advanced statistics and match history",
  "Exclusive PRO badge on profile",
  "Priority support",
  "Create and manage up to 3 teams",
  "Ad-free experience",
  "Early access to new features",
];

export default function MonetizationPage() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-accent/20 p-3 text-accent">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <CardTitle className="font-headline text-3xl">ProDvor PRO</CardTitle>
          <CardDescription>Unlock your full potential and support the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <span className="font-headline text-4xl font-bold">$9.99</span>
            <span className="text-muted-foreground">/ month</span>
          </div>
          <ul className="space-y-2">
            {proFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">Upgrade to PRO</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
