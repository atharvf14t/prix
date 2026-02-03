'use server';
/**
 * @fileOverview Generates a love-themed celebratory animation data URI.
 *
 * - generateCelebrationAnimation - A function that generates the animation.
 * - GenerateCelebrationAnimationInput - The input type for the generateCelebrationAnimation function.
 * - GenerateCelebrationAnimationOutput - The return type for the generateCelebrationAnimation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCelebrationAnimationInputSchema = z.object({
  theme: z.string().describe('The theme for the background of the animation.'),
  text: z.string().describe('The text to display during the animation.'),
});
export type GenerateCelebrationAnimationInput = z.infer<
  typeof GenerateCelebrationAnimationInputSchema
>;

const GenerateCelebrationAnimationOutputSchema = z.object({
  animationDataUri: z
    .string()
    .describe(
      'The animation as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type GenerateCelebrationAnimationOutput = z.infer<
  typeof GenerateCelebrationAnimationOutputSchema
>;

export async function generateCelebrationAnimation(
  input: GenerateCelebrationAnimationInput
): Promise<GenerateCelebrationAnimationOutput> {
  return generateCelebrationAnimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCelebrationAnimationPrompt',
  input: {schema: GenerateCelebrationAnimationInputSchema},
  output: {schema: GenerateCelebrationAnimationOutputSchema},
  prompt: `Create a short, celebratory animation with a {{{theme}}} background and display the text "{{text}}" for two seconds.\n\nReturn the animation as a data URI.
`,
});

const generateCelebrationAnimationFlow = ai.defineFlow(
  {
    name: 'generateCelebrationAnimationFlow',
    inputSchema: GenerateCelebrationAnimationInputSchema,
    outputSchema: GenerateCelebrationAnimationOutputSchema,
  },
  async input => {
    // Here, instead of calling ai.generate, call the Veo model to generate a video
    // of the appropriate theme and base64 encode the video and return as the animationDataUri
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a short video with a ${input.theme} background and display the text "${input.text}" for two seconds.`,
    });

    if (!media) {
      throw new Error('No media returned from video generation.');
    }

    return {animationDataUri: media.url};
  }
);
