import { PrismaTeacherRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { AuthenticateTeacherUseCase } from './authenticate-teacher-use-case'

export function makeAuthenticateTeacherUserCase() {
  const teacherRepository = new PrismaTeacherRepository()
  const authenticateTeacher = new AuthenticateTeacherUseCase(teacherRepository)

  return authenticateTeacher
}
