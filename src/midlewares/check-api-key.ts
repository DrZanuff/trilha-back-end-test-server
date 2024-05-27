import { FastifyReply, FastifyRequest } from 'fastify'
import { env } from '@/env'

export async function checkApiKey(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiKey = request.headers['api-key']

  if (env.API_KEY !== apiKey) {
    return reply.status(401).send({
      error: 'Unauthorized API key.',
    })
  }
}
