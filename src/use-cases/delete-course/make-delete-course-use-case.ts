import { DeleteCourseUseCase } from './delete-course-use-case'
import { getCourseRepository } from '../helpers/get-course-repository'
import { getTeacherRepository } from '../helpers/get-teacher-repository'

export function makeDeleteCourseUserCase() {
  const courseRepository = getCourseRepository()
  const teacherRepository = getTeacherRepository()
  const deleteCourse = new DeleteCourseUseCase(
    courseRepository,
    teacherRepository
  )

  return deleteCourse
}
