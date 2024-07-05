import { PrismaTeacherRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { SupabaseTeacherRepository } from '@/repositories/supabase/supabase-teachers-repository'
import { env } from '@/env'

export function getTeacherRepository() {
  const teacherRepository =
    env.DATA_BASE_TYPE === 'PRISMA'
      ? new PrismaTeacherRepository()
      : new SupabaseTeacherRepository()

  return teacherRepository
}
