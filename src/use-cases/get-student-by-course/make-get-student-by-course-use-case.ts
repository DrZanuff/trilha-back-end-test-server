import { GetStudentByCourseUseCase } from './get-student-by-course-use-case'
import { getStudentRepository } from '../helpers/get-student-repository'

export function makeGetSudentByCourseUserCase() {
  const studentRepository = getStudentRepository()
  const getStudentByCourse = new GetStudentByCourseUseCase(studentRepository)

  return getStudentByCourse
}
