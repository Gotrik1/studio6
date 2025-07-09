"use client";

import { Check, Palette } from "lucide-react";
import { useAccentTheme } from "@/shared/context/accent-theme-provider";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

const themes = [
  { name: "blue", color: "hsl(217, 91%, 60%)" },
  { name: "green", color: "hsl(142, 71%, 45%)" },
  { name: "yellow", color: "hsl(48, 96%, 51%)" },
  { name: "orange", color: "hsl(25, 95%, 53%)" },
  { name: "red", color: "hsl(0, 84%, 60%)" },
  { name: "purple", color: "hsl(262, 83%, 58%)" },
  { name: "pink", color: "hsl(340, 95%, 68%)" },
  { name: "cyan", color: "hsl(199, 98%, 48%)" },
] as const;

export function ThemeCustomizer() {
  const { accentTheme, setAccentTheme } = useAccentTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette />
          <span className="sr-only">Customize Theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-4">
        <p className="mb-2 text-sm font-medium text-center text-muted-foreground">
          Акцент
        </p>
        <div className="grid grid-cols-4 gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.name}
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              style={{ backgroundColor: theme.color }}
              onClick={() => setAccentTheme(theme.name)}
            >
              {accentTheme === theme.name && (
                <Check className="h-5 w-5 text-white" />
              )}
              <span className="sr-only">{theme.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
