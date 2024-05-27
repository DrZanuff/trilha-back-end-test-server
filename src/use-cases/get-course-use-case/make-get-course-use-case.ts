import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { GetCourseUseCase } from './get-course-use-case'

export function makeGetCourseUserCase() {
  const courseRepository = new PrismaCourseRepository()
  const getCourse = new GetCourseUseCase(courseRepository)

  return getCourse
}
