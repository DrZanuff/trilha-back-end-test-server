import { Prisma, Teacher } from '@prisma/client'
import { ICourseRepository } from '@/repositories/courses.repository.types'
import { randomUUID } from 'node:crypto'
import { generateCourseCode } from '@/helpers/generate-course-code'

type CourseType = Prisma.CourseGetPayload<{
  include: {
    students: {
      include: {
        save: true
      }
    }
  }
}>
type StudentType = Prisma.StudentGetPayload<{
  include: { save: true }
}>

interface TeacherType extends Teacher {
  courses?: CourseType[]
}
// type TeacherType = Prisma.TeacherGetPayload<{ include: { courses: true } }>

export class InMemoryCourseRepository implements ICourseRepository {
  teachers: TeacherType[] = []
  students: StudentType[] = []

  async createCourse({
    teacher_id,
    course_name,
  }: {
    teacher_id: string
    course_name: string
  }) {
    const teacherIndex = this.teachers.findIndex(
      (item) => item.id === teacher_id
    )

    const teacher = this.teachers[teacherIndex]

    if (teacherIndex < 0) {
      return null
    }

    const course: CourseType = {
      code: generateCourseCode(),
      course_name,
      id: randomUUID(),
      teacher_id: teacher?.id,
      students: [],
      created_at: new Date(),
    }

    this.teachers[teacherIndex].courses?.push(course)

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
    let course: CourseType | null = null
    let teacherIndex = -1
    let courseIndex = -1

    if (this.teachers.findIndex((item) => item.id === teacher_id) < 0) {
      return null
    }

    this.teachers.forEach((item, t_index) => {
      item.courses?.forEach((courseItem, c_index) => {
        if (courseItem.id === course_id) {
          teacherIndex = t_index
          courseIndex = c_index
          course = {
            ...courseItem,
            code: generateNewCode ? generateCourseCode() : courseItem.code,
            course_name: course_name || courseItem.course_name,
          }
        }
      })
    })

    if (!course) {
      return null
    }

    this.teachers[teacherIndex].courses?.splice(courseIndex, 1, course)

    return course
  }

  async findCourseByCode({ code }: { code: string }) {
    let course: CourseType | null = null

    this.teachers.forEach((item) => {
      item.courses?.forEach((courseItem) => {
        if (courseItem.code === code) {
          course = courseItem
        }
      })
    })

    if (!course) {
      return null
    }

    return course
  }

  async findCourseByID({ id }: { id: string }) {
    let course: CourseType | null = null

    this.teachers.forEach((item) => {
      item.courses?.forEach((courseItem) => {
        if (courseItem.id === id) {
          course = courseItem
        }
      })
    })

    if (!course) {
      return null
    }

    return course
  }

  async findManyCoursesByTeacherID({ id }: { id: string }) {
    const teacherIndex = this.teachers.findIndex((teacher) => teacher.id === id)

    const courses = this.teachers[teacherIndex].courses || []

    return courses
  }

  async enrollStudent({
    student_id,
    course_id,
  }: {
    student_id: string
    course_id: string
  }) {
    const student = this.students.find((item) => item.id === student_id)

    if (!student) {
      return false
    }

    let courseIndex: number | undefined = -1

    const teacherIndex = this.teachers.findIndex((teacher) => {
      courseIndex = teacher.courses?.findIndex(
        (course) => course.id === course_id
      )

      return Number(courseIndex) >= 0
    })

    if (courseIndex === -1 || teacherIndex === -1) {
      return false
    }

    const courses = this.teachers[teacherIndex].courses

    if (!courses) {
      return false
    }

    const course = courses[courseIndex]

    if (!course) {
      return false
    }

    if (course.students.find((studentItem) => studentItem.id === student.id)) {
      return false
    }

    course.students.push(student)

    return true
  }
}
