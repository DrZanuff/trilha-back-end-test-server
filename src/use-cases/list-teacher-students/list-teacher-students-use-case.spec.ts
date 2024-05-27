import { expect, describe, it, beforeEach } from 'vitest'
import { ListTeacherStudentsUseCase } from '@/use-cases/list-teacher-students'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'

let inMemoryCourses: InMemoryCourseRepository
let listTeacherStudents: ListTeacherStudentsUseCase

const teacher_id = 'teacher-id'

describe('List Teacher Students User Case', () => {
  beforeEach(async () => {
    inMemoryCourses = new InMemoryCourseRepository()
    listTeacherStudents = new ListTeacherStudentsUseCase(inMemoryCourses)

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
          students: [
            {
              email: 'student.01@gmail.com',
              id: 'student-01-id',
              password_hash: 'student-hash-01',
              session_id: null,
              student_name: 'Student 01',
              user_cfg: null,
            },
            {
              email: 'student.02@gmail.com',
              id: 'student-02-id',
              password_hash: 'student-hash-02',
              session_id: null,
              student_name: 'Student 02',
              user_cfg: null,
            },
          ],
          teacher_id,
        },
        {
          code: 'code2',
          course_name: 'Course 2',
          id: 'code-2-id',
          students: [
            {
              email: 'student.03@gmail.com',
              id: 'student-03-id',
              password_hash: 'student-hash-03',
              session_id: null,
              student_name: 'Student 03',
              user_cfg: null,
            },
          ],
          teacher_id,
        },
      ],
    })
  })

  it('should be able to list a teacher students', async () => {
    const { students } = await listTeacherStudents.execute({
      teacher_id,
    })

    expect(students).toHaveLength(3)
  })
})
