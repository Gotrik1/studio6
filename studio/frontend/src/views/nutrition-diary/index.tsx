
import { redirect } from 'next/navigation';

export function NutritionDiaryPage() {
    // This view has been merged into the NutritionCenterPage.
    // This component is now obsolete and should be removed.
    // For now, redirecting to the new unified page.
    redirect('/training/nutrition');
    return null; // unreachable
}
