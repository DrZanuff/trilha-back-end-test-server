import { expect, describe, it, beforeEach } from 'vitest'
import { UpdateStudentSaveUseCase } from './update-student-save'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-student.repository'
import { InMemoryCourseRepository } from '@/repositories/in-memory/in-memory-courses.repository'
import get from 'lodash/get'

import { ERROR_LIST } from '@/constants/erros'

let inMemoryStudents: InMemoryStudentRepository
let inMemoryCourses: InMemoryCourseRepository
let updateSave: UpdateStudentSaveUseCase

describe('Update Student Save User Case', () => {
  beforeEach(() => {
    inMemoryStudents = new InMemoryStudentRepository()
    inMemoryCourses = new InMemoryCourseRepository()
    updateSave = new UpdateStudentSaveUseCase(inMemoryStudents)

    inMemoryCourses.teachers.push({
      email: 'teacher1@gmail.com',
      id: 'teacher1-id',
      password_hash: 'teacher1-hash',
      phone: null,
      subject: null,
      school: null,
      session_id: 'teacher1-session-id',
      teacher_name: 'Teacher 1',
      courses: [
        {
          code: 'course1-code',
          course_name: 'Course Name',
          created_at: null,
          id: 'course1-id',
          students: [
            {
              email: 'user1@gmail.gmail',
              id: 'user1-id',
              password_hash: 'user1-hash',
              session_id: 'user1-session-id',
              student_name: 'User 1',
              user_cfg: null,
              save: {
                experience: 0,
                game_save: 'base64-save',
                id: 'personal-save1-id',
                player_level: 0,
                student_id: 'user1-id',
                total_time_played: 0,
                current_track: 'track01',
              },
            },
          ],
          teacher_id: 'teacher1-id',
        },
      ],
    })
    inMemoryStudents.students.push({
      email: 'user1@gmail.gmail',
      id: 'user1-id',
      password_hash: 'user1-hash',
      session_id: 'user1-session-id',
      student_name: 'User 1',
      user_cfg: null,
      save: {
        experience: 0,
        game_save: 'base64-save',
        id: 'personal-save1-id',
        player_level: 0,
        student_id: 'user1-id',
        total_time_played: 0,
        current_track: 'track01',
        tracks: [
          {
            completion_rate: 0,
            description: 'Track 01',
            id: 'track-01-id',
            name: 'track01',
            saveId: 'personal-save1-id',
            time_played: 0,
            track_reference_id: 'track-reference-id-01',
          },
        ],
      },
    })
  })

  it('should be able to update a save', async () => {
    const { save } = await updateSave.execute({
      track_reference_id: 'track-reference-id-01',
      completion_rate: 50,
      student_id: 'user1-id',
      time_elapsed: 100,
      saveFileBase64: 'dGVzdGU=', // dGVzdGU= = teste
      track_name: 'New Track Name',
    })

    expect(get(save, 'student_id')).toBe('user1-id')
    expect(get(save, 'id')).toBe('personal-save1-id')
    expect(get(save, 'total_time_played')).toBe(100)
    expect(get(save, 'game_save')).toBe('dGVzdGU=')
    expect(get(save, 'current_track')).toBe('New Track Name')
  })

  it('should be able to update a save and increment the time played', async () => {
    await updateSave.execute({
      completion_rate: 50,
      student_id: 'user1-id',
      time_elapsed: 100,
      saveFileBase64: 'dGVzdGU=', // dGVzdGU= = teste
      track_reference_id: 'track-reference-id-01',
    })

    const { save } = await updateSave.execute({
      completion_rate: 70,
      student_id: 'user1-id',
      time_elapsed: 20,
      saveFileBase64: 'dGVzdGU=', // dGVzdGU= = teste
      track_reference_id: 'track-reference-id-01',
    })

    const track = save?.tracks.find(
      (item) => item.track_reference_id === 'track-reference-id-01'
    )

    expect(get(save, 'student_id')).toBe('user1-id')
    expect(get(save, 'id')).toBe('personal-save1-id')
    expect(get(save, 'total_time_played')).toBe(120)
    expect(get(save, 'game_save')).toBe('dGVzdGU=')
    expect(track?.time_played).toBe(120)
  })

  it('should be able to start a new track and calculate the time for each track independently', async () => {
    await updateSave.execute({
      completion_rate: 100,
      student_id: 'user1-id',
      time_elapsed: 200,
      saveFileBase64: 'dGVzdGU=', // dGVzdGU= = teste
      track_reference_id: 'track-reference-id-01',
    })

    const { save } = await updateSave.execute({
      completion_rate: 50,
      student_id: 'user1-id',
      time_elapsed: 300,
      saveFileBase64: 'dGVzdGU=', // dGVzdGU= = teste
      track_reference_id: 'track-reference-id-02',
      track_description: 'Track 02',
      track_name: 'track-02',
    })

    const track = save?.tracks.find(
      (item) => item.track_reference_id === 'track-reference-id-02'
    )

    expect(get(save, 'student_id')).toBe('user1-id')
    expect(get(save, 'id')).toBe('personal-save1-id')
    expect(get(save, 'total_time_played')).toBe(500)
    expect(get(save, 'game_save')).toBe('dGVzdGU=')
    expect(get(save, 'tracks.length')).toBe(2)
    expect(track?.time_played).toBe(300)
  })

  it('should not be able to update a save with an invalid user-id', async () => {
    let messageError = ''

    try {
      await updateSave.execute({
        student_id: 'invalid-user-id',
        completion_rate: 50,
        time_elapsed: 100,
        saveFileBase64: 'dGVzdGU=',
        track_reference_id: 'track-reference-id-01',
      })
    } catch (err) {
      messageError = String(err)
    }

    expect(messageError.includes(ERROR_LIST.STUDENT.NOT_FOUND)).toBe(true)
  })
})
