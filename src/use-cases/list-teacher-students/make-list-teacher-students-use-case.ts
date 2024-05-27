// import { PrismaTeacherRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { ListTeacherStudentsUseCase } from './list-teacher-students-use-case'

export function makeListTeacherStudentsUserCase() {
  const courseRepository = new PrismaCourseRepository()
  const listTeacherStudents = new ListTeacherStudentsUseCase(courseRepository)

  return listTeacherStudents
}
