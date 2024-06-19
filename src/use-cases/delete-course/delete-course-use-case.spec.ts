import { expect, describe, it, beforeEach } from 'vitest'
import { DeleteCourseUseCase } from '@/use-cases/delete-course'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'
import { InMemoryTeacherRepository } from '@/repositories/in-memory/in-memory-teachers.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryCourses: InMemoryCourseRepository
let inMemoryTeachers: InMemoryTeacherRepository
let deleteCourse: DeleteCourseUseCase

const teacher_id = 'teacher-id'

describe('Delete Course User Case', () => {
  beforeEach(async () => {
    inMemoryCourses = new InMemoryCourseRepository()
    inMemoryTeachers = new InMemoryTeacherRepository()
    deleteCourse = new DeleteCourseUseCase(inMemoryCourses, inMemoryTeachers)

    inMemoryCourses.teachers.push({
      email: 'teache-01r@gmail.com',
      teacher_name: 'teacher-01',
      password_hash: '101010',
      id: teacher_id,
      phone: null,
      school: null,
      session_id: null,
      subject: null,
      courses: [
        {
          code: 'course-code-1',
          course_name: 'Course 1',
          created_at: new Date(),
          id: 'course-id-1',
          students: [],
          teacher_id,
        },
      ],
    })

    inMemoryTeachers.items.push({
      email: 'teache-01r@gmail.com',
      teacher_name: 'teacher-01',
      password_hash: '101010',
      id: teacher_id,
      phone: null,
      school: null,
      session_id: null,
      subject: null,
      courses: [
        {
          code: 'course-code-1',
          course_name: 'Course 1',
          created_at: new Date(),
          id: 'course-id-1',
          teacher_id,
        },
      ],
    })
  })

  it('should be able to delete a course name', async () => {
    const isSuccessfullyDeleted = await deleteCourse.execute({
      teacher_id,
      course_id: 'course-id-1',
    })

    expect(isSuccessfullyDeleted).toBe(true)
  })

  it('should not be able to delete a course with a invalid teacher_id', async () => {
    let messageError = ''

    try {
      await deleteCourse.execute({
        teacher_id: 'invalid-teacher-id',
        course_id: 'course-id-1',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.TEACHER.NOT_FOUND)).toBe(true)
  })

  it('should not be able to delete a course with a invalid course-id', async () => {
    let messageError = ''

    try {
      await deleteCourse.execute({
        teacher_id,
        course_id: 'invalid-course-code-1',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.COURSE.NOT_FOUND)).toBe(true)
  })
})
