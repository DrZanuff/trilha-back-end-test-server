import { expect, describe, it, beforeEach } from 'vitest'
import { GetCourseUseCase } from '@/use-cases/get-course-use-case'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryCourses: InMemoryCourseRepository
let getCourse: GetCourseUseCase

const teacher_id = 'teacher-id'

describe('Create Course User Case', () => {
  beforeEach(async () => {
    inMemoryCourses = new InMemoryCourseRepository()
    getCourse = new GetCourseUseCase(inMemoryCourses)

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
          course_name: 'Course-01',
          students: [],
          teacher_id,
          id: 'course-01',
          created_at: new Date(),
        },
        {
          code: 'course-code-2',
          course_name: 'Course-02',
          students: [],
          teacher_id,
          id: 'course-02',
          created_at: new Date(),
        },
      ],
    })
  })

  it('should be able to get a course', async () => {
    const { course } = await getCourse.execute({
      course_id: 'course-01',
      teacher_id,
    })

    expect(course.id).toBe('course-01')
    expect(course.teacher_id).toBe(teacher_id)
  })

  it('should not be able to get a course with a non-matching teacher-id ', async () => {
    inMemoryCourses.teachers.push({
      email: 'teache-02r@gmail.com',
      teacher_name: 'teacher-02',
      password_hash: '101010',
      id: 'teacher-id-03',
      phone: null,
      school: null,
      session_id: null,
      subject: null,
      courses: [
        {
          code: 'course-code-3',
          course_name: 'Course-03',
          students: [],
          teacher_id: 'teacher-id-03',
          id: 'course-03',
          created_at: new Date(),
        },
      ],
    })

    let messageError = ''

    try {
      await getCourse.execute({
        course_id: 'course-03',
        teacher_id,
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.COURSE.NON_EXISTENT)).toBe(true)
  })
})
