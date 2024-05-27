import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeRegisterStudentUserCase } from '@/use-cases/register-student/make-register-student-use-case'

export async function registerStudentController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerStudent = makeRegisterStudentUserCase()

    await registerStudent.execute({ name, email, password })
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.STUDENT.EMAIL_ALREADY_EXISTS) {
      return reply.status(409).send({ errorMessage })
    } else {
      // Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    throw err
  }

  return reply.status(201).send()
}
