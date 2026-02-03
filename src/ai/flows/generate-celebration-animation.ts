'use server';
/**
 * @fileOverview Generates a love-themed celebratory image data URI.
 *
 * - generateCelebrationAnimation - A function that generates the celebratory image.
 * - GenerateCelebrationAnimationInput - The input type for the generateCelebrationAnimation function.
 * - GenerateCelebrationAnimationOutput - The return type for the generateCelebrationAnimation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCelebrationAnimationInputSchema = z.object({
  theme: z.string().describe('The theme for the background of the image.'),
  text: z.string().describe('The text to display in the image.'),
});
export type GenerateCelebrationAnimationInput = z.infer<
  typeof GenerateCelebrationAnimationInputSchema
>;

const GenerateCelebrationAnimationOutputSchema = z.object({
  animationDataUri: z
    .string()
    .describe(
      'The image as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type GenerateCelebrationAnimationOutput = z.infer<
  typeof GenerateCelebrationAnimationOutputSchema
>;

/**
 * Generates a celebratory image using AI.
 */
export async function generateCelebrationAnimation(
  input: GenerateCelebrationAnimationInput
): Promise<GenerateCelebrationAnimationOutput> {
  return generateCelebrationAnimationFlow(input);
}

const generateCelebrationAnimationFlow = ai.defineFlow(
  {
    name: 'generateCelebrationAnimationFlow',
    inputSchema: GenerateCelebrationAnimationInputSchema,
    outputSchema: GenerateCelebrationAnimationOutputSchema,
  },
  async input => {
    // Using imagen-3.0-generate-001 as it's highly reliable for text-to-image with text
    const response = await ai.generate({
      model: 'googleai/imagen-3.0-generate-001',
      prompt: `Generate a beautiful, romantic, and high-quality celebratory image for a Valentine proposal. 
      Theme: ${input.theme}. 
      The image MUST clearly display the text: "${input.text}".
      The style should be elegant, warm, and festive.`,
    });

    if (!response.media || !response.media.url) {
      throw new Error('AI image generation failed to return media.');
    }

    return {animationDataUri: response.media.url};
  }
);
