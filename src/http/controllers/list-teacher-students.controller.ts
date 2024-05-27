import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeListTeacherStudentsUserCase } from '@/use-cases/list-teacher-students/make-list-teacher-students-use-case'

export async function listTeacherStudentsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const listBodySchema = z.object({
    teacher_id: z.string(),
  })

  const { teacher_id } = listBodySchema.parse(request.body)

  try {
    const listTeacherStudents = makeListTeacherStudentsUserCase()

    const { students } = await listTeacherStudents.execute({ teacher_id })

    return reply.status(200).send({ students })
  } catch (err) {
    const errorMessage = get(err, 'message')
    return reply
      .status(500)
      .send({ errorMessage, context: ERROR_LIST.UNKNOWN_ERROR })
  }
}
