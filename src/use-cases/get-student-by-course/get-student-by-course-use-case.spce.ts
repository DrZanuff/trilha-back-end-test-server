import { expect, describe, it, beforeEach } from 'vitest'
import { GetStudentByCourseUseCase } from './get-student-by-course-use-case'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-student.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryStudents: InMemoryStudentRepository
let getStudentByCourse: GetStudentByCourseUseCase

describe('Get Student User Case', () => {
  beforeEach(() => {
    inMemoryStudents = new InMemoryStudentRepository()
    getStudentByCourse = new GetStudentByCourseUseCase(inMemoryStudents)

    inMemoryStudents.students.push({
      email: 'student@gmail.com',
      id: 'student-id',
      password_hash: 'hashed-password',
      session_id: 'session-id',
      skin_level: 'DEFAULT',
      student_name: 'Student',
      user_cfg: null,
      saves: [
        {
          course_id: 'course-id',
          current_quest: 'QUEST_01',
          experience: 0,
          id: 'save-id',
          player_level: 0,
          save_type: 'COURSE',
          student_id: 'student-id',
          teacher_id: 'teacher-id',
          total_time_played: 100,
          game_save: null,
          quests: [
            {
              completed_at: null,
              completion_rate: 80,
              id: 'quest-1-id',
              quest: 'QUEST_01',
              save_id: 'save-id',
              started_at: new Date(),
              time_played: 60,
            },
            {
              completed_at: null,
              completion_rate: 30,
              id: 'quest-2-id',
              quest: 'QUEST_02',
              save_id: 'save-id',
              started_at: new Date(),
              time_played: 40,
            },
          ],
        },
      ],
    })
  })

  it('should be able to get a student by course', async () => {
    const { save, student } = await getStudentByCourse.execute({
      student_id: 'student-id',
      course_id: 'course-id',
    })

    expect(student.id).toBe('student-id')
    expect(student.student_name).toBe('Student')
    expect(save?.course_id).toBe('course-id')
  })

  it('should be able to get a student save by course including the quests', async () => {
    const { save, student } = await getStudentByCourse.execute({
      student_id: 'student-id',
      course_id: 'course-id',
    })

    expect(student.id).toBe('student-id')
    expect(student.student_name).toBe('Student')
    expect(save?.quests?.length).toBeGreaterThan(0)
  })

  it('should not be able to get a non-existent student by course', async () => {
    await getStudentByCourse.execute({
      student_id: 'invalid-id',
      course_id: 'course-id',
    })

    let messageError = ''

    try {
      await getStudentByCourse.execute({
        student_id: 'invalid-id',
        course_id: 'course-id',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.NOT_FOUND)).toBe(true)
  })
})
