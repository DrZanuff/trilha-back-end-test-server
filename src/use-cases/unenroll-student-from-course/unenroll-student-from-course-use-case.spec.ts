import { expect, describe, it, beforeEach } from 'vitest'
import { UnenrollStudentFromCourseUseCase } from './unenroll-student-from-course-use-case'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-student.repository'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryStudents: InMemoryStudentRepository
let inMemoryCourses: InMemoryCourseRepository
let unenrollStudentFromCourse: UnenrollStudentFromCourseUseCase

function generateMockStudent(numberID: string) {
  return {
    email: `student${numberID}@gmail.com`,
    id: `student-${numberID}-id`,
    password_hash: 'hash',
    session_id: `session_${numberID}-id`,
    student_name: `Student ${numberID}`,
    user_cfg: null,
    save: {
      current_track: `Track ${numberID}`,
      experience: 0,
      game_save: null,
      id: `save-${numberID}-id`,
      player_level: 0,
      student_id: `student-${numberID}-id`,
      total_time_played: 0,
      tracks: [],
    },
  }
}

describe('Unenroll Student from Course User Case', () => {
  beforeEach(() => {
    inMemoryStudents = new InMemoryStudentRepository()
    inMemoryCourses = new InMemoryCourseRepository()
    unenrollStudentFromCourse = new UnenrollStudentFromCourseUseCase(
      inMemoryStudents,
      inMemoryCourses
    )

    inMemoryStudents.students.push(
      generateMockStudent('01'),
      generateMockStudent('02'),
      generateMockStudent('03'),
      generateMockStudent('04'),
      generateMockStudent('05'),
      generateMockStudent('06'),
      generateMockStudent('07'),
      generateMockStudent('08')
    )

    inMemoryCourses.students.push(
      generateMockStudent('01'),
      generateMockStudent('02'),
      generateMockStudent('03'),
      generateMockStudent('04'),
      generateMockStudent('05'),
      generateMockStudent('06'),
      generateMockStudent('07'),
      generateMockStudent('08')
    )
    inMemoryCourses.teachers.push(
      {
        email: 'teacher01@gmail.com',
        id: 'teacher-01',
        password_hash: 'hash',
        phone: null,
        school: null,
        subject: null,
        session_id: 'session_id',
        teacher_name: 'Teacher 01',
        courses: [
          {
            code: 'teacher-01-course-01-code',
            course_name: 'Teacher 01 Course 01',
            created_at: null,
            id: 'teacher-01-course-01-id',
            teacher_id: 'teacher-01',
            students: [generateMockStudent('01'), generateMockStudent('02')],
          },
          {
            code: 'teacher-01-course-02-code',
            course_name: 'Teacher 01 Course 02',
            created_at: null,
            id: 'teacher-01-course-02-id',
            teacher_id: 'teacher-01',
            students: [generateMockStudent('03'), generateMockStudent('04')],
          },
        ],
      },
      {
        email: 'teacher02@gmail.com',
        id: 'teacher-02',
        password_hash: 'hash',
        phone: null,
        school: null,
        subject: null,
        session_id: 'session_id',
        teacher_name: 'Teacher 02',
        courses: [
          {
            code: 'teacher-02-course-01-code',
            course_name: 'Teacher 02 Course 01',
            created_at: null,
            id: 'teacher-02-course-01-id',
            teacher_id: 'teacher-02',
            students: [generateMockStudent('05'), generateMockStudent('06')],
          },
          {
            code: 'teacher-02-course-02-code',
            course_name: 'Teacher 02 Course 02',
            created_at: null,
            id: 'teacher-02-course-02-id',
            teacher_id: 'teacher-02',
            students: [generateMockStudent('07'), generateMockStudent('08')],
          },
        ],
      }
    )
  })

  it('should be able to unenroll a student', async () => {
    const isUnenrollmentSuccessful = await unenrollStudentFromCourse.execute({
      course_id: 'teacher-01-course-01-id',
      student_id: 'student-01-id',
    })

    expect(isUnenrollmentSuccessful).toBe(true)
  })

  it('should be not able to unenroll an invalid student', async () => {
    let messageError = ''

    try {
      await unenrollStudentFromCourse.execute({
        course_id: 'teacher-01-course-01-id',
        student_id: 'student-xx-id',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.NOT_FOUND)).toBe(true)
  })

  it('should be not able to unenroll from an invalid course', async () => {
    let messageError = ''

    try {
      await unenrollStudentFromCourse.execute({
        course_id: 'teacher-xx-course-01-id',
        student_id: 'student-01-id',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.COURSE.NOT_FOUND)).toBe(true)
  })
})
