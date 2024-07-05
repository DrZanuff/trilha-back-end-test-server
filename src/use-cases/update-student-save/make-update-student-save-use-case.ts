import { UpdateStudentSaveUseCase } from './update-student-save'
import { getStudentRepository } from '../helpers/get-student-repository'

export function makeUpdateStudentSaveUserCase() {
  const studentRepository = getStudentRepository()
  const updateStudentSave = new UpdateStudentSaveUseCase(studentRepository)

  return updateStudentSave
}
