import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeListTeacherCoursesUserCase } from '@/use-cases/list-teacher-courses/make-list-teacher-courses-use-case'

export async function listTeacherCoursesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const listBodySchema = z.object({
    teacher_id: z.string(),
  })

  const { teacher_id } = listBodySchema.parse(request.body)

  try {
    const listTeacherCourses = makeListTeacherCoursesUserCase()

    const { courses } = await listTeacherCourses.execute({ teacher_id })

    return reply.status(200).send({ courses })
  } catch (err) {
    const errorMessage = get(err, 'message')
    return reply
      .status(500)
      .send({ errorMessage, context: ERROR_LIST.UNKNOWN_ERROR })
  }
}
