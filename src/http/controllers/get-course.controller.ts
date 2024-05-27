import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeGetCourseUserCase } from '@/use-cases/get-course-use-case/make-get-course-use-case'

export async function getCourseController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createBodySchema = z.object({
    teacher_id: z.string(),
    course_id: z.string(),
  })

  const { teacher_id, course_id } = createBodySchema.parse(request.body)

  if (!teacher_id || !course_id) {
    throw new Error(ERROR_LIST.COURSE.INVALID_PARAMETERS)
  }

  try {
    const getCourse = makeGetCourseUserCase()

    const { course } = await getCourse.execute({ course_id, teacher_id })

    return reply.status(200).send({ course })
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.COURSE.NOT_FOUND) {
      return reply.status(409).send({ errorMessage })
    } else if (errorMessage === ERROR_LIST.COURSE.INVALID_PARAMETERS) {
      return reply.status(400).send({ errorMessage })
    } else {
      // Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    throw err
  }
}
