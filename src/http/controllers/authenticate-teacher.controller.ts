import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeAuthenticateTeacherUserCase } from '@/use-cases/authenticate-teacher/make-authenticate-teacher-use-case'

export async function AuthenticateTeacherController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateTeacher = makeAuthenticateTeacherUserCase()

    const { teacher } = await authenticateTeacher.execute({ email, password })

    if (teacher.session_id) {
      reply.cookie('session_id', teacher.session_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return reply.status(200).send({
      teacher: {
        email: teacher.email,
        teacher_name: teacher.teacher_name,
        id: teacher.id,
        phone: teacher.phone,
        school: teacher.school,
        subject: teacher.subject,
      },
    })
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.TEACHER.INVALID_CREDENTIALS) {
      return reply.status(401).send({ errorMessage })
    } else {
      // Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    throw err
  }
}
