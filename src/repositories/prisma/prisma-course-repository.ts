import { prisma } from '@/lib/prisma'
import { ICourseRepository } from '@/repositories/courses.repository.types'
import { generateCourseCode } from '@/helpers/generate-course-code'

export class PrismaCourseRepository implements ICourseRepository {
  async createCourse({
    teacher_id,
    course_name,
  }: {
    teacher_id: string
    course_name: string
  }) {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacher_id,
      },
      include: {
        courses: true,
      },
    })

    if (!teacher) {
      return null
    }

    const course = await prisma.course.create({
      data: {
        code: generateCourseCode(),
        course_name,
        created_at: new Date(),
        Teacher: {
          connect: { id: teacher_id },
        },
      },
    })

    return course
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
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacher_id },
    })

    if (!teacher) {
      return null
    }

    const course = await prisma.course.update({
      where: { id: course_id, teacher_id },
      data: {
        course_name,
        code: generateNewCode ? generateCourseCode() : undefined,
      },
    })

    if (!course) {
      return null
    }

    return course
  }

  async findCourseByCode({ code }: { code: string }) {
    const course = await prisma.course.findUnique({
      where: {
        code,
      },
    })

    return course
  }

  async findCourseByID({ id }: { id: string }) {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        students: {
          select: {
            email: true,
            id: true,
            save: {
              include: {
                tracks: true,
              },
            },
            student_name: true,
          },
        },
      },
    })

    return course
  }

  async findManyCoursesByTeacherID({ id }: { id: string }) {
    const courses = await prisma.course.findMany({
      where: {
        teacher_id: id,
      },
      include: {
        students: {
          select: {
            email: true,
            id: true,
            student_name: true,
            save: {
              select: {
                current_track: true,
                experience: true,
                id: true,
                player_level: true,
                total_time_played: true,
                tracks: true,
                game_save: false,
              },
            },
          },
        },
      },
    })

    return courses
  }

  async enrollStudent({
    student_id,
    course_id,
  }: {
    student_id: string
    course_id: string
  }) {
    const student = await prisma.student.findUnique({
      where: {
        id: student_id,
      },
      include: { courses: true },
    })

    if (!student) {
      return false
    }

    const course = await prisma.course.findUnique({
      where: { id: course_id },
    })

    if (!course) {
      return false
    }

    const isStudentAlreadyEnrolled = student.courses.find(
      (course) => course.id === course_id
    )

    if (isStudentAlreadyEnrolled) {
      return false
    }

    await prisma.student.update({
      where: {
        id: student_id,
      },
      data: {
        courses: {
          connect: {
            id: course_id,
          },
        },
      },
    })

    return true
  }

  async unenrollStudent({
    student_id,
    course_id,
  }: {
    student_id: string
    course_id: string
  }) {
    const student = await prisma.student.findUnique({
      where: {
        id: student_id,
      },
      include: { courses: true },
    })

    if (!student) {
      return false
    }

    const course = await prisma.course.findUnique({
      where: { id: course_id },
    })

    if (!course) {
      return false
    }

    const isUnenrollmentSuccessful = await prisma.student.update({
      where: {
        id: student_id,
      },
      data: {
        courses: {
          disconnect: {
            id: course_id,
          },
        },
      },
    })

    if (!isUnenrollmentSuccessful) {
      return false
    }

    return true
  }
}
