import { AuthenticateTeacherUseCase } from './authenticate-teacher-use-case'
import { getTeacherRepository } from '../helpers/get-teacher-repository'

export function makeAuthenticateTeacherUserCase() {
  const teacherRepository = getTeacherRepository()
  const authenticateTeacher = new AuthenticateTeacherUseCase(teacherRepository)

  return authenticateTeacher
}
