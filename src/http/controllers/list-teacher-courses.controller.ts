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

    const parsedCourses = courses.map((course) => {
      // [ ] - TODO - convert to helper functions
      const parsedStudents = course.students?.map((student) => {
        const parsedTracks = student.save?.tracks.map((track) => {
          return {
            ...track,
            time_played: Number(track.time_played),
          }
        })

        return {
          ...student,
          save: {
            ...student.save,
            total_time_played: Number(student.save?.total_time_played),
            tracks: parsedTracks,
          },
        }
      })

      return {
        ...course,
        students: parsedStudents,
      }
    })

    return reply.status(200).send({ courses: parsedCourses })
  } catch (err) {
    const errorMessage = get(err, 'message')
    return reply
      .status(500)
      .send({ errorMessage, context: ERROR_LIST.UNKNOWN_ERROR })
  }
}
