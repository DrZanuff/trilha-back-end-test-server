import { LogoutTeacherUserCase } from './logout-teacher-use-case'
import { getTeacherRepository } from '../helpers/get-teacher-repository'

export function makeLogoutTeacherUserCase() {
  const teacherRepository = getTeacherRepository()
  const logoutTeacher = new LogoutTeacherUserCase(teacherRepository)

  return logoutTeacher
}
