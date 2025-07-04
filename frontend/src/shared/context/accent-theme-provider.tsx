'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type AccentTheme = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan';

type AccentThemeProviderState = {
  accentTheme: AccentTheme;
  setAccentTheme: (theme: AccentTheme) => void;
};

const AccentThemeProviderContext = createContext<AccentThemeProviderState | undefined>(undefined);

export function AccentThemeProvider({
  children,
  defaultTheme = 'blue',
  storageKey = 'vite-ui-accent-theme',
}: {
  children: React.ReactNode;
  defaultTheme?: AccentTheme;
  storageKey?: string;
}) {
  const [accentTheme, setAccentTheme] = useState<AccentTheme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    try {
      return (localStorage.getItem(storageKey) as AccentTheme) || defaultTheme;
    } catch (e) {
      console.error('Failed to parse accent theme from localStorage', e);
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-blue', 'theme-green', 'theme-red', 'theme-yellow', 'theme-purple', 'theme-orange', 'theme-pink', 'theme-cyan');
    root.classList.add(`theme-${accentTheme}`);
  }, [accentTheme]);

  const value = useMemo(() => ({
    accentTheme,
    setAccentTheme: (theme: AccentTheme) => {
      localStorage.setItem(storageKey, theme);
      setAccentTheme(theme);
    },
  }), [accentTheme, storageKey]);

  return (
    <AccentThemeProviderContext.Provider value={value}>
      {children}
    </AccentThemeProviderContext.Provider>
  );
}

export const useAccentTheme = () => {
  const context = useContext(AccentThemeProviderContext);

  if (context === undefined) {
    throw new Error('useAccentTheme must be used within an AccentThemeProvider');
  }

  return context;
};
