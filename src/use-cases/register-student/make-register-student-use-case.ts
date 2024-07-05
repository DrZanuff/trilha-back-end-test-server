import { RegisterStudentUseCase } from './register-student-use-case'
import { getStudentRepository } from '../helpers/get-student-repository'

export function makeRegisterStudentUserCase() {
  const studentRepository = getStudentRepository()
  const registerTeacher = new RegisterStudentUseCase(studentRepository)

  return registerTeacher
}
