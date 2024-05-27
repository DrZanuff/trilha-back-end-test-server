import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(cookie)
app.register(appRoutes)
app.addHook('onRequest', (request, reply, done) => {
  // Permitir solicitações de qualquer origem
  reply.header(
    'Access-Control-Allow-Origin',
    env.NODE_ENV === 'dev' ? 'http://localhost:5173' : env.ALLOWED_DOMAIN
  )
  // Permitir solicitações com os métodos listados
  reply.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  )
  // Permitir cabeçalhos especificados
  reply.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, api-key'
  )
  // Permitir credenciais (cookies, tokens, etc.)
  reply.header('Access-Control-Allow-Credentials', 'true')
  // Se for uma solicitação OPTIONS, envie uma resposta vazia (200 OK)
  if (request.method === 'OPTIONS') {
    reply.status(200).send()
  } else {
    done()
  }
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
