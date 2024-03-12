import { registerAs } from '@nestjs/config';

export const openAiConfig = registerAs('openAi', () => ({
  openAiKey: process.env.OPENAI_API_KEY,
  assistantId: process.env.OPENAI_ASSISTANT_ID,
}));
