import { ListTeacherStudentsUseCase } from './list-teacher-students-use-case'
import { getCourseRepository } from '../helpers/get-course-repository'

export function makeListTeacherStudentsUserCase() {
  const courseRepository = getCourseRepository()
  const listTeacherStudents = new ListTeacherStudentsUseCase(courseRepository)

  return listTeacherStudents
}
