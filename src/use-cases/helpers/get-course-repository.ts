import { PrismaCourseRepository } from '@/repositories/prisma/prisma-course-repository'
import { SupabaseCourseRepository } from '@/repositories/supabase/supabase-course-repository'
import { env } from '@/env'

export function getCourseRepository() {
  const teacherRepository =
    env.DATA_BASE_TYPE === 'PRISMA'
      ? new PrismaCourseRepository()
      : new SupabaseCourseRepository()

  return teacherRepository
}
