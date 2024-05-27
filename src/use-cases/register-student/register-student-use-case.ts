import { ERROR_LIST } from '@/constants/erros'
import { IStudentRepository } from '@/repositories/students.repository.types'
import { hash } from 'bcryptjs'

type RegisterStudentProps = {
  name: string
  email: string
  password: string
}

export class RegisterStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute({ email, name, password }: RegisterStudentProps) {
    const password_hash = await hash(password, 6)

    const studentWithSameEmail = await this.studentRepository.findByUniqueEmail(
      { email }
    )

    if (studentWithSameEmail) {
      throw new Error(ERROR_LIST.STUDENT.EMAIL_ALREADY_EXISTS)
    }

    const student = await this.studentRepository.create({
      email,
      password_hash,
      student_name: name,
    })

    return { student }
  }
}
