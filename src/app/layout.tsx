import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/shared/ui/toaster";
import { ThemeProvider } from '@/app/providers/theme-provider';
import { AccentThemeProvider } from '@/app/providers/accent-theme-provider';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});


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
    <html lang="ru" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head />
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
