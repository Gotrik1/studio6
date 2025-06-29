import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import ProfileClient from "@/app/(app)/profile/client";

export async function ProfilePage() {
    const user = await getSession();

    if (!user) {
        // This should be handled by the layout, but as a safeguard:
        redirect('/auth');
    }

    return <ProfileClient sessionUser={user} />;
}
