import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeGetSudentByCourseUserCase } from '@/use-cases/get-student-by-course/make-get-student-by-course-use-case'

export async function getStudentByCourseController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getStudentByCourseBodySchema = z.object({
    student_id: z.string(),
    course_id: z.string(),
  })

  const { course_id, student_id } = getStudentByCourseBodySchema.parse(
    request.body
  )

  try {
    const getStudentByCourse = makeGetSudentByCourseUserCase()

    const { student, save } = await getStudentByCourse.execute({
      student_id,
      course_id,
    })

    return reply.status(200).send({
      student,
      save,
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
