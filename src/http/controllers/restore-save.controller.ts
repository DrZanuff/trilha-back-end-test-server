import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeRestoreStudentSaveUserCase } from '@/use-cases/restore-student-save/make-restore-student-save-use-case'

export async function restoreStudentSaveController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const restoreStudentSaveBodySchema = z.object({
    student_id: z.string().uuid(),
  })

  const { student_id } = restoreStudentSaveBodySchema.parse(request.body)

  try {
    const restoreStudentSave = makeRestoreStudentSaveUserCase()

    const { save } = await restoreStudentSave.execute({
      student_id,
    })

    if (!save) {
      throw new Error(ERROR_LIST.STUDENT.SAVE_NOT_FOUND)
    }

    return reply.status(200).send({
      save,
    })
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.STUDENT.SAVE_NOT_FOUND) {
      return reply.status(401).send({ errorMessage })
    }

    // Here we should log to an external tool like DataDog/NewRelic/Sentry

    throw err
  }
}
