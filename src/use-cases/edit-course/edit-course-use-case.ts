import { ERROR_LIST } from '@/constants/erros'
import { ICourseRepository } from '@/repositories/courses.repository.types'
import { ITeacherRepository } from '@/repositories/teachers.repository.types'

export class EditCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private teacherRepository: ITeacherRepository
  ) {}

  async execute({
    teacher_id,
    course_id,
    course_name,
    generateNewCode,
  }: {
    teacher_id: string
    course_id: string
    course_name?: string
    generateNewCode?: boolean
  }) {
    const teacher = this.teacherRepository.findByUniqueID({ id: teacher_id })

    if (!teacher) {
      throw new Error(ERROR_LIST.COURSE.NOT_FOUND)
    }

    const course = await this.courseRepository.editCourse({
      teacher_id,
      course_name,
      course_id,
      generateNewCode,
    })

    if (!course) {
      throw new Error(ERROR_LIST.COURSE.NOT_FOUND)
    }

    return { course }
  }
}
