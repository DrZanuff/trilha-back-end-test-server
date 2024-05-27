import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterStudentUseCase } from '@/use-cases/register-student'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-student.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryStudent: InMemoryStudentRepository
let registerStudent: RegisterStudentUseCase

describe('Register Student User Case', () => {
  beforeEach(() => {
    inMemoryStudent = new InMemoryStudentRepository()
    registerStudent = new RegisterStudentUseCase(inMemoryStudent)
  })

  it('should be able to register a student', async () => {
    const password = '101010'

    const { student } = await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    const UUID_REGEX =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

    // expect(user.id).toBe(expect.any(String))
    const isValidUUID = UUID_REGEX.test(student.id)
    expect(isValidUUID).toBe(true)
  })

  it('should not be able to register a student with same email', async () => {
    const password = '101010'

    await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    let messageError = ''

    try {
      await registerStudent.execute({
        email: 'user998@gmail',
        name: 'user',
        password,
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.EMAIL_ALREADY_EXISTS)).toBe(
      true
    )
  })

  it('should create a save uppon student registration', async () => {
    const password = '101010'

    const { student } = await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    expect(student.save).not.toBe(null)
  })
})
