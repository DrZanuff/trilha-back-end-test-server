import { UnenrollStudentFromCourseUseCase } from './unenroll-student-from-course-use-case'
import { getStudentRepository } from '../helpers/get-student-repository'
import { getCourseRepository } from '../helpers/get-course-repository'

export function makeUnenrollStudentFromCourseUseCase() {
  const studentRepository = getStudentRepository()
  const courseRepository = getCourseRepository()
  const unenrollStudent = new UnenrollStudentFromCourseUseCase(
    studentRepository,
    courseRepository
  )

  return unenrollStudent
}
