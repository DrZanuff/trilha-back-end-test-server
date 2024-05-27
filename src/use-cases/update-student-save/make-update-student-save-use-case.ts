import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { UpdateStudentSaveUseCase } from './update-student-save'

export function makeUpdateStudentSaveUserCase() {
  const studentRepository = new PrismaStudentRepository()
  const updateStudentSave = new UpdateStudentSaveUseCase(studentRepository)

  return updateStudentSave
}
