import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { GetStudentByCourseUseCase } from './get-student-by-course-use-case'

export function makeGetSudentByCourseUserCase() {
  const studentRepository = new PrismaStudentRepository()
  const getStudentByCourse = new GetStudentByCourseUseCase(studentRepository)

  return getStudentByCourse
}
