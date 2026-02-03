'use server';

/**
 * @fileOverview A tool to review emails and match them against prior messages.
 *
 * - reviewEmail - A function that reviews an email and checks for a valentine response.
 * - ReviewEmailInput - The input type for the reviewEmail function.
 * - ReviewEmailOutput - The return type for the reviewEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewEmailInputSchema = z.object({
  emailBody: z.string().describe('The body of the email to review.'),
  priorEmails: z.array(z.string()).describe('An array of prior email messages.'),
});
export type ReviewEmailInput = z.infer<typeof ReviewEmailInputSchema>;

const ReviewEmailOutputSchema = z.object({
  isValentineResponse: z
    .boolean()
    .describe('Whether the email indicates a positive response to the valentine request.'),
  confidenceScore: z
    .number()
    .describe('A score (0-1) indicating the confidence level of the match.'),
});
export type ReviewEmailOutput = z.infer<typeof ReviewEmailOutputSchema>;

export async function reviewEmail(input: ReviewEmailInput): Promise<ReviewEmailOutput> {
  return reviewEmailFlow(input);
}

const reviewEmailPrompt = ai.definePrompt({
  name: 'reviewEmailPrompt',
  input: {schema: ReviewEmailInputSchema},
  output: {schema: ReviewEmailOutputSchema},
  prompt: `You are an AI assistant tasked with reviewing email messages to determine if they are a positive response to a valentine request.

Analyze the email body and compare it to the prior emails provided. Determine if the email indicates the recipient has accepted the valentine request.

Prior Emails:
{{#each priorEmails}}
---
{{{this}}}
{{/each}}

Email Body:
---
{{{emailBody}}}

Based on your analysis, determine if the email is a positive response to the valentine request and provide a confidence score.

Return a JSON object with 'isValentineResponse' set to true if the email is a positive response, and false otherwise. Also, include a 'confidenceScore' (0-1) indicating the confidence level of your assessment.

Ensure the output is valid JSON.
`,
});

const reviewEmailFlow = ai.defineFlow(
  {
    name: 'reviewEmailFlow',
    inputSchema: ReviewEmailInputSchema,
    outputSchema: ReviewEmailOutputSchema,
  },
  async input => {
    const {output} = await reviewEmailPrompt(input);
    return output!;
  }
);
