import { PrismaTeacherRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { RegisterTeacherUseCase } from './register-teacher-use-case'

export function makeRegisterTeacherUserCase() {
  const teacherRepository = new PrismaTeacherRepository()
  const registerTeacher = new RegisterTeacherUseCase(teacherRepository)

  return registerTeacher
}
