import { Prisma, Track } from '@prisma/client'
import { IStudentRepository } from '@/repositories/students.repository.types'
import { randomUUID } from 'node:crypto'

// type StudentWithSave = Prisma.StudentGetPayload<{ include: { save: true } }>
type StudentWithSave = Prisma.StudentGetPayload<{
  include: {
    save: {
      include: {
        tracks: true
      }
    }
  }
}>

// type StudentPayload = Pick<Student, 'email' | 'password_hash' | 'student_name'>
type StudentPayload = Prisma.StudentGetPayload<{
  include: {
    save: false
  }
}>

type TeacherType = Prisma.TeacherGetPayload<{ include: { courses: true } }>

export class InMemoryStudentRepository implements IStudentRepository {
  students: StudentWithSave[] = []
  teachers: TeacherType[] = []

  helpers = {
    findSave: ({ student_id }: { student_id: string }) => {
      const studentIndex = this.students.findIndex(
        (item) => item.id === student_id
      )

      if (studentIndex < 0) {
        return null
      }

      const student = this.students[studentIndex]

      const save = student.save

      return { save, studentIndex }
    },
  }

  async create({
    email,
    password_hash,
    student_name,
  }: StudentPayload): Promise<StudentWithSave> {
    const student_id = randomUUID()

    const student: StudentWithSave = {
      email,
      password_hash,
      student_name,
      id: student_id,
      session_id: null,
      user_cfg: null,
      save: {
        id: randomUUID(),
        experience: 0,
        player_level: 0,
        student_id,
        total_time_played: 0,
        current_track: null,
        current_track_id: null,
        game_save: null,
        tracks: [],
      },
    }
    this.students.push(student)

    return student
  }

  async findByUniqueEmail({ email }: { email: string }) {
    const student = this.students.find((item) => item.email === email)

    return student || null
  }

  async findByUniqueID({ id }: { id: string }) {
    const student = this.students.find((item) => item.id === id)

    return student || null
  }

  async updateSessionID({ id }: { id: string }) {
    const studentIndex = this.students.findIndex((item) => item.id === id)

    const student = this.students[studentIndex]

    if (studentIndex < 0) {
      return null
    }

    const studentWithNewSessionID: StudentWithSave = {
      ...student,
      session_id: randomUUID(),
    }

    this.students.splice(studentIndex, 1, studentWithNewSessionID)

    return studentWithNewSessionID
  }

  async endSessionID({ id }: { id: string }) {
    const studentIndex = this.students.findIndex((item) => item.id === id)

    const student = this.students[studentIndex]

    if (studentIndex < 0) {
      return null
    }

    const studentWithNewSessionID: StudentWithSave = {
      ...student,
      session_id: null,
    }

    this.students.splice(studentIndex, 1, studentWithNewSessionID)
  }

  async updateSave({
    student_id,
    saveFileBase64,
    time_played,
    current_track_name,
    current_track_id,
  }: {
    student_id: string
    saveFileBase64?: string
    time_played: number
    current_track_name?: string
    current_track_id?: string
  }) {
    const saveData = this.helpers.findSave({ student_id })

    if (!saveData) {
      return null
    }

    const { save, studentIndex } = saveData

    if (!save) {
      return null
    }

    const student = this.students[studentIndex]

    if (saveFileBase64) {
      save.game_save = saveFileBase64
    }
    save.total_time_played = time_played
    save.current_track = current_track_name || save.current_track
    save.current_track_id = current_track_id || save.current_track_id

    student.save = save
    this.students.splice(studentIndex, 1, student)

    return save
  }

  async findUniqueSave({ student_id }: { student_id: string }) {
    const saveData = this.helpers.findSave({ student_id })

    if (!saveData) {
      return null
    }

    const { save } = saveData

    return save
  }

  async findUniqueTrack({
    student_id,
    track_reference_id,
  }: {
    student_id: string
    track_reference_id: string
  }) {
    const saveData = this.helpers.findSave({ student_id })

    if (!saveData) {
      return null
    }

    const { save } = saveData

    if (!save) {
      return null
    }

    const track = save.tracks.find(
      (track) => track.track_reference_id === track_reference_id
    )

    return track || null
  }

  async updateOrCreateTrack({
    track_reference_id,
    track_id,
    completion_rate,
    track_description,
    track_name,
    student_id,
    time_played,
  }: {
    track_reference_id: string
    track_id: string
    completion_rate: number
    track_description?: string | undefined
    track_name?: string
    student_id: string
    time_played: number
  }) {
    const saveData = this.helpers.findSave({ student_id })

    if (!saveData) {
      return null
    }

    const { save, studentIndex } = saveData

    if (!save) {
      return null
    }

    const trackIndex = save.tracks.findIndex(
      (track) =>
        track.track_reference_id === track_reference_id && track.id === track_id
    )

    if (trackIndex === -1) {
      const newTrack: Track = {
        id: randomUUID(),
        completion_rate,
        name: track_name || null,
        description: track_description || null,
        saveId: save.id,
        time_played,
        track_reference_id,
      }

      save.tracks.push(newTrack)
      this.students[studentIndex].save = save

      return newTrack
    }

    const track = save.tracks[trackIndex]

    const updatedTrack = {
      ...track,
      completion_rate,
      time_played,
      name: track_name || track.name,
      description: track_description || track.description,
    }

    save.tracks.splice(trackIndex, 1, updatedTrack)
    this.students[studentIndex].save = save

    return track
  }
}
