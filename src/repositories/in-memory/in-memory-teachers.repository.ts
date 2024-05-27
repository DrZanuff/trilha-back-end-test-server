import { Teacher, Course } from '@prisma/client'
import {
  ITeacherRepository,
  TeacherUpdatePayload,
} from '@/repositories/teachers.repository.types'
import { randomUUID } from 'node:crypto'
import { generateCourseCode } from '@/helpers/generate-course-code'

type TeacherPayload = Omit<Teacher, 'id' | 'session_id'>

interface TeacherType extends Teacher {
  courses?: Course[]
}

export class InMemoryTeacherRepository implements ITeacherRepository {
  items: TeacherType[] = []

  async create({
    email,
    password_hash,
    teacher_name,
    phone,
    school,
    subject,
  }: TeacherPayload): Promise<Teacher> {
    const teacher: TeacherType = {
      email,
      session_id: null,
      phone,
      school,
      subject,
      password_hash,
      teacher_name,
      id: randomUUID(),
      courses: [],
    }
    this.items.push(teacher)

    return teacher
  }

  async findByUniqueEmail({ email }: { email: string }) {
    const teacher = this.items.find((item) => item.email === email)

    return teacher || null
  }

  async findByUniqueID({ id }: { id: string }) {
    const teacher = this.items.find((item) => item.id === id)

    return teacher || null
  }

  async updateSessionID({ id }: { id: string }) {
    const teacherIndex = this.items.findIndex((item) => item.id === id)

    const teacher = this.items[teacherIndex]

    if (teacherIndex < 0) {
      return null
    }

    const teacherWithNewSessionID: Teacher = {
      ...teacher,
      session_id: randomUUID(),
    }

    this.items.splice(teacherIndex, 1, teacherWithNewSessionID)

    return teacherWithNewSessionID
  }

  async endSessionID({ id }: { id: string }) {
    const teacherIndex = this.items.findIndex((item) => item.id === id)

    const teacher = this.items[teacherIndex]

    if (teacherIndex < 0) {
      return null
    }

    const teacherWithNewSessionID: Teacher = {
      ...teacher,
      session_id: null,
    }

    this.items.splice(teacherIndex, 1, teacherWithNewSessionID)
  }

  async updateTeacher({
    id,
    payload,
  }: {
    id: string
    payload: TeacherUpdatePayload
  }) {
    const teacherIndex = this.items.findIndex((item) => item.id === id)

    const teacher = this.items[teacherIndex]

    if (teacherIndex < 0) {
      return null
    }

    const updatedTeacher: TeacherType = {
      id: payload?.id ? String(payload.id) : teacher.id,
      email: payload?.email ? String(payload.email) : teacher.email,
      password_hash: payload?.password_hash
        ? String(payload.password_hash)
        : teacher.password_hash,
      session_id: payload?.session_id
        ? String(payload.session_id)
        : teacher.session_id,
      teacher_name: payload?.teacher_name
        ? String(payload.teacher_name)
        : teacher.teacher_name,
      courses: payload?.courses
        ? (payload.courses as Course[])
        : teacher.courses,
      phone: null,
      school: null,
      subject: null,
    }

    this.items[teacherIndex] = updatedTeacher

    return updatedTeacher
  }

  async createCourse({
    teacher_id,
    course_name,
  }: {
    teacher_id: string
    course_name: string
  }) {
    const teacherIndex = this.items.findIndex((item) => item.id === teacher_id)

    const teacher = this.items[teacherIndex]

    if (teacherIndex < 0) {
      return null
    }

    const course: Course = {
      code: generateCourseCode(),
      course_name,
      id: randomUUID(),
      teacher_id: teacher?.id,
      created_at: new Date(),
    }

    await this.updateTeacher({
      id: teacher_id,
      payload: {
        courses: [...((teacher.courses as Course[]) || []), course],
      },
    })

    return course
  }

  async findCourseByCode({ code }: { code: string }) {
    let course: Course | null = null

    this.items.forEach((item) => {
      item.courses?.forEach((courseItem) => {
        if (courseItem.code === code) {
          course = courseItem
        }
      })
    })

    if (!course) {
      return null
    }

    return course
  }
}
