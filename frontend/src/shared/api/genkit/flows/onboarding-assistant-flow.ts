"use server";

// These types are defined locally to decouple from backend schemas.
// In a real project, these could be in a shared types package.
import { icons } from "lucide-react";

export type OnboardingSuggestion = {
  icon: keyof typeof icons;
  title: string;
  description: string;
  href: string;
  reward?: string;
};

export type OnboardingInput = {
  userName: string;
  userRole: string;
};

export type OnboardingOutput = {
  greeting: string;
  mainSuggestion: string;
  suggestions: OnboardingSuggestion[];
};

export async function getOnboardingSuggestions(
  input: OnboardingInput,
): Promise<OnboardingOutput> {
  const response = await fetch("/api/ai/onboarding-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
