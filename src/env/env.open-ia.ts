import { registerAs } from '@nestjs/config';

export const openIaConfig = registerAs('openIa', () => ({
  openIaKey: process.env.OPEN_IA_KEY,
}));
