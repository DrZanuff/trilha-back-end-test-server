import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterTeacherUseCase } from '@/use-cases/register-teacher'
import { InMemoryTeacherRepository } from '@/repositories/in-memory/in-memory-teachers.repository'
import { ERROR_LIST } from '@/constants/erros'
import { compare } from 'bcryptjs'

let inMemoryTeachers: InMemoryTeacherRepository
let registerTeacher: RegisterTeacherUseCase

describe('Register Teacher User Case', () => {
  beforeEach(() => {
    inMemoryTeachers = new InMemoryTeacherRepository()
    registerTeacher = new RegisterTeacherUseCase(inMemoryTeachers)
  })

  it('should hash password uppon registration', async () => {
    const password = '101010'

    const { teacher } = await registerTeacher.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      teacher.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should be able to register a teacher', async () => {
    const password = '101010'

    const { teacher } = await registerTeacher.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    const UUID_REGEX =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

    // expect(user.id).toBe(expect.any(String))
    const isValidUUID = UUID_REGEX.test(teacher.id)
    expect(isValidUUID).toBe(true)
  })

  it('should not be able to register a teacher with same email', async () => {
    const password = '101010'

    await registerTeacher.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    let messageError = ''

    try {
      await registerTeacher.execute({
        email: 'user998@gmail',
        name: 'user',
        password,
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.TEACHER.EMAIL_ALREADY_EXISTS)).toBe(
      true
    )
  })

  it('should be able to register a teacher with additional information', async () => {
    const password = '101010'
    const phone = '(61) 98899-8899'
    const school = 'Mock Scholl'
    const subject = 'TypeScript'

    const { teacher } = await registerTeacher.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
      phone,
      school,
      subject,
    })

    expect(teacher).toEqual(expect.objectContaining({ phone, school, subject }))
  })
})
