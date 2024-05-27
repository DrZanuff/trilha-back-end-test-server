import { expect, describe, it } from 'vitest'

import { secondsToTime } from './seconds-to-time'

describe('secondsToTime function', () => {
  it('should convert seconds to a formatted time string', () => {
    // Test case: 3665 seconds (1 hour, 1 minute, and 5 seconds)
    expect(secondsToTime(3665)).toEqual('01:01:05')

    // Test case: 3600 seconds (1 hour and 0 minutes)
    expect(secondsToTime(3600)).toEqual('01:00:00')

    // Test case: 60 seconds (0 hours, 1 minute, and 0 seconds)
    expect(secondsToTime(60)).toEqual('00:01:00')

    // Test case: 0 seconds (0 hours, 0 minutes, and 0 seconds)
    expect(secondsToTime(0)).toEqual('00:00:00')

    // Test case: 100000 seconds (27 hours, 46 minutes, and 40 seconds)
    expect(secondsToTime(100000)).toEqual('27:46:40')
  })
})
