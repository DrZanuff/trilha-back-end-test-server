import { RestoreStudentSaveUseCase } from './restore-student-save'
import { getStudentRepository } from '../helpers/get-student-repository'

export function makeRestoreStudentSaveUserCase() {
  const studentRepository = getStudentRepository()
  const restoreStudentSave = new RestoreStudentSaveUseCase(studentRepository)

  return restoreStudentSave
}
