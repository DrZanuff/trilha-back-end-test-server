// import { PrismaTeacherRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { ListTeacherCoursesUseCase } from './list-teacher-course-use-case'

export function makeListTeacherCoursesUserCase() {
  const courseRepository = new PrismaCourseRepository()
  const listTeacherCourses = new ListTeacherCoursesUseCase(courseRepository)

  return listTeacherCourses
}
