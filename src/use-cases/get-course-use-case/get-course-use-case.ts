import { ERROR_LIST } from '@/constants/erros'
import { ICourseRepository } from '@/repositories/courses.repository.types'

export class GetCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute({
    course_id,
    teacher_id,
  }: {
    course_id: string
    teacher_id: string
  }) {
    const course = await this.courseRepository.findCourseByID({ id: course_id })

    if (!course) {
      throw new Error(ERROR_LIST.COURSE.NOT_FOUND)
    }

    if (course.teacher_id !== teacher_id) {
      throw new Error(ERROR_LIST.COURSE.NON_EXISTENT)
    }

    return {
      course,
    }
  }
}
