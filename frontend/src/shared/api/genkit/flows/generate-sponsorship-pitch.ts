'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Define types locally to decouple from backend schemas.
export type GenerateSponsorshipPitchInput = {
  teamName: string;
  achievements: string;
  goals: string;
  audience: string;
};

export type GenerateSponsorshipPitchOutput = {
  pitch: string;
};

export async function generateSponsorshipPitch(input: GenerateSponsorshipPitchInput): Promise<GenerateSponsorshipPitchOutput> {
   const result = await fetchWithAuth<GenerateSponsorshipPitchOutput>('/ai/generate-sponsorship-pitch', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    if (!result.success) {
        console.error("Backend API error:", result.error);
        throw new Error(`Backend API responded with status: ${result.status}`);
    }
    
    if (!result.data) {
        throw new Error("No data received from backend.");
    }
    
    return result.data;
}
