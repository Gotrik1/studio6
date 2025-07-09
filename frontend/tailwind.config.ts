
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/entities/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        headline: ["var(--font-space-grotesk)", ...defaultTheme.fontFamily.sans],
        code: ["monospace", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: "hsl(var(--primary))",
          "primary-foreground": "hsl(var(--primary-foreground))",
          accent: "hsl(var(--accent))",
          "accent-foreground": "hsl(var(--accent-foreground))",
          border: "hsl(var(--border))",
          ring: "hsl(var(--ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 8px 16px -4px rgb(0 0 0 / 0.2), 0 4px 6px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.15)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        "deep-dark": "-10px 15px 35px -10px rgb(0 0 0 / 0.5)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        "left-bottom": "-10px 15px 35px -10px rgb(0 0 0 / 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow:
              "0 0 10px 2px hsl(var(--primary) / 0.7), 0 0 20px 5px hsl(var(--primary) / 0.5), 0 0 40px 10px hsl(var(--primary) / 0.2)",
          },
          "50%": {
            transform: "scale(1.1)",
            boxShadow:
              "0 0 15px 5px hsl(var(--primary) / 0.8), 0 0 30px 10px hsl(var(--primary) / 0.6), 0 0 60px 20px hsl(var(--primary) / 0.3)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2.5s infinite ease-in-out",
      },
      animationDelay: {
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
        "600": "600ms",
        "700": "700ms",
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.foreground"),
            "--tw-prose-headings": theme("colors.foreground"),
            "--tw-prose-lead": theme("colors.foreground"),
            "--tw-prose-links": theme("colors.primary.DEFAULT"),
            "--tw-prose-bold": theme("colors.foreground"),
            "--tw-prose-counters": theme("colors.muted.foreground"),
            "--tw-prose-bullets": theme("colors.muted.foreground"),
            "--tw-prose-hr": theme("colors.border"),
            "--tw-prose-quotes": theme("colors.foreground"),
            "--tw-prose-quote-borders": theme("colors.primary.DEFAULT"),
            "--tw-prose-captions": theme("colors.muted.foreground"),
            "--tw-prose-code": theme("colors.foreground"),
            "--tw-prose-pre-code": theme("colors.foreground"),
            "--tw-prose-pre-bg": theme("colors.muted.DEFAULT"),
            "--tw-prose-th-borders": theme("colors.border"),
            "--tw-prose-td-borders": theme("colors.border"),
            // Dark mode
            "--tw-prose-invert-body": theme("colors.foreground"),
            "--tw-prose-invert-headings": theme("colors.foreground"),
            "--tw-prose-invert-lead": theme("colors.foreground"),
            "--tw-prose-invert-links": theme("colors.primary.DEFAULT"),
            "--tw-prose-invert-bold": theme("colors.foreground"),
            "--tw-prose-invert-counters": theme("colors.muted.foreground"),
            "--tw-prose-invert-bullets": theme("colors.muted.foreground"),
            "--tw-prose-invert-hr": theme("colors.border"),
            "--tw-prose-invert-quotes": theme("colors.foreground"),
            "--tw-prose-invert-quote-borders": theme("colors.primary.DEFAULT"),
            "--tw-prose-invert-captions": theme("colors.muted.foreground"),
            "--tw-prose-invert-code": theme("colors.foreground"),
            "--tw-prose-invert-pre-code": theme("colors.foreground"),
            "--tw-prose-invert-pre-bg": theme("colors.muted.DEFAULT"),
            "--tw-prose-invert-th-borders": theme("colors.border"),
            "--tw-prose-invert-td-borders": theme("colors.border"),
          },
        },
      }),
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssTypography,
    function ({ addUtilities, theme }: any) {
      const newUtilities = {
        ".animation-delay-300": {
          animationDelay: theme("animationDelay.300"),
        },
        ".animation-delay-400": {
          animationDelay: theme("animationDelay.400"),
        },
        ".animation-delay-500": {
          animationDelay: theme("animationDelay.500"),
        },
        ".animation-delay-600": {
          animationDelay: theme("animationDelay.600"),
        },
        ".animation-delay-700": {
          animationDelay: theme("animationDelay.700"),
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
