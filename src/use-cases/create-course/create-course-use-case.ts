import { ERROR_LIST } from '@/constants/erros'
import { ICourseRepository } from '@/repositories/courses.repository.types'

export class CreateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute({
    teacher_id,
    course_name,
  }: {
    teacher_id: string
    course_name: string
  }) {
    const course = await this.courseRepository.createCourse({
      teacher_id,
      course_name,
    })

    if (!course) {
      throw new Error(ERROR_LIST.TEACHER.NOT_FOUND)
    }

    return { course }
  }
}
