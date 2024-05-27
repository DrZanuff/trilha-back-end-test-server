import { expect, describe, it, beforeEach } from 'vitest'
import { LogoutTeacherUserCase } from './logout-teacher-use-case'
import { RegisterTeacherUseCase } from '@/use-cases/register-teacher'
import { InMemoryTeacherRepository } from '@/repositories/in-memory/in-memory-teachers.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryTeachers: InMemoryTeacherRepository
let logoutTeacher: LogoutTeacherUserCase
let registerTeacher: RegisterTeacherUseCase

describe('Logout Teacher User Case', () => {
  beforeEach(() => {
    inMemoryTeachers = new InMemoryTeacherRepository()
    logoutTeacher = new LogoutTeacherUserCase(inMemoryTeachers)
    registerTeacher = new RegisterTeacherUseCase(inMemoryTeachers)
  })

  it('should be able logout as a teacher', async () => {
    const password = '101010'

    const { teacher } = await registerTeacher.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    await logoutTeacher.execute({
      id: teacher.id,
    })

    expect(true).toBe(true)
  })

  it('should not be able to logout with a non existend teacher', async () => {
    let messageError = ''

    try {
      await logoutTeacher.execute({
        id: 'wrong-id',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.TEACHER.NOT_FOUND)).toBe(true)
  })
})
