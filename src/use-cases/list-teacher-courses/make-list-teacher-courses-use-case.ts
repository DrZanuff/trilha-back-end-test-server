import { ListTeacherCoursesUseCase } from './list-teacher-course-use-case'
import { getCourseRepository } from '../helpers/get-course-repository'

export function makeListTeacherCoursesUserCase() {
  const courseRepository = getCourseRepository()
  const listTeacherCourses = new ListTeacherCoursesUseCase(courseRepository)

  return listTeacherCourses
}
