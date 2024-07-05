import { supabase } from '@/lib/supabase'
import { Prisma } from '@prisma/client'
import {
  ITeacherRepository,
  TeacherUpdatePayload,
} from '@/repositories/teachers.repository.types'
import { randomUUID } from 'node:crypto'

export class SupabaseTeacherRepository implements ITeacherRepository {
  async create({
    email,
    password_hash,
    teacher_name,
    phone,
    school,
    subject,
  }: Omit<Prisma.TeacherCreateInput, 'id' | 'session_id'>) {
    const { data } = await supabase
      .from('teachers')
      .insert([{ email, password_hash, teacher_name, phone, school, subject }])
      .select()

    return data as any
  }

  async findByUniqueEmail({ email }: { email: string }) {
    const { data: teachers } = await supabase
      .from('teachers')
      .select('*')
      .eq('email', email)

    return teachers?.[0] || null
  }

  async findByUniqueID({ id }: { id: string }) {
    const { data: teachers } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)

    return teachers?.[0] || null
  }

  async updateSessionID({ id }: { id: string }) {
    const { data } = await supabase
      .from('teachers')
      .update({ session_id: randomUUID() })
      .eq('id', id)
      .select()

    return data?.[0] || null
  }

  async endSessionID({ id }: { id: string }) {
    await supabase
      .from('teachers')
      .update({ session_id: null })
      .eq('id', id)
      .select()
  }

  async updateTeacher({
    id,
    payload,
  }: {
    id: string
    payload: TeacherUpdatePayload
  }) {
    const { data: teachers } = await supabase
      .from('teachers')
      .select(
        `
      *,
      courses (
        id,
        course_name,
        code,
        created_at
      )
    `
      )
      .eq('id', id)

    const teacher = teachers?.[0] || null

    if (!teacher) {
      return null
    }

    const { data: updatedTeacher } = await supabase
      .from('teachers')
      .update(payload)
      .eq('id', id)
      .select()

    return updatedTeacher?.[0] || null
  }
}
