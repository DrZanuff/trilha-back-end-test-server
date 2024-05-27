import { expect, describe, it, beforeEach } from 'vitest'
import { LogoutStudentUserCase } from './logout-student-use-case'
import { RegisterStudentUseCase } from '@/use-cases/register-student'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-student.repository'
import { ERROR_LIST } from '@/constants/erros'

let inMemoryStudents: InMemoryStudentRepository
let logoutStudent: LogoutStudentUserCase
let registerStudent: RegisterStudentUseCase

describe('Logout Student User Case', () => {
  beforeEach(() => {
    inMemoryStudents = new InMemoryStudentRepository()
    logoutStudent = new LogoutStudentUserCase(inMemoryStudents)
    registerStudent = new RegisterStudentUseCase(inMemoryStudents)
  })

  it('should be able logout as a student', async () => {
    const password = '101010'

    const { student } = await registerStudent.execute({
      email: 'user998@gmail',
      name: 'user',
      password,
    })

    await logoutStudent.execute({
      id: student.id,
    })

    expect(true).toBe(true)
  })

  it('should not be able to logout with a non existend student', async () => {
    let messageError = ''

    try {
      await logoutStudent.execute({
        id: 'wrong-id',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.NOT_FOUND)).toBe(true)
  })
})
