import { expect, describe, it } from 'vitest'

import { generateCourseCode } from './generate-course-code'

// Testes unitários
describe('Test generateCourseCode function', () => {
  it('should generate a valid course code', () => {
    const courseCode = generateCourseCode()
    expect(courseCode).toMatch(/^\d{2}\d{2}-[A-Za-z0-9]{3}\d{2}-[0-9X]{5}$/)
  })

  it('should generate different course codes on successive calls', () => {
    const courseCode1 = generateCourseCode()
    const courseCode2 = generateCourseCode()
    expect(courseCode1).not.toEqual(courseCode2)
  })
})
