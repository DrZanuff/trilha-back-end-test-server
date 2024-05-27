import { ICourseRepository } from '@/repositories/courses.repository.types'

export class ListTeacherCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute({ teacher_id }: { teacher_id: string }) {
    const courses = await this.courseRepository.findManyCoursesByTeacherID({
      id: teacher_id,
    })

    return {
      courses,
    }
  }
}
