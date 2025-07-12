// Utility functions for handling rate limits

export interface RateLimitInfo {
  isLimited: boolean
  resetTime?: Date
  attemptsRemaining?: number
  waitTimeMinutes?: number
}

export function parseRateLimitError(errorMessage: string): RateLimitInfo {
  const message = errorMessage.toLowerCase()

  // Check for various rate limit error patterns
  if (
    (message.includes("rate") && message.includes("limit")) ||
    message.includes("too many") ||
    message.includes("exceeded") ||
    message.includes("email_send_rate_limit")
  ) {
    return {
      isLimited: true,
      waitTimeMinutes: 60, // Default to 1 hour wait
      resetTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    }
  }

  return {
    isLimited: false,
  }
}

export function getLocalRateLimitInfo(email: string): RateLimitInfo {
  const key = `rate_limit_${email}`
  const stored = localStorage.getItem(key)

  if (!stored) {
    return { isLimited: false }
  }

  try {
    const data = JSON.parse(stored)
    const resetTime = new Date(data.resetTime)

    if (new Date() > resetTime) {
      // Rate limit has expired
      localStorage.removeItem(key)
      return { isLimited: false }
    }

    return {
      isLimited: true,
      resetTime,
      waitTimeMinutes: Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60)),
    }
  } catch {
    localStorage.removeItem(key)
    return { isLimited: false }
  }
}

export function setLocalRateLimitInfo(email: string, waitTimeMinutes = 60) {
  const key = `rate_limit_${email}`
  const resetTime = new Date(Date.now() + waitTimeMinutes * 60 * 1000)

  localStorage.setItem(
    key,
    JSON.stringify({
      resetTime: resetTime.toISOString(),
      email,
    }),
  )
}

export function clearLocalRateLimitInfo(email: string) {
  const key = `rate_limit_${email}`
  localStorage.removeItem(key)
}
