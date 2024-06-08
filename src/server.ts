import { app } from '@/app'
import { env } from '@/env'
import { CURRENT_VERSION } from './constants/version'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running. Version:${CURRENT_VERSION}`)
  })
