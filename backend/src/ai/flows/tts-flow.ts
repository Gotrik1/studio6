"use server";

/**
 * @fileOverview A flow for generating speech from text.
 * - textToSpeech - A function that converts text to speech.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from "../genkit";
import wav from "wav";
import { googleAI } from "@genkit-ai/googleai";
import {
  TextToSpeechInputSchema,
  TextToSpeechOutputSchema,
} from "./schemas/tts-schema";
import type {
  TextToSpeechInput,
  TextToSpeechOutput,
} from "./schemas/tts-schema";

export type { TextToSpeechInput, TextToSpeechOutput };

export async function textToSpeech(
  text: TextToSpeechInput,
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow_Backend(text);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on("error", reject);
    writer.on("data", (d) => {
      bufs.push(d);
    });
    writer.on("end", () => {
      resolve(Buffer.concat(bufs).toString("base64"));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow_Backend = ai.defineFlow(
  {
    name: "textToSpeechFlow_Backend",
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model("gemini-2.5-flash-preview-tts"),
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Algenib" },
          },
        },
      },
      prompt: query,
    });

    if (!media || !media.url) {
      throw new Error("No audio data returned from the model.");
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(",") + 1),
      "base64",
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: "data:audio/wav;base64," + wavBase64,
    };
  },
);
