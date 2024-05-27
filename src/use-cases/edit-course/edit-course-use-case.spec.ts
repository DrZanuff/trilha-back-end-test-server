import { expect, describe, it, beforeEach } from 'vitest'
import { EditCourseUseCase } from '@/use-cases/edit-course'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'
import { InMemoryTeacherRepository } from '@/repositories/in-memory/in-memory-teachers.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryCourses: InMemoryCourseRepository
let inMemoryTeachers: InMemoryTeacherRepository
let editCourse: EditCourseUseCase

const teacher_id = 'teacher-id'

describe('Edit Course User Case', () => {
  beforeEach(async () => {
    inMemoryCourses = new InMemoryCourseRepository()
    inMemoryTeachers = new InMemoryTeacherRepository()
    editCourse = new EditCourseUseCase(inMemoryCourses, inMemoryTeachers)

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
  })

  it('should be able to edit a course name', async () => {
    const { course } = await editCourse.execute({
      teacher_id,
      course_id: 'course-id-1',
      course_name: 'New Course Name',
    })

    expect(course.course_name).toBe('New Course Name')
    expect(course.teacher_id).toBe(teacher_id)
  })

  it('should be able to generate a new course code', async () => {
    const { course } = await editCourse.execute({
      teacher_id,
      course_id: 'course-id-1',
      generateNewCode: true,
    })

    expect(course.code).not.toBe('course-id-1')
  })

  it('should not be able to edit a course with a invalid teacher_id', async () => {
    let messageError = ''

    try {
      await editCourse.execute({
        teacher_id: 'invalid-teacher-id',
        course_name: 'Course Invalid Teacher ID',
        course_id: 'course-id-1',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.COURSE.NOT_FOUND)).toBe(true)
  })

  it('should not be able to edit a course with a invalid course-id', async () => {
    let messageError = ''

    try {
      await editCourse.execute({
        teacher_id,
        course_name: 'Course Invalid Course ID',
        course_id: 'invalid-course-code-1',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.COURSE.NOT_FOUND)).toBe(true)
  })
})
