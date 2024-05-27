import { PrismaTeacherRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { LogoutTeacherUserCase } from './logout-teacher-use-case'

export function makeLogoutTeacherUserCase() {
  const teacherRepository = new PrismaTeacherRepository()
  const logoutTeacher = new LogoutTeacherUserCase(teacherRepository)

  return logoutTeacher
}
