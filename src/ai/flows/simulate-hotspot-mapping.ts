// Simulate hotspot mapping on a lock screen image using AI.

'use server';

/**
 * @fileOverview Simulates hotspot mapping on a lock screen image using AI.
 *
 * - simulateHotspotMapping - A function that simulates hotspot mapping on a lock screen image.
 * - SimulateHotspotMappingInput - The input type for the simulateHotspotMapping function.
 * - SimulateHotspotMappingOutput - The return type for the simulateHotspotMapping function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateHotspotMappingInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the lock screen, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SimulateHotspotMappingInput = z.infer<typeof SimulateHotspotMappingInputSchema>;

const SimulateHotspotMappingOutputSchema = z.object({
  heatmapDataUri: z
    .string()
    .describe(
      'A data URI containing the heatmap image, with MIME type and Base64 encoding.  Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type SimulateHotspotMappingOutput = z.infer<typeof SimulateHotspotMappingOutputSchema>;

export async function simulateHotspotMapping(
  input: SimulateHotspotMappingInput
): Promise<SimulateHotspotMappingOutput> {
  return simulateHotspotMappingFlow(input);
}

const simulateHotspotMappingPrompt = ai.definePrompt({
  name: 'simulateHotspotMappingPrompt',
  input: {schema: SimulateHotspotMappingInputSchema},
  output: {schema: SimulateHotspotMappingOutputSchema},
  prompt: `You are an AI that analyzes a lock screen image and generates a heatmap
  overlaying the areas where a user's focus is most likely to be.

  Given the following lock screen image, generate a heatmap that highlights areas
  of interest, such as notification content, the clock, and common unlock areas. The heatmap should be returned as a data URI.

  Image: {{media url=photoDataUri}}

  Ensure the output is a data URI with MIME type and Base64 encoding.
  Do not include any text or descriptions, only the data URI.
  `,
});

const simulateHotspotMappingFlow = ai.defineFlow(
  {
    name: 'simulateHotspotMappingFlow',
    inputSchema: SimulateHotspotMappingInputSchema,
    outputSchema: SimulateHotspotMappingOutputSchema,
  },
  async input => {
    const {output} = await simulateHotspotMappingPrompt(input);
    return output!;
  }
);
