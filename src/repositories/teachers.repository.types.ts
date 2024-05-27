import { Prisma, Teacher, Course } from '@prisma/client'

export type TeacherUpdatePayload = {
  email?: string
  session_id?: string
  password_hash?: string
  teacher_name?: string
  id?: string
  courses?: Course[]
}

export interface ITeacherRepository {
  create(data: Prisma.TeacherCreateInput): Promise<Teacher>
  findByUniqueEmail({ email }: { email: string }): Promise<Teacher | null>
  findByUniqueID({ id }: { id: string }): Promise<Teacher | null>
  updateSessionID({ id }: { id: string }): Promise<Teacher | null>
  endSessionID({ id }: { id: string }): Promise<void | null>
  updateTeacher({
    id,
    payload,
  }: {
    id: string
    payload: TeacherUpdatePayload
  }): Promise<Teacher | null>
}
