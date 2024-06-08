import { expect, describe, it, beforeEach } from 'vitest'
import { GetStudentByIDUseCase } from './get-student-by-id-use-case'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-student.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryStudents: InMemoryStudentRepository
let getStudentByID: GetStudentByIDUseCase

describe('Get Student User Case', () => {
  beforeEach(() => {
    inMemoryStudents = new InMemoryStudentRepository()
    getStudentByID = new GetStudentByIDUseCase(inMemoryStudents)

    inMemoryStudents.students.push({
      email: 'student@gmail.com',
      id: 'student-id',
      password_hash: 'hashed-password',
      session_id: 'session-id',
      student_name: 'Student',
      user_cfg: null,
      save: {
        current_track: 'Track 01',
        experience: 0,
        game_save: null,
        id: 'save-id',
        player_level: 0,
        student_id: 'student-id',
        total_time_played: 0,
        tracks: [
          {
            completion_rate: 0,
            description: 'Track 01 Descriptions',
            id: 'track-01',
            name: 'Track 01',
            saveId: 'save-id',
            time_played: 0,
            track_reference_id: 'track-reference-id',
          },
        ],
      },
    })
  })

  it('should be able to get a student by course', async () => {
    const { student } = await getStudentByID.execute({
      student_id: 'student-id',
    })

    expect(student.id).toBe('student-id')
    expect(student.student_name).toBe('Student')
    expect(student.save).toBe('save-id')
  })

  it('should be able to get a student save by course including the tracks', async () => {
    const { student } = await getStudentByID.execute({
      student_id: 'student-id',
    })

    expect(student.id).toBe('student-id')
    expect(student.student_name).toBe('Student')
    expect(student.save?.tracks).toBeGreaterThan(0)
  })

  it('should not be able to get a non-existent student by course', async () => {
    let messageError = ''

    try {
      await getStudentByID.execute({
        student_id: 'invalid-id',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.NOT_FOUND)).toBe(true)
  })
})
