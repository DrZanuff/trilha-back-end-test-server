import { expect, describe, it, beforeEach } from 'vitest'
import { ListTeacherCoursesUseCase } from '@/use-cases/list-teacher-courses'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'

let inMemoryCourses: InMemoryCourseRepository
let listTeacherCourses: ListTeacherCoursesUseCase

const teacher_id = 'teacher-id'

describe('List Teacher Courses User Case', () => {
  beforeEach(async () => {
    inMemoryCourses = new InMemoryCourseRepository()
    listTeacherCourses = new ListTeacherCoursesUseCase(inMemoryCourses)

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
          code: 'code1',
          course_name: 'Course 1',
          id: 'code-1-id',
          students: [],
          teacher_id,
          created_at: null,
        },
        {
          code: 'code2',
          course_name: 'Course 2',
          id: 'code-2-id',
          students: [],
          teacher_id,
          created_at: null,
        },
      ],
    })
  })

  it('should be able to list a teacher courses', async () => {
    const { courses } = await listTeacherCourses.execute({
      teacher_id,
    })

    expect(courses).toHaveLength(2)
  })
})
