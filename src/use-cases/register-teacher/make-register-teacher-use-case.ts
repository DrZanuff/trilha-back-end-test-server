import { getTeacherRepository } from '../helpers/get-teacher-repository'
import { RegisterTeacherUseCase } from './register-teacher-use-case'

export function makeRegisterTeacherUserCase() {
  const teacherRepository = getTeacherRepository()
  const registerTeacher = new RegisterTeacherUseCase(teacherRepository)

  return registerTeacher
}
