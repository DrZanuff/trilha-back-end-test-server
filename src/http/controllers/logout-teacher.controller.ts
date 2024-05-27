import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeLogoutTeacherUserCase } from '@/use-cases/logout-teacher/make-logout-teacher-use-case'

export async function LogoutTeacherController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const LogoutBodySchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = LogoutBodySchema.parse(request.body)

  try {
    const LogoutTeacher = makeLogoutTeacherUserCase()

    await LogoutTeacher.execute({ id })

    reply.cookie('session_id', '', {
      maxAge: 0,
    })

    return reply.status(200).send()
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.TEACHER.NOT_FOUND) {
      return reply.status(401).send({ errorMessage })
    } else {
      // Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    throw err
  }
}
