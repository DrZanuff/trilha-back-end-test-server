import { supabase } from '@/lib/supabase'
import { ICourseRepository } from '@/repositories/courses.repository.types'
import { generateCourseCode } from '@/helpers/generate-course-code'
import get from 'lodash/get'
export class SupabaseCourseRepository implements ICourseRepository {
  async createCourse({
    teacher_id,
    course_name,
  }: {
    teacher_id: string
    course_name: string
  }) {
    const { data: teachers } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', teacher_id)

    const teacher = teachers?.[0] || null

    if (!teacher) {
      return null
    }

    const { data: courses } = await supabase
      .from('courses')
      .insert([
        {
          course_name,
          code: generateCourseCode(),
          created_at: new Date(),
          teacher_id: get(teacher, 'id'),
        },
      ])
      .select()

    return courses?.[0]
  }

  async deleteCourse({
    teacher_id,
    course_id,
  }: {
    teacher_id: string
    course_id: string
  }) {
    const { data: teachers } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', teacher_id)

    const teacher = teachers?.[0] || null

    if (!teacher) {
      return null
    }

    const { data: deletedCourse, error } = await supabase
      .from('courses')
      .delete()
      .eq('id', course_id)
      .select()

    if (error) {
      return null
    }

    return deletedCourse?.[0]
  }

  async editCourse({
    teacher_id,
    course_id,
    course_name,
    generateNewCode,
  }: {
    teacher_id: string
    course_id: string
    course_name?: string | undefined
    generateNewCode?: boolean | undefined
  }) {
    const { data: teachers } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', teacher_id)

    const teacher = teachers?.[0] || null

    if (!teacher) {
      return null
    }

    type UpdateCourseData = {
      course_name?: string
      code?: string
    }

    const updateData: UpdateCourseData = {}
    if (course_name !== undefined) {
      updateData.course_name = course_name
    }
    if (generateNewCode !== undefined) {
      updateData.code = generateCourseCode()
    }

    const { data: updatedCourse } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', course_id)
      .select()

    return updatedCourse?.[0]
  }

  async findCourseByCode({ code }: { code: string }) {
    const { data: course } = await supabase
      .from('courses')
      .select('*')
      .eq('code', code)
      .single()

    return course
  }

  async findCourseByID({ id }: { id: string }) {
    const { data: course } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    return course
  }

  async findManyCoursesByTeacherID({ id }: { id: string }) {
    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .eq('teacher_id', id)

    return courses || []
  }

  async enrollStudent({
    student_id,
    course_id,
  }: {
    student_id: string
    course_id: string
  }) {
    const { data: existingEnrollment, error: existingEnrollmentError } =
      await supabase
        .from('student_courses')
        .select('*')
        .eq('student_id', student_id)
        .eq('course_id', course_id)
        .single()

    if (
      existingEnrollmentError &&
      existingEnrollmentError.code !== 'PGRST116'
    ) {
      // PGRST116 means no rows returned
      console.error(
        'Error checking existing enrollment:',
        existingEnrollmentError
      )
      return false
    }

    if (existingEnrollment) {
      console.log('Student is already enrolled in the course')
      return false
    }

    const { error: enrollError } = await supabase
      .from('student_courses')
      .insert({
        student_id,
        course_id,
      })

    if (enrollError) {
      console.error('Error enrolling student:', enrollError)
      return false
    }

    return true
  }

  async unenrollStudent({
    student_id,
    course_id,
  }: {
    student_id: string
    course_id: string
  }) {
    const { data: existingEnrollment, error: existingEnrollmentError } =
      await supabase
        .from('student_courses')
        .select('*')
        .eq('student_id', student_id)
        .eq('course_id', course_id)
        .single()

    if (
      existingEnrollmentError &&
      existingEnrollmentError.code !== 'PGRST116'
    ) {
      console.error(
        'Error checking existing enrollment:',
        existingEnrollmentError
      )
      return false
    }

    if (!existingEnrollment) {
      console.log('Student is not enrolled in the course')
      return false
    }

    const { error: unenrollError } = await supabase
      .from('student_courses')
      .delete()
      .eq('student_id', student_id)
      .eq('course_id', course_id)

    if (unenrollError) {
      console.error('Error unenrolling student:', unenrollError)
      return false
    }

    return true
  }
}
