import { ERROR_LIST } from '@/constants/erros'
import { IStudentRepository } from '@/repositories/students.repository.types'
import { ICourseRepository } from '@/repositories/courses.repository.types'

export class UnenrollStudentFromCourseUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private courseRepository: ICourseRepository
  ) {}

  async execute({
    student_id,
    course_id,
  }: {
    student_id: string
    course_id: string
  }) {
    const student = await this.studentRepository.findByUniqueID({
      id: student_id,
    })

    if (!student) {
      throw new Error(ERROR_LIST.STUDENT.NOT_FOUND)
    }

    const course = await this.courseRepository.findCourseByID({ id: course_id })

    if (!course) {
      throw new Error(ERROR_LIST.COURSE.NOT_FOUND)
    }

    const isUnenrollmentSuccessful =
      await this.courseRepository.unenrollStudent({ student_id, course_id })

    if (!isUnenrollmentSuccessful) {
      throw new Error(ERROR_LIST.COURSE.UNENROLLMENT_FAILED)
    }

    return true
  }
}
