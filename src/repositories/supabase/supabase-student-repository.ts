import { Prisma } from '@prisma/client'
import { IStudentRepository } from '@/repositories/students.repository.types'
import { randomUUID } from 'node:crypto'
import { supabase } from '@/lib/supabase'

export class SupabaseStudentRepository implements IStudentRepository {
  async create({
    email,
    password_hash,
    student_name,
  }: Pick<
    Prisma.StudentCreateInput,
    'email' | 'student_name' | 'password_hash'
  >) {
    const student_id = randomUUID()
    const save_id = randomUUID()

    const { data: save, error: saveError } = await supabase
      .from('saves')
      .insert({
        player_level: 0,
        experience: 0,
        total_time_played: 0,
        student_id: student_id,
        id: save_id,
      })
      .select('*')
      .single()

    if (saveError || !save) {
      console.error('Error creating save:', saveError)
      return null
    }

    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        email,
        password_hash,
        student_name,
        id: student_id,
        save_id: save_id,
      })
      .select('*')
      .single()

    if (studentError || !student) {
      console.error('Error creating student:', studentError)

      const { error: deleteSaveError } = await supabase
        .from('saves')
        .delete()
        .eq('id', save_id)

      if (deleteSaveError) {
        console.error('Error rolling back save:', deleteSaveError)
      }

      return null
    }

    const studentWithSave = {
      ...student,
      save,
    }

    return studentWithSave
  }

  async findByUniqueEmail({ email }: { email: string }) {
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single()

    return student
  }

  async findByUniqueID({ id }: { id: string }) {
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()

    return student
  }

  async updateSessionID({ id }: { id: string }) {
    const session_id = randomUUID()

    const { data: updatedStudent, error: updateError } = await supabase
      .from('students')
      .update({ session_id })
      .eq('id', id)
      .select('*')
      .single()

    if (updateError || !updatedStudent) {
      console.error('Error updating student session_id:', updateError)
      return null
    }

    // Fetch the student with their save and tracks
    const { data: student, error: fetchError } = await supabase
      .from('students')
      .select(
        `
          *,
          saves (
            id,
            player_level,
            experience,
            total_time_played,
            current_track,
            current_track_id,
            game_save,
            tracks(*)
          )
        `
      )
      .eq('id', id)
      .single()

    if (fetchError || !student) {
      console.error('Error fetching student with save and tracks:', fetchError)
      return null
    }

    const { saves, ...studentData } = student
    const studentWithSave = {
      ...studentData,
      save: saves,
    }

    return studentWithSave
  }

  async endSessionID({ id }: { id: string }) {
    const { data: updatedStudent, error: updateError } = await supabase
      .from('students')
      .update({ session_id: null })
      .eq('id', id)
      .select('*')
      .single()

    if (updateError || !updatedStudent) {
      console.error('Error updating student session_id:', updateError)
      return null
    }
  }

  async findUniqueSave({ student_id }: { student_id: string }) {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', student_id)
      .single()

    if (studentError) {
      console.error('Error finding student:', studentError)
      return null
    }

    if (!student) {
      console.log('Student not found')
      return null
    }

    const { data: save, error: saveError } = await supabase
      .from('saves')
      .select('*')
      .eq('student_id', student_id)
      .single()

    if (saveError) {
      console.error('Error finding save:', saveError)
      return null
    }

    if (!save) {
      console.log('Save not found')
      return null
    }

    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('*')
      .eq('save_id', save.id)
      .order('track_reference_id')

    if (tracksError) {
      console.error('Error finding tracks:', tracksError)
      return null
    }

    const saveWithTracks = {
      ...save,
      tracks: tracks || [],
    }

    return saveWithTracks
  }

  async updateSave({
    student_id,
    time_played,
    saveFileBase64,
    current_track_name,
    current_track_id,
  }: {
    student_id: string
    saveFileBase64?: string
    time_played: bigint
    current_track_name?: string
    current_track_id?: string
  }) {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('id', student_id)
      .single()

    if (studentError || !student) {
      console.error('Erro ao buscar aluno:', studentError?.message)
      return null
    }

    const { data: save, error: saveError } = await supabase
      .from('saves')
      .select('id, total_time_played')
      .eq('student_id', student_id)
      .single()

    if (saveError || !save) {
      console.error('Erro ao buscar save:', saveError?.message)
      return null
    }

    const totalTimePlayed = BigInt(save.total_time_played) + BigInt(time_played)

    const { data: updatedSave, error: updateError } = await supabase
      .from('saves')
      .update({
        game_save: saveFileBase64,
        total_time_played: totalTimePlayed.toString(),
        current_track: current_track_name,
        current_track_id,
      })
      .eq('id', save.id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Erro ao atualizar save:', updateError.message)
      return null
    }

    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('*')
      .eq('save_id', updatedSave.id)

    if (tracksError) {
      console.error('Erro ao buscar tracks:', tracksError.message)
      return null
    }

    return {
      ...updatedSave,
      tracks,
    }
  }

  async findUniqueTrack({
    student_id,
    track_reference_id,
  }: {
    student_id: string
    track_reference_id: string
  }) {
    const { data: save, error: saveError } = await supabase
      .from('saves')
      .select('*')
      .eq('student_id', student_id)
      .single()

    if (saveError) {
      console.error('Error finding save:', saveError)
      return null
    }

    if (!save) {
      console.log('Save not found')
      return null
    }

    const { data: track, error: trackError } = await supabase
      .from('tracks')
      .select('*')
      .eq('save_id', save.id)
      .eq('track_reference_id', track_reference_id)
      .single()

    if (trackError) {
      console.error('Error finding unique track:', trackError)
      return null
    }

    return track || null
  }

  async updateOrCreateTrack({
    track_reference_id,
    completion_rate,
    track_id,
    track_description,
    track_name,
    student_id,
    time_played,
  }: {
    track_reference_id: string
    track_id: string
    completion_rate: number
    track_description?: string | undefined
    track_name?: string | undefined
    student_id: string
    time_played: bigint
  }) {
    const { data: save, error: saveError } = await supabase
      .from('saves')
      .select('*')
      .eq('student_id', student_id)
      .single()

    if (saveError) {
      console.error('Error finding save:', saveError)
      return null
    }

    const { data: updatedTrack, error: trackError } = await supabase
      .from('tracks')
      .upsert({
        track_reference_id,
        id: track_id || randomUUID(),
        completion_rate,
        description: track_description,
        name: track_name,
        save_id: save.id,
        time_played: time_played.toString(),
      })
      .single()

    if (trackError) {
      console.error('Error creating or updating track:', trackError)
      return null
    }

    return updatedTrack
  }
}
