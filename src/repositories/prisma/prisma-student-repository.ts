import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { IStudentRepository } from '@/repositories/students.repository.types'
import { randomUUID } from 'node:crypto'

export class PrismaStudentRepository implements IStudentRepository {
  async create({
    email,
    password_hash,
    student_name,
  }: Pick<
    Prisma.StudentCreateInput,
    'email' | 'student_name' | 'password_hash'
  >) {
    const student = await prisma.student.create({
      data: {
        email,
        password_hash,
        student_name,
        save: {
          create: {
            experience: 0,
            player_level: 0,
            total_time_played: 0,
          },
        },
      },
      include: {
        save: {
          include: {
            tracks: true,
          },
        },
      },
    })

    return student
  }

  async findByUniqueEmail({ email }: { email: string }) {
    const student = await prisma.student.findUnique({
      where: {
        email,
      },
    })

    return student || null
  }

  async findByUniqueID({ id }: { id: string }) {
    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        save: {
          select: {
            current_track: true,
            experience: true,
            id: true,
            player_level: true,
            total_time_played: true,
            game_save: false,
            tracks: true,
          },
        },
      },
    })

    return student || null
  }

  async updateSessionID({ id }: { id: string }) {
    const student = await prisma.student.update({
      where: {
        id,
      },
      data: {
        session_id: randomUUID(),
      },
      include: {
        save: {
          include: {
            tracks: true,
          },
        },
      },
    })

    return student || null
  }

  async endSessionID({ id }: { id: string }) {
    await prisma.student.update({
      where: {
        id,
      },
      data: {
        session_id: null,
      },
    })
  }

  async findUniqueSave({ student_id }: { student_id: string }) {
    const student = await prisma.student.findUnique({
      where: { id: student_id },
    })

    if (!student) {
      return null
    }

    const save = await prisma.save.findFirst({
      where: {
        student_id,
      },
      include: {
        tracks: true,
      },
    })

    return save
  }

  async updateSave({
    student_id,
    time_played,
    saveFileBase64,
    current_track_name,
    current_track_id,
  }: {
    student_id: string
    saveFileBase64?: string
    time_played: number
    current_track_name?: string
    current_track_id?: string
  }) {
    const student = await prisma.student.findUnique({
      where: { id: student_id },
    })

    if (!student) {
      return null
    }

    const save = await prisma.save.findFirst({
      where: {
        student_id,
      },
    })

    if (!save) {
      return null
    }

    const updatedSave = await prisma.save.update({
      where: {
        id: save.id,
      },
      data: {
        game_save: saveFileBase64,
        total_time_played: save.total_time_played + time_played,
        current_track: current_track_name,
        current_track_id,
      },
      include: {
        tracks: true,
      },
    })

    return updatedSave
  }

  async findUniqueTrack({
    student_id,
    track_reference_id,
  }: {
    student_id: string
    track_reference_id: string
  }) {
    const student = await prisma.student.findUnique({
      where: {
        id: student_id,
      },
      select: {
        id: true,
        email: true,
        student_name: true,
        save: {
          include: {
            tracks: true,
          },
        },
      },
    })

    if (!student) {
      return null
    }

    const currentTrack = student.save?.tracks.find(
      (track) => track.track_reference_id === track_reference_id
    )

    return currentTrack || null
  }

  async updateOrCreateTrack({
    track_reference_id,
    completion_rate,
    track_id,
    track_description,
    track_name,
    student_id,
    time_played,
  }: {
    track_reference_id: string
    track_id: string
    completion_rate: number
    track_description?: string | undefined
    track_name?: string | undefined
    student_id: string
    time_played: number
  }) {
    const student = await prisma.student.findUnique({
      where: {
        id: student_id,
      },
      include: {
        save: true,
      },
    })

    if (!student) {
      return null
    }

    const updatedTrack = await prisma.track.upsert({
      where: {
        id: track_id,
      },
      update: {
        completion_rate,
        time_played,
        name: track_name,
        description: track_description,
      },
      create: {
        track_reference_id,
        completion_rate,
        time_played,
        description: track_description,
        name: track_name,
        Save: {
          connect: {
            id: student.save?.id,
          },
        },
      },
    })

    return updatedTrack
  }
}
