/**
 * Generates a unique code for a course based on the current date, a random code, and the current second of the day.
 *
 * @returns {string} The generated unique course code.
 *
 * The course code will have the format: "DDMM-RDMYY-SSSSS".
 *
 * DD: Current day with 2 digits.
 *
 * MM: Current month with 2 digits (1-indexed).
 *
 * RDM: Three random characters (Alphanumeric).
 *
 * YY: Last two digits of the current year.
 *
 * SSSSS: Current seconds of the day. Five digits with "X" padding.
 *
 */
export function generateCourseCode(): string {
  const currentDate = new Date()

  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = String(currentDate.getFullYear()).slice(-2)

  const randomChars = Array.from({ length: 3 }, () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return chars[Math.floor(Math.random() * chars.length)]
  }).join('')

  const currentHour = currentDate.getHours()
  const currentMinute = currentDate.getMinutes()
  const currentSecond = currentDate.getSeconds()

  const currentSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond

  const seconds = String(currentSeconds).padStart(5, 'X')

  const courseCode = `${day}${month}-${randomChars}${year}-${seconds}`

  return courseCode.toUpperCase()
}
