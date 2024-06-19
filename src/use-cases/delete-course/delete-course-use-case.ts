import { ERROR_LIST } from '@/constants/erros'
import { ICourseRepository } from '@/repositories/courses.repository.types'
import { ITeacherRepository } from '@/repositories/teachers.repository.types'

export class DeleteCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private teacherRepository: ITeacherRepository
  ) {}

  async execute({
    teacher_id,
    course_id,
  }: {
    teacher_id: string
    course_id: string
  }) {
    const teacher = await this.teacherRepository.findByUniqueID({
      id: teacher_id,
    })

    if (!teacher) {
      throw new Error(ERROR_LIST.TEACHER.NOT_FOUND)
    }

    const isSuccessfullyDeleted = await this.courseRepository.deleteCourse({
      teacher_id,
      course_id,
    })

    if (!isSuccessfullyDeleted) {
      throw new Error(ERROR_LIST.COURSE.NOT_FOUND)
    }

    return true
  }
}
