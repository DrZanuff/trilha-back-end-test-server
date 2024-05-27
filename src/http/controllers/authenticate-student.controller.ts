import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeAuthenticateStudentUserCase } from '@/use-cases/authenticate-student/make-authenticate-student-use-case'

export async function AuthenticateStudentController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    code: z.string().optional(),
  })

  const { email, password, code } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateStudent = makeAuthenticateStudentUserCase()

    const { student } = await authenticateStudent.execute({
      email,
      password,
      code,
    })

    if (student.session_id) {
      reply.cookie('session_id', student.session_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return reply.status(200).send({
      student: {
        email: student.email,
        student_name: student.student_name,
        id: student.id,
        session_id: student.session_id,
        course: student.course,
        save: student.save,
      },
    })
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.STUDENT.INVALID_CREDENTIALS) {
      return reply.status(401).send({ errorMessage })
    }
    if (errorMessage === ERROR_LIST.COURSE.NOT_FOUND) {
      return reply.status(401).send({ errorMessage })
    }

    // Here we should log to an external tool like DataDog/NewRelic/Sentry

    throw err
  }
}
