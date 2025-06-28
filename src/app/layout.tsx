import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/app/providers/theme-provider';
import { AccentThemeProvider } from '@/app/providers/accent-theme-provider';

export const metadata: Metadata = {
  title: 'ProDvor',
  description: 'ProDvor - Социальная платформа для дворового спорта',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <AccentThemeProvider>
            {children}
            <Toaster />
          </AccentThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
