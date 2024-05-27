import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { LogoutStudentUserCase } from './logout-student-use-case'

export function makeLogoutStudentUserCase() {
  const studentRepository = new PrismaStudentRepository()
  const logoutStudent = new LogoutStudentUserCase(studentRepository)

  return logoutStudent
}
