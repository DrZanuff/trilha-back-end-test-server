import { ERROR_LIST } from '@/constants/erros'
import { IStudentRepository } from '@/repositories/students.repository.types'
import { ICourseRepository } from '@/repositories/courses.repository.types'
import { compare } from 'bcryptjs'
import { Course } from '@prisma/client'

export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private courseRepository: ICourseRepository
  ) {}

  async execute({
    email,
    password,
    code,
  }: {
    email: string
    password: string
    code?: string
  }) {
    const student = await this.studentRepository.findByUniqueEmail({ email })

    if (!student) {
      throw new Error(ERROR_LIST.STUDENT.INVALID_CREDENTIALS)
    }

    const isPasswordCorrect = await compare(password, student.password_hash)

    if (!isPasswordCorrect) {
      throw new Error(ERROR_LIST.STUDENT.INVALID_CREDENTIALS)
    }

    let course: Course | null | undefined
    if (code) {
      course = await this.courseRepository.findCourseByCode({ code })

      if (!course) {
        throw new Error(ERROR_LIST.COURSE.NOT_FOUND)
      }
    }

    const studentWithNewSessionID =
      await this.studentRepository.updateSessionID({ id: student.id })

    if (!studentWithNewSessionID) {
      throw new Error(ERROR_LIST.STUDENT.INVALID_CREDENTIALS)
    }

    if (course) {
      await this.courseRepository.enrollStudent({
        course_id: String(course?.id),
        student_id: student.id,
      })
    }

    return {
      student: {
        ...studentWithNewSessionID,
        course: course || undefined,
      },
    }
  }
}
