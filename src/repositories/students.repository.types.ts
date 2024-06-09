import { Prisma, Student, Track } from '@prisma/client'

type StudentType = Prisma.StudentGetPayload<{
  include: {
    save: {
      select: {
        current_track: true
        experience: true
        game_save: true
        id: true
        player_level: true
        total_time_played: true
        tracks: true
      }
    }
  }
}>

type StudentWithouGameSaveFileType = Prisma.StudentGetPayload<{
  include: {
    save: {
      select: {
        current_track: true
        experience: true
        game_save: false
        id: true
        player_level: true
        total_time_played: true
        tracks: true
      }
    }
  }
}>

type SaveWithTracks = Prisma.SaveGetPayload<{
  include: {
    tracks: true
  }
}>

export type TUpdateSaveProps = {
  student_id: string
  saveFileBase64?: string
  time_elapsed: number
  track_reference_id: string
  track_name?: string
  track_description?: string
  completion_rate: number
}

export interface IStudentRepository {
  create(data: Prisma.StudentCreateInput): Promise<StudentType>
  findByUniqueEmail({ email }: { email: string }): Promise<Student | null>
  findByUniqueID({
    id,
  }: {
    id: string
  }): Promise<StudentWithouGameSaveFileType | null>
  updateSessionID({ id }: { id: string }): Promise<StudentType | null>
  endSessionID({ id }: { id: string }): Promise<void | null>
  updateSave({
    student_id,
    saveFileBase64,
    time_played,
    current_track_name,
    current_track_id,
  }: {
    student_id: string
    saveFileBase64?: string
    time_played: number
    current_track_name?: string
    current_track_id?: string
  }): Promise<SaveWithTracks | null>
  findUniqueSave({
    student_id,
  }: {
    student_id: string
  }): Promise<SaveWithTracks | null>
  findUniqueTrack({
    student_id,
    track_reference_id,
  }: {
    student_id: string
    track_reference_id: string
  }): Promise<Track | null>
  updateOrCreateTrack({
    track_reference_id,
    track_id,
    completion_rate,
    track_description,
    track_name,
    student_id,
    time_played,
  }: {
    track_reference_id: string
    track_id: string
    completion_rate: number
    track_description?: string
    track_name?: string
    student_id: string
    time_played: number
  }): Promise<Track | null>
}
