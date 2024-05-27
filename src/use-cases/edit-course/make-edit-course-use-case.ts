import { PrismaTeacherRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { EditCourseUseCase } from './edit-course-use-case'

export function makeEditeCourseUserCase() {
  const courseRepository = new PrismaCourseRepository()
  const teacherRepository = new PrismaTeacherRepository()
  const editCourse = new EditCourseUseCase(courseRepository, teacherRepository)

  return editCourse
}
