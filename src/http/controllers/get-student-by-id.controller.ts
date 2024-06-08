import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeGetSudentByIDUserCase } from '@/use-cases/get-student-by-id/make-get-student-by-course-id-case'

export async function getStudentByIDController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getStudentByCourseBodySchema = z.object({
    student_id: z.string(),
  })

  const { student_id } = getStudentByCourseBodySchema.parse(request.body)

  try {
    const getStudentByID = makeGetSudentByIDUserCase()

    const { student } = await getStudentByID.execute({
      student_id,
    })

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password_hash,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      user_cfg,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      session_id,
      ...studentWithoutPersonalData
    } = student

    return reply.status(200).send({
      student: studentWithoutPersonalData,
    })
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (errorMessage === ERROR_LIST.STUDENT.NOT_FOUND) {
      return reply.status(401).send({ errorMessage })
    }
    // Here we should log to an external tool like DataDog/NewRelic/Sentry

    throw err
  }
}
