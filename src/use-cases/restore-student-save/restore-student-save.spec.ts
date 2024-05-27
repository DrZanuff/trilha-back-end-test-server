import { expect, describe, it, beforeEach } from 'vitest'
import { RestoreStudentSaveUseCase } from './restore-student-save'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-student.repository'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'

import { ERROR_LIST } from '@/constants/erros'

let inMemoryStudents: InMemoryStudentRepository
let inMemoryCourses: InMemoryCourseRepository
let restoreSave: RestoreStudentSaveUseCase

describe('Restore Student Save User Case', () => {
  beforeEach(() => {
    inMemoryStudents = new InMemoryStudentRepository()
    inMemoryCourses = new InMemoryCourseRepository()
    restoreSave = new RestoreStudentSaveUseCase(inMemoryStudents)

    inMemoryCourses.teachers.push({
      email: 'teacher1@gmail.com',
      id: 'teacher1-id',
      password_hash: 'teacher1-hash',
      phone: null,
      subject: null,
      school: null,
      session_id: 'teacher1-session-id',
      teacher_name: 'Teacher 1',
      courses: [
        {
          code: 'course1-code',
          course_name: 'Course Name',
          created_at: null,
          id: 'course1-id',
          students: [
            {
              email: 'user1@gmail.gmail',
              id: 'user1-id',
              password_hash: 'user1-hash',
              session_id: 'user1-session-id',
              student_name: 'User 1',
              user_cfg: null,
            },
          ],
          teacher_id: 'teacher1-id',
        },
      ],
    })
    inMemoryStudents.students.push({
      email: 'user1@gmail.gmail',
      id: 'user1-id',
      password_hash: 'user1-hash',
      session_id: 'user1-session-id',
      student_name: 'User 1',
      user_cfg: null,
      save: {
        experience: 0,
        game_save: 'base64-save',
        id: 'personal-save1-id',
        player_level: 0,
        student_id: 'user1-id',
        total_time_played: 0,
        tracks: [
          {
            completion_rate: 0,
            description: 'Track 01',
            id: 'track-01-id',
            name: 'track01',
            saveId: 'personal-save1-id',
            time_played: 0,
            track_reference_id: 'track-reference-id-01',
          },
        ],
      },
    })
  })

  it('should be able to restore a save', async () => {
    const { save } = await restoreSave.execute({ student_id: 'user1-id' })

    expect(save.student_id).toBe('user1-id')
    expect(save.id).toBe('personal-save1-id')
  })

  it('should not be able to restore a save with an invalid user-id', async () => {
    let messageError = ''

    try {
      await restoreSave.execute({
        student_id: 'invalid-user-id',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.NOT_FOUND)).toBe(true)
  })
})
