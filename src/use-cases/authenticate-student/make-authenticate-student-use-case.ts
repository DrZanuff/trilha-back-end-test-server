import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { AuthenticateStudentUseCase } from './authenticate-student-use-case'

export function makeAuthenticateStudentUserCase() {
  const studentRepository = new PrismaStudentRepository()
  const courseRepository = new PrismaCourseRepository()
  const authenticateStudent = new AuthenticateStudentUseCase(
    studentRepository,
    courseRepository
  )

  return authenticateStudent
}
