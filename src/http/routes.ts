import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  registerTeacherController,
  AuthenticateTeacherController,
  LogoutTeacherController,
  registerStudentController,
  AuthenticateStudentController,
  LogoutStudentController,
  createCourseController,
  editCourseController,
  getCourseController,
  listTeacherCoursesController,
  listTeacherStudentsController,
  restoreStudentSaveController,
  updateStudentSaveController,
  getStudentByCourseController,
  UnenrollStudentFromCourseController,
  getStudentByIDController,
  deleteCourseController,
} from '@/http/controllers'
import { checkSessionIdExists } from '@/midlewares/check-session-id-exists'
import { checkApiKey } from '@/midlewares/check-api-key'
import { CURRENT_VERSION } from '@/constants/version'

export async function appRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request: FastifyRequest) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post(
    '/teacher/register',
    { preHandler: [checkApiKey] },
    registerTeacherController
  )
  app.post(
    '/teacher/authenticate',
    { preHandler: [checkApiKey] },
    AuthenticateTeacherController
  )
  app.post(
    '/teacher/logout',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    LogoutTeacherController
  )

  app.post(
    '/teacher/courses',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    listTeacherCoursesController
  )

  app.post(
    '/teacher/students',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    listTeacherStudentsController
  )

  app.post(
    '/course/create',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    createCourseController
  )

  app.patch(
    '/course/edit',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    editCourseController
  )

  app.delete(
    '/course/delete',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    deleteCourseController
  )

  app.post(
    '/course/student',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    getStudentByCourseController
  )

  app.post(
    '/course',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    getCourseController
  )

  app.post(
    '/student/register',
    { preHandler: [checkApiKey] },
    registerStudentController
  )
  app.post(
    '/student/authenticate',
    { preHandler: [checkApiKey] },
    AuthenticateStudentController
  )
  app.post(
    '/student/logout',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    LogoutStudentController
  )
  app.patch(
    '/sudent/unenroll',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    UnenrollStudentFromCourseController
  )
  app.post(
    '/student',
    { preHandler: [checkApiKey, checkSessionIdExists] },
    getStudentByIDController
  )

  app.post(
    '/save/restore',
    { preHandler: [checkApiKey] },
    restoreStudentSaveController
  )

  app.patch(
    '/save/update',
    { preHandler: [checkApiKey] },
    updateStudentSaveController
  )

  app.get('/status', (_: FastifyRequest, reply: FastifyReply) => {
    reply
      .status(200)
      .send(
        `Server Trilhas do Conhecimento status: ON. Version:${CURRENT_VERSION} `
      )
  })
}
