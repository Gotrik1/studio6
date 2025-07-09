"use server";

import { revalidatePath } from "next/cache";

export async function updateMatchScore(
  matchId: string,
  score1: number,
  score2: number,
  comment?: string,
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/matches/${matchId}/score`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score1, score2, comment }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to update score",
      };
    }

    revalidatePath("/matches");
    revalidatePath(`/matches/${matchId}`);
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Error updating match score:", error);
    return { success: false, error: "Server error" };
  }
}
