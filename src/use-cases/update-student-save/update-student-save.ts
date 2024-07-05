import { ERROR_LIST } from '@/constants/erros'
import {
  IStudentRepository,
  TUpdateSaveProps,
} from '@/repositories/students.repository.types'

export class UpdateStudentSaveUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute({
    student_id,
    completion_rate,
    saveFileBase64,
    time_elapsed,
    track_reference_id,
    track_description,
    track_name,
  }: TUpdateSaveProps) {
    const student = await this.studentRepository.findByUniqueID({
      id: student_id,
    })

    if (!student) {
      throw new Error(ERROR_LIST.STUDENT.NOT_FOUND)
    }

    const currentSave = await this.studentRepository.findUniqueSave({
      student_id,
    })

    if (!currentSave) {
      throw new Error(ERROR_LIST.STUDENT.SAVE_NOT_FOUND)
    }

    const currentTrack = await this.studentRepository.findUniqueTrack({
      student_id,
      track_reference_id,
    })

    await this.studentRepository.updateOrCreateTrack({
      completion_rate,
      student_id,
      time_played:
        BigInt(currentTrack?.time_played || 0) + BigInt(time_elapsed),
      track_name,
      track_reference_id,
      track_id: currentTrack?.id || '',
      track_description,
    })

    const updatedSave = await this.studentRepository.updateSave({
      student_id,
      saveFileBase64,
      time_played: BigInt(currentSave.total_time_played) + time_elapsed,
      current_track_name: track_name,
      current_track_id: track_reference_id,
    })

    return { save: updatedSave }
  }
}
