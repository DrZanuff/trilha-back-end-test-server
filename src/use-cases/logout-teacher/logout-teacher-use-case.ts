import { ERROR_LIST } from '@/constants/erros'
import { ITeacherRepository } from '@/repositories/teachers.repository.types'

export class LogoutTeacherUserCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute({ id }: { id: string }) {
    const isNull = await this.teacherRepository.endSessionID({ id })

    if (isNull === null) {
      throw new Error(ERROR_LIST.TEACHER.NOT_FOUND)
    }
  }
}
