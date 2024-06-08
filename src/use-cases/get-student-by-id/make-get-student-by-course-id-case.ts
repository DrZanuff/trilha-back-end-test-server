import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { GetStudentByIDUseCase } from './get-student-by-id-use-case'

export function makeGetSudentByIDUserCase() {
  const studentRepository = new PrismaStudentRepository()
  const getStudentByID = new GetStudentByIDUseCase(studentRepository)

  return getStudentByID
}
