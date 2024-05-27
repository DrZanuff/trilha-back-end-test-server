import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeCreateCourseUserCase } from '@/use-cases/create-course/make-create-course-use-case'

export async function createCourseController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createBodySchema = z.object({
    teacher_id: z.string(),
    course_name: z.string(),
  })

  const { course_name, teacher_id } = createBodySchema.parse(request.body)

  try {
    const createCourse = makeCreateCourseUserCase()

    const { course } = await createCourse.execute({ course_name, teacher_id })

    return reply.status(201).send({ course })
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.TEACHER.NOT_FOUND) {
      return reply.status(409).send({ errorMessage })
    } else {
      // Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    throw err
  }
}
