import { ICourseRepository } from '@/repositories/courses.repository.types'
import { Student } from '@prisma/client'

type StudentBasicInfo = Omit<
  Student,
  'password_hash' | 'session_id' | 'user_cfg'
>

export class ListTeacherStudentsUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute({ teacher_id }: { teacher_id: string }) {
    const courses = await this.courseRepository.findManyCoursesByTeacherID({
      id: teacher_id,
    })

    const students = courses.reduce((accumulator, currentValue) => {
      const studentsList =
        currentValue.students?.map(
          ({ id, email, student_name, skin_level }) => ({
            id,
            email,
            student_name,
            skin_level,
          })
        ) || []

      return [...accumulator, ...studentsList]
    }, [] as StudentBasicInfo[])

    return {
      students,
    }
  }
}
