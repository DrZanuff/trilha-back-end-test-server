import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateStudentUseCase } from './authenticate-student-use-case'
import { RegisterStudentUseCase } from '@/use-cases/register-student'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-student.repository'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'
import { ERROR_LIST } from '@/constants/erros'
import { hash } from 'bcryptjs'

let inMemoryStudents: InMemoryStudentRepository
let inMemoryCourses: InMemoryCourseRepository
let authenticateStudent: AuthenticateStudentUseCase
let registerStudent: RegisterStudentUseCase

describe('Authenticate Student User Case', () => {
  beforeEach(() => {
    inMemoryStudents = new InMemoryStudentRepository()
    inMemoryCourses = new InMemoryCourseRepository()
    authenticateStudent = new AuthenticateStudentUseCase(
      inMemoryStudents,
      inMemoryCourses
    )
    registerStudent = new RegisterStudentUseCase(inMemoryStudents)
  })

  it('should be able to authenticate a student', async () => {
    const password = '101010'

    await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    const { student } = await authenticateStudent.execute({
      email: 'user998@gmail',
      password,
    })

    const UUID_REGEX =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

    // expect(user.id).toBe(expect.any(String))
    const isValidUUID = UUID_REGEX.test(student.id)
    expect(isValidUUID).toBe(true)
  })

  it('should not be able to authenticate a student with wrong email', async () => {
    const password = '101010'

    await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    let messageError = ''

    try {
      await authenticateStudent.execute({
        email: 'wrong_user@gmail.com',
        password,
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.INVALID_CREDENTIALS)).toBe(
      true
    )
  })

  it('should not be able to authenticate a student with wrong password', async () => {
    const password = '101010'

    await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    let messageError = ''

    try {
      await authenticateStudent.execute({
        email: 'user998@gmail',
        password: 'wrong_password',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.INVALID_CREDENTIALS)).toBe(
      true
    )
  })

  it('should not be able to authenticate with a non existend student', async () => {
    let messageError = ''

    try {
      await authenticateStudent.execute({
        email: 'user998@gmail',
        password: '101010',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.INVALID_CREDENTIALS)).toBe(
      true
    )
  })

  it('should be able to authenticate a student with a code', async () => {
    const password = '101010'

    await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    const teacher_id = 'teacher-01-id'
    const course_id = 'course-id-01'
    const code = 'course-code-01'

    inMemoryCourses.teachers.push({
      email: 'teacher@gmail.com',
      id: teacher_id,
      password_hash: 'hashed-password',
      phone: null,
      school: null,
      subject: null,
      session_id: null,
      teacher_name: 'Teacher 01',
      courses: [
        {
          code,
          course_name: 'Course 01',
          id: course_id,
          students: [],
          teacher_id,
          created_at: null,
        },
      ],
    })

    const { student } = await authenticateStudent.execute({
      email: 'user998@gmail',
      password,
      code,
    })

    expect(student.course?.id).toBe(course_id)
  })

  it('should not be able to authenticate a student with a invalid code', async () => {
    const password = '101010'

    await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    const teacher_id = 'teacher-01-id'
    const course_id = 'course-id-01'
    const code = 'course-code-01'

    inMemoryCourses.teachers.push({
      email: 'teacher@gmail.com',
      id: teacher_id,
      password_hash: 'hashed-password',
      phone: null,
      school: null,
      subject: null,
      session_id: null,
      teacher_name: 'Teacher 01',
      courses: [
        {
          code,
          course_name: 'Course 01',
          id: course_id,
          students: [],
          teacher_id,
          created_at: null,
        },
      ],
    })

    let errorMessage = ''

    try {
      await authenticateStudent.execute({
        email: 'user998@gmail',
        password,
        code: 'invalid-code',
      })
    } catch (err) {
      errorMessage = String(err)
    }

    expect(errorMessage.includes(ERROR_LIST.COURSE.NOT_FOUND)).toBe(true)
  })

  it('should not enroll a student again on the same course', async () => {
    const password = '101010'
    const hashedPassword = await hash(password, 6)

    await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    const teacher_id = 'teacher-01-id'
    const course_id = 'course-id-01'
    const code = 'course-code-01'

    inMemoryCourses.teachers.push({
      email: 'teacher@gmail.com',
      id: teacher_id,
      password_hash: 'hashed-password',
      phone: null,
      school: null,
      subject: null,
      session_id: null,
      teacher_name: 'Teacher 01',
      courses: [
        {
          code,
          course_name: 'Course 01',
          id: course_id,
          students: [
            {
              email: 'user998@gmail',
              password_hash: hashedPassword,
              id: 'student-id',
              session_id: 'session-id',
              student_name: 'user',
              user_cfg: null,
            },
          ],
          created_at: null,
          teacher_id,
        },
      ],
    })

    await authenticateStudent.execute({
      email: 'user998@gmail',
      password,
      code,
    })

    const teacherWithCourse = inMemoryCourses.teachers.find(
      (teacher) => teacher.id === teacher_id
    )
    const courseWithStudent = teacherWithCourse?.courses?.find(
      (course) => course.id === course_id
    )

    expect(courseWithStudent?.students.length).toBe(1)
  })
})
