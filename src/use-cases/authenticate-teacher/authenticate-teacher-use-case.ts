import { ERROR_LIST } from '@/constants/erros'
import { ITeacherRepository } from '@/repositories/teachers.repository.types'
import { compare } from 'bcryptjs'

export class AuthenticateTeacherUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute({ email, password }: { email: string; password: string }) {
    const teacher = await this.teacherRepository.findByUniqueEmail({ email })

    if (!teacher) {
      throw new Error(ERROR_LIST.TEACHER.INVALID_CREDENTIALS)
    }

    const isPasswordCorrect = await compare(password, teacher.password_hash)

    if (!isPasswordCorrect) {
      throw new Error(ERROR_LIST.TEACHER.INVALID_CREDENTIALS)
    }

    const teacherWithNewSessionID =
      await this.teacherRepository.updateSessionID({ id: teacher.id })

    if (!teacherWithNewSessionID) {
      throw new Error(ERROR_LIST.TEACHER.INVALID_CREDENTIALS)
    }

    return { teacher: teacherWithNewSessionID }
  }
}
