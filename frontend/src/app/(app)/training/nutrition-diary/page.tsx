import { redirect } from 'next/navigation';

export default function NutritionDiaryRedirectPage() {
    // This page is obsolete and has been merged into /training/nutrition
    // In a real project this file should be deleted.
    redirect('/training/nutrition');
    return null; // unreachable
}
