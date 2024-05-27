import { ERROR_LIST } from '@/constants/erros'
import { IStudentRepository } from '@/repositories/students.repository.types'

export class LogoutStudentUserCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute({ id }: { id: string }) {
    const isNull = await this.studentRepository.endSessionID({ id })

    if (isNull === null) {
      throw new Error(ERROR_LIST.STUDENT.NOT_FOUND)
    }
  }
}
