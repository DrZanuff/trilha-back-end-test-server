import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeEditeCourseUserCase } from '@/use-cases/edit-course/make-edit-course-use-case'

export async function editCourseController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const editBodySchema = z.object({
    teacher_id: z.string(),
    course_id: z.string(),
    course_name: z.string().optional(),
    generateNewCode: z.boolean().optional(),
  })

  const { course_name, teacher_id, course_id, generateNewCode } =
    editBodySchema.parse(request.body)

  try {
    const editCourse = makeEditeCourseUserCase()

    const { course } = await editCourse.execute({
      course_name,
      teacher_id,
      course_id,
      generateNewCode,
    })

    return reply.status(201).send({ course })
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.COURSE.NOT_FOUND) {
      return reply.status(409).send({ errorMessage })
    } else {
      // Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    throw err
  }
}
