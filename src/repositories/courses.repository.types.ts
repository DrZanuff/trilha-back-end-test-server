import { Course, Student } from '@prisma/client'

type StudentWithBasicData = Omit<
  Student,
  'password_hash' | 'session_id' | 'user_cfg' | 'courses' | 'saves'
>
interface CourseWithStudents extends Course {
  students?: StudentWithBasicData[]
}

export interface ICourseRepository {
  createCourse({
    teacher_id,
    course_name,
  }: {
    teacher_id: string
    course_name: string
  }): Promise<Course | null>
  editCourse({
    teacher_id,
    course_id,
    course_name,
    generateNewCode,
  }: {
    teacher_id: string
    course_id: string
    course_name?: string
    generateNewCode?: boolean
  }): Promise<Course | null>
  findCourseByCode({ code }: { code: string }): Promise<Course | null>
  findCourseByID({ id }: { id: string }): Promise<Course | null>
  findManyCoursesByTeacherID({
    id,
  }: {
    id: string
  }): Promise<CourseWithStudents[]>
  enrollStudent({
    student_id,
    course_id,
  }: {
    student_id: string
    course_id: string
  }): Promise<boolean>
}
