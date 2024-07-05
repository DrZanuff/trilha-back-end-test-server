import { EditCourseUseCase } from './edit-course-use-case'
import { getCourseRepository } from '../helpers/get-course-repository'
import { getTeacherRepository } from '../helpers/get-teacher-repository'

export function makeEditeCourseUserCase() {
  const courseRepository = getCourseRepository()
  const teacherRepository = getTeacherRepository()
  const editCourse = new EditCourseUseCase(courseRepository, teacherRepository)

  return editCourse
}
