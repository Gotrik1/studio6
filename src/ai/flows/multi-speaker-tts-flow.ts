'use server';

/**
 * @fileOverview A flow for generating multi-speaker speech from a script.
 * - multiSpeakerTts - A function that converts a script to speech with multiple voices.
 * - MultiSpeakerTtsInput - The input type for the function.
 * - MultiSpeakerTtsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

export const MultiSpeakerTtsInputSchema = z.string().describe("The script to convert to speech. Must contain 'Speaker1:' and 'Speaker2:' prefixes.");
export type MultiSpeakerTtsInput = z.infer<typeof MultiSpeakerTtsInputSchema>;

export const MultiSpeakerTtsOutputSchema = z.object({
    audioDataUri: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type MultiSpeakerTtsOutput = z.infer<typeof MultiSpeakerTtsOutputSchema>;

export async function multiSpeakerTts(script: MultiSpeakerTtsInput): Promise<MultiSpeakerTtsOutput> {
    return multiSpeakerTtsFlow(script);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const multiSpeakerTtsFlow = ai.defineFlow(
    {
        name: 'multiSpeakerTtsFlow',
        inputSchema: MultiSpeakerTtsInputSchema,
        outputSchema: MultiSpeakerTtsOutputSchema,
    },
    async (query) => {
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: [
                            {
                                speaker: 'Speaker1',
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: 'Algenib' },
                                },
                            },
                            {
                                speaker: 'Speaker2',
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: 'Achernar' },
                                },
                            },
                        ],
                    },
                },
            },
            prompt: query,
        });

        if (!media || !media.url) {
            throw new Error('No audio data returned from the model.');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );
        
        const wavBase64 = await toWav(audioBuffer);

        return {
            audioDataUri: 'data:audio/wav;base64,' + wavBase64,
        };
    }
);
