import { expect, describe, it, beforeEach } from 'vitest'
import { CreateCourseUseCase } from '@/use-cases/create-course'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryCourses: InMemoryCourseRepository
let createCourse: CreateCourseUseCase

const teacher_id = 'teacher-id'

describe('Create Course User Case', () => {
  beforeEach(async () => {
    inMemoryCourses = new InMemoryCourseRepository()
    createCourse = new CreateCourseUseCase(inMemoryCourses)

    inMemoryCourses.teachers.push({
      email: 'teache-01r@gmail.com',
      teacher_name: 'teacher-01',
      password_hash: '101010',
      id: teacher_id,
      phone: null,
      school: null,
      session_id: null,
      subject: null,
      courses: [],
    })
  })

  it('should be able to create a course', async () => {
    const { course } = await createCourse.execute({
      teacher_id,
      course_name: 'Course-01',
    })

    expect(course.course_name).toBe('Course-01')
    expect(course.teacher_id).toBe(teacher_id)
  })

  it('should be able to create courses with unique codes', async () => {
    const course1 = await createCourse.execute({
      teacher_id,
      course_name: 'Course-01',
    })

    const course2 = await createCourse.execute({
      teacher_id,
      course_name: 'Course-02',
    })

    expect(course1.course.code).not.toBe(course2.course.code)
  })

  it('should not be able to create a course with a invalid teacher_id', async () => {
    let messageError = ''

    try {
      await createCourse.execute({
        teacher_id: 'invalid-teacher-id',
        course_name: 'Course-1',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.TEACHER.NOT_FOUND)).toBe(true)
  })
})
