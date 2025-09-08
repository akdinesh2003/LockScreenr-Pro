'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating custom app icons using generative AI.
 *
 * It includes the following:
 * - `generateCustomAppIcon`: A function that takes a description of an app icon and returns a data URI of the generated image.
 * - `GenerateCustomAppIconInput`: The input type for the `generateCustomAppIcon` function.
 * - `GenerateCustomAppIconOutput`: The output type for the `generateCustomAppIcon` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomAppIconInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the desired app icon.'),
});
export type GenerateCustomAppIconInput = z.infer<
  typeof GenerateCustomAppIconInputSchema
>;

const GenerateCustomAppIconOutputSchema = z.object({
  iconDataUri: z
    .string()
    .describe(
      "The generated app icon as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateCustomAppIconOutput = z.infer<
  typeof GenerateCustomAppIconOutputSchema
>;

export async function generateCustomAppIcon(
  input: GenerateCustomAppIconInput
): Promise<GenerateCustomAppIconOutput> {
  return generateCustomAppIconFlow(input);
}

const generateCustomAppIconPrompt = ai.definePrompt({
  name: 'generateCustomAppIconPrompt',
  input: {schema: GenerateCustomAppIconInputSchema},
  output: {schema: GenerateCustomAppIconOutputSchema},
  prompt: `You are an expert app icon designer. Please generate an app icon based on the following description: {{{description}}}. The app icon should be visually appealing and suitable for use in a mobile app notification. Return the image as a data URI.
`,
});

const generateCustomAppIconFlow = ai.defineFlow(
  {
    name: 'generateCustomAppIconFlow',
    inputSchema: GenerateCustomAppIconInputSchema,
    outputSchema: GenerateCustomAppIconOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.description,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate app icon.');
    }

    return {iconDataUri: media.url};
  }
);
