import { PrismaTeacherRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { DeleteCourseUseCase } from './delete-course-use-case'

export function makeDeleteCourseUserCase() {
  const courseRepository = new PrismaCourseRepository()
  const teacherRepository = new PrismaTeacherRepository()
  const deleteCourse = new DeleteCourseUseCase(
    courseRepository,
    teacherRepository
  )

  return deleteCourse
}
