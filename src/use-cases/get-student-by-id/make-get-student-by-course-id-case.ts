import { GetStudentByIDUseCase } from './get-student-by-id-use-case'
import { getStudentRepository } from '../helpers/get-student-repository'

export function makeGetSudentByIDUserCase() {
  const studentRepository = getStudentRepository()
  const getStudentByID = new GetStudentByIDUseCase(studentRepository)

  return getStudentByID
}
