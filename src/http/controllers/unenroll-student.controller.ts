import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeUnenrollStudentFromCourseUseCase } from '@/use-cases/unenroll-student-from-course/make-unenroll-student-from-course-use-case'

export async function UnenrollStudentFromCourseController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    student_id: z.string(),
    course_id: z.string(),
  })

  const { course_id, student_id } = authenticateBodySchema.parse(request.body)

  try {
    const unenrollStudent = makeUnenrollStudentFromCourseUseCase()

    await unenrollStudent.execute({ course_id, student_id })

    return reply.status(204).send()
  } catch (err) {
    const errorMessage = get(err, 'message')
    if (
      errorMessage === ERROR_LIST.COURSE.NOT_FOUND ||
      errorMessage === ERROR_LIST.STUDENT.NOT_FOUND ||
      errorMessage === ERROR_LIST.COURSE.UNENROLLMENT_FAILED
    ) {
      return reply.status(401).send({ errorMessage })
    } else {
      // Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    throw err
  }
}
