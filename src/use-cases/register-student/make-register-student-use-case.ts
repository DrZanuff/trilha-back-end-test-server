import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { RegisterStudentUseCase } from './register-student-use-case'

export function makeRegisterStudentUserCase() {
  const studentRepository = new PrismaStudentRepository()
  const registerTeacher = new RegisterStudentUseCase(studentRepository)

  return registerTeacher
}
