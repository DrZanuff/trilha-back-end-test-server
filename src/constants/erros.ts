export const ERROR_LIST = {
  TEACHER: {
    NOT_FOUND: 'Could not find a teacher with this id',
    EMAIL_ALREADY_EXISTS: 'This teacher email is already being used.',
    INVALID_CREDENTIALS: 'Invalid crendentials. <Teacher>',
  },
  STUDENT: {
    NOT_FOUND: 'Could not find a student with this id',
    EMAIL_ALREADY_EXISTS: 'This student email is already being used.',
    INVALID_CREDENTIALS: 'Invalid crendentials. <Student>',
    SAVE_NOT_FOUND: 'Could not find a valid save.',
    TRACK_NOT_FOUND: 'Could not find a valid track.',
  },
  COURSE: {
    NOT_FOUND: 'Course not found.',
    NON_EXISTENT: `This course don't exist for this teacher.`,
    INVALID_PARAMETERS: 'Wrong or missing parameters to retrieve a course.',
  },
  UNKNOWN_ERROR: 'Something went wrong...',
}
