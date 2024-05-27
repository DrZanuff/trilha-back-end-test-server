import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { CreateCourseUseCase } from './create-course-use-case'

export function makeCreateCourseUserCase() {
  const courseRepository = new PrismaCourseRepository()
  const createCourse = new CreateCourseUseCase(courseRepository)

  return createCourse
}
