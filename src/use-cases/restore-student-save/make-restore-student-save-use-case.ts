import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { RestoreStudentSaveUseCase } from './restore-student-save'

export function makeRestoreStudentSaveUserCase() {
  const studentRepository = new PrismaStudentRepository()
  const courseRepository = new PrismaCourseRepository()
  const restoreStudentSave = new RestoreStudentSaveUseCase(
    studentRepository,
    courseRepository
  )

  return restoreStudentSave
}
