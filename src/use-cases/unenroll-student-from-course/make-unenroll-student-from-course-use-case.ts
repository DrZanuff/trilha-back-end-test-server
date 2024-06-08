import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { UnenrollStudentFromCourseUseCase } from './unenroll-student-from-course-use-case'

export function makeUnenrollStudentFromCourseUseCase() {
  const studentRepository = new PrismaStudentRepository()
  const courseRepository = new PrismaCourseRepository()
  const unenrollStudent = new UnenrollStudentFromCourseUseCase(
    studentRepository,
    courseRepository
  )

  return unenrollStudent
}
