"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import { revalidateTag } from "next/cache";

export async function getTrainingProposals() {
  return await fetchWithAuth("/training-proposals", {
    next: { tags: ["training-proposals"] },
  });
}

export async function createTrainingProposal(data: {
  toId: string;
  sport: string;
  date: Date;
  comment?: string;
  programId?: string;
}) {
  const result = await fetchWithAuth("/training-proposals", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (result.success) {
    revalidateTag("training-proposals");
  }
  return result;
}

export async function updateTrainingProposalStatus(
  proposalId: string,
  status: "ACCEPTED" | "DECLINED",
) {
  const result = await fetchWithAuth(`/training-proposals/${proposalId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (result.success) {
    revalidateTag("training-proposals");
  }
  return result;
}
