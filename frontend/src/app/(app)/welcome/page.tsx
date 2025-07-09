import { WelcomePage } from "@/views/welcome";
import { getSession } from "@/features/auth/session";
import { getOnboardingSuggestions } from "@/shared/api/genkit/flows/onboarding-assistant-flow";
import { redirect } from "next/navigation";

export default async function WelcomeRoute() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth");
  }

  // Onboarding suggestions are now fetched on the server
  const suggestions = await getOnboardingSuggestions({
    userName: session.user.name,
    userRole: session.user.role,
  }).catch((err) => {
    console.error("Failed to fetch onboarding suggestions:", err);
    return null; // Return null on error to handle it gracefully in the view
  });

  return <WelcomePage initialSuggestions={suggestions} />;
}
