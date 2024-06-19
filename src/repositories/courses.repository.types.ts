import { Prisma, Course } from '@prisma/client'

type StudentWithSave = Prisma.StudentGetPayload<{
  select: {
    id: true
    email: true
    student_name: true
    save: {
      select: {
        id: true
        current_track: true
        current_track_id: true
        experience: true
        player_level: true
        total_time_played: true
        tracks: true
      }
    }
  }
}>

interface CourseWithStudents extends Course {
  students?: StudentWithSave[]
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
  deleteCourse({
    teacher_id,
    course_id,
  }: {
    teacher_id: string
    course_id: string
  }): Promise<boolean | null>
  findCourseByCode({ code }: { code: string }): Promise<Course | null>
  findCourseByID({ id }: { id: string }): Promise<CourseWithStudents | null>
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
  unenrollStudent({
    student_id,
    course_id,
  }: {
    student_id: string
    course_id: string
  }): Promise<boolean>
}
