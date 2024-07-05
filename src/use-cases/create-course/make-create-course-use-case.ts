import { CreateCourseUseCase } from './create-course-use-case'
import { getCourseRepository } from '../helpers/get-course-repository'

export function makeCreateCourseUserCase() {
  const courseRepository = getCourseRepository()
  const createCourse = new CreateCourseUseCase(courseRepository)

  return createCourse
}
