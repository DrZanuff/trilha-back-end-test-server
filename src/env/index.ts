import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  API_KEY: z.string(),
  ALLOWED_DOMAIN: z.string(),
  DATABASE_URL: z.string(),
  DATA_BASE_TYPE: z.enum(['PRISMA', 'SUPABASE']).default('PRISMA'),
  SUPABASE_KEY: z.string().optional(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid env variables', _env.error.format())

  throw new Error('Invalid env variables')
}

export const env = _env.data
