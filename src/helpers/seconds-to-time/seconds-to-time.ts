/**
 * Converts seconds to a formatted time string in the format "HH:MM:SS".
 * @param {number} seconds - The number of seconds to convert.
 * @returns {string} The formatted time string.
 */
export function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`

  return formattedTime
}
