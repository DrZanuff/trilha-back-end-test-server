import { GetCourseUseCase } from './get-course-use-case'
import { getCourseRepository } from '../helpers/get-course-repository'

export function makeGetCourseUserCase() {
  const courseRepository = getCourseRepository()
  const getCourse = new GetCourseUseCase(courseRepository)

  return getCourse
}
