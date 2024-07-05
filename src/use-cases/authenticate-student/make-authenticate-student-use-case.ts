import { AuthenticateStudentUseCase } from './authenticate-student-use-case'
import { getStudentRepository } from '../helpers/get-student-repository'
import { getCourseRepository } from '../helpers/get-course-repository'

export function makeAuthenticateStudentUserCase() {
  const studentRepository = getStudentRepository()
  const courseRepository = getCourseRepository()
  const authenticateStudent = new AuthenticateStudentUseCase(
    studentRepository,
    courseRepository
  )

  return authenticateStudent
}
