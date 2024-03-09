import { registerAs } from '@nestjs/config';

export const database = registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
}));
