import { ERROR_LIST } from '@/constants/erros'
import { IStudentRepository } from '@/repositories/students.repository.types'

export class GetStudentByIDUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute({ student_id }: { student_id: string }) {
    const student = await this.studentRepository.findByUniqueID({
      id: student_id,
    })

    if (!student) {
      throw new Error(ERROR_LIST.STUDENT.NOT_FOUND)
    }

    return { student }
  }
}
