import { ERROR_LIST } from '@/constants/erros'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import get from 'lodash/get'
import { makeUpdateStudentSaveUserCase } from '@/use-cases/update-student-save/make-update-student-save-use-case'

export async function updateStudentSaveController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateStudentSaveBodySchema = z.object({
    student_id: z.string(),
    saveFileBase64: z.string().optional(),
    time_elapsed: z.number(),
    completion_rate: z.number(),
    track_reference_id: z.string(),
    track_description: z.string().optional(),
    track_name: z.string().optional(),
  })

  const {
    student_id,
    time_elapsed,
    completion_rate,
    saveFileBase64,
    track_reference_id,
    track_description,
    track_name,
  } = updateStudentSaveBodySchema.parse(request.body)

  try {
    const updateStudentSave = makeUpdateStudentSaveUserCase()

    const { save } = await updateStudentSave.execute({
      completion_rate,
      student_id,
      time_elapsed: BigInt(time_elapsed),
      saveFileBase64,
      track_reference_id,
      track_description,
      track_name,
    })

    if (!save) {
      throw new Error(ERROR_LIST.STUDENT.SAVE_NOT_FOUND)
    }

    const parsedTracks = save.tracks.map((track) => {
      // [ ] - TODO convert to helper functions
      const timePlayed = Number(track.time_played)
      return {
        ...track,
        time_played: timePlayed,
      }
    })

    const totalTimePlayed = Number(save.total_time_played)
    // [ ] - TODO convert to helper functions
    const parsedSave = {
      ...save,
      tracks: parsedTracks,
      total_time_played: totalTimePlayed,
    }

    return reply.status(200).send({
      save: parsedSave,
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
