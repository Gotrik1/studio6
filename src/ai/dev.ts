import { config } from 'dotenv';
config();

import '@/ai/flows/ai-team-assistant.ts';
import '@/ai/flows/analyze-content-generation.ts';
import '@/ai/flows/generate-content-flow.ts';
import '@/ai/flows/generate-team-avatar-flow.ts';
import '@/ai/flows/analyze-security-flow.ts';
import '@/ai/flows/create-team-flow.ts';
import '@/ai/flows/analyze-player-performance-flow.ts';
import '@/ai/flows/tts-flow.ts';
import '@/ai/flows/dialogue-generation-flow.ts';
import '@/ai/flows/multi-speaker-tts-flow.ts';
import '@/ai/flows/generate-post-image-flow.ts';
import '@/ai/flows/smart-search-flow.ts';
import '@/ai/flows/generate-tournament-details-flow.ts';
import '@/ai/flows/generate-tournament-image-flow.ts';
import '@/ai/flows/suggest-reply-flow.ts';
