import { LogoutStudentUserCase } from './logout-student-use-case'
import { getStudentRepository } from '../helpers/get-student-repository'

export function makeLogoutStudentUserCase() {
  const studentRepository = getStudentRepository()
  const logoutStudent = new LogoutStudentUserCase(studentRepository)

  return logoutStudent
}
