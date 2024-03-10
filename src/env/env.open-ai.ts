import { registerAs } from '@nestjs/config';

export const openAiConfig = registerAs('openAi', () => ({
  openAiKey: process.env.OPEN_AI_KEY,
}));
