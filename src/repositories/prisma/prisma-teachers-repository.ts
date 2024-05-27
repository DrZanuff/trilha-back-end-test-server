import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import {
  ITeacherRepository,
  TeacherUpdatePayload,
} from '@/repositories/teachers.repository.types'
import { randomUUID } from 'node:crypto'

export class PrismaTeacherRepository implements ITeacherRepository {
  async create({
    email,
    password_hash,
    teacher_name,
    phone,
    school,
    subject,
  }: Omit<Prisma.TeacherCreateInput, 'id' | 'session_id'>) {
    const teacher = await prisma.teacher.create({
      data: {
        email,
        password_hash,
        teacher_name,
        phone,
        school,
        subject,
      },
    })

    return teacher
  }

  async findByUniqueEmail({ email }: { email: string }) {
    const teacher = await prisma.teacher.findUnique({
      where: {
        email,
      },
    })

    return teacher || null
  }

  async findByUniqueID({ id }: { id: string }) {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    })

    return teacher || null
  }

  async updateSessionID({ id }: { id: string }) {
    const teacher = await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        session_id: randomUUID(),
      },
    })

    return teacher || null
  }

  async endSessionID({ id }: { id: string }) {
    await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        session_id: null,
      },
    })
  }

  async updateTeacher({
    id,
    payload,
  }: {
    id: string
    payload: TeacherUpdatePayload
  }) {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
      include: {
        courses: true,
      },
    })

    if (!teacher) {
      return null
    }

    const updatedTeacher = await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        id: payload.id,
        email: payload.email,
        teacher_name: payload.teacher_name,
        password_hash: payload.password_hash,
        session_id: payload.session_id,
        courses: payload.courses
          ? {
              set: payload.courses,
            }
          : undefined,
      },
      include: {
        courses: true,
      },
    })

    return updatedTeacher
  }
}
