import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateTeacherUseCase } from './authenticate-teacher-use-case'
import { RegisterTeacherUseCase } from '@/use-cases/register-teacher'
import { InMemoryTeacherRepository } from '@/repositories/in-memory/in-memory-teachers.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryTeachers: InMemoryTeacherRepository
let authenticateTeacher: AuthenticateTeacherUseCase
let registerTeacher: RegisterTeacherUseCase

describe('Authenticate Teacher User Case', () => {
  beforeEach(() => {
    inMemoryTeachers = new InMemoryTeacherRepository()
    authenticateTeacher = new AuthenticateTeacherUseCase(inMemoryTeachers)
    registerTeacher = new RegisterTeacherUseCase(inMemoryTeachers)
  })

  it('should be able to authenticate a teacher', async () => {
    const password = '101010'

    await registerTeacher.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    const { teacher } = await authenticateTeacher.execute({
      email: 'user998@gmail',
      password,
    })

    const UUID_REGEX =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

    // expect(user.id).toBe(expect.any(String))
    const isValidUUID = UUID_REGEX.test(teacher.id)
    expect(isValidUUID).toBe(true)
  })

  it('should not be able to authenticate a teacher with wrong email', async () => {
    const password = '101010'

    await registerTeacher.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    let messageError = ''

    try {
      await authenticateTeacher.execute({
        email: 'wrong_user@gmail.com',
        password,
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.TEACHER.INVALID_CREDENTIALS)).toBe(
      true
    )
  })

  it('should not be able to authenticate a teacher with wrong password', async () => {
    const password = '101010'

    await registerTeacher.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    let messageError = ''

    try {
      await authenticateTeacher.execute({
        email: 'user998@gmail',
        password: 'wrong_password',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.TEACHER.INVALID_CREDENTIALS)).toBe(
      true
    )
  })

  it('should not be able to authenticate with a non existend teacher', async () => {
    let messageError = ''

    try {
      await authenticateTeacher.execute({
        email: 'user998@gmail',
        password: '101010',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.TEACHER.INVALID_CREDENTIALS)).toBe(
      true
    )
  })
})
