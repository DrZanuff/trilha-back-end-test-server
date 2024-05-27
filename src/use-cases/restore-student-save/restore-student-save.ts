import { ERROR_LIST } from '@/constants/erros'
import { IStudentRepository } from '@/repositories/students.repository.types'

export class RestoreStudentSaveUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute({ student_id }: { student_id: string }) {
    const student = await this.studentRepository.findByUniqueID({
      id: student_id,
    })

    if (!student) {
      throw new Error(ERROR_LIST.STUDENT.NOT_FOUND)
    }

    const save = await this.studentRepository.findUniqueSave({
      student_id,
    })

    if (!save) {
      throw new Error(ERROR_LIST.STUDENT.SAVE_NOT_FOUND)
    }

    return { save }
  }
}
