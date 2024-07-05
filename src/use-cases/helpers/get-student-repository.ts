import { PrismaStudentRepository } from '@/repositories/prisma/prisma-student-repository'
import { SupabaseStudentRepository } from '@/repositories/supabase/supabase-student-repository'
import { env } from '@/env'

export function getStudentRepository() {
  const teacherRepository =
    env.DATA_BASE_TYPE === 'PRISMA'
      ? new PrismaStudentRepository()
      : new SupabaseStudentRepository()

  return teacherRepository
}
