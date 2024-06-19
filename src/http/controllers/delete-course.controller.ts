import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeDeleteCourseUserCase } from '@/use-cases/delete-course/make-delete-course-use-case'

export async function deleteCourseController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteBodySchema = z.object({
    teacher_id: z.string(),
    course_id: z.string(),
  })

  const { teacher_id, course_id } = deleteBodySchema.parse(request.body)

  try {
    const deleteCourse = makeDeleteCourseUserCase()

    await deleteCourse.execute({
      teacher_id,
      course_id,
    })

    return reply.status(204).send()
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (
      errorMessage === ERROR_LIST.COURSE.NOT_FOUND ||
      errorMessage === ERROR_LIST.TEACHER.NOT_FOUND
    ) {
      return reply.status(409).send({ errorMessage })
    } else {
      // Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    throw err
  }
}
