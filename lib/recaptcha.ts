const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!
const MIN_SCORE = 0.5

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number }> {
  if (!RECAPTCHA_SECRET_KEY || !token) {
    // If keys not configured, allow through (dev mode)
    if (process.env.NODE_ENV === 'development') {
      return { success: true, score: 1.0 }
    }
    return { success: false }
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      }
    )

    const data = await response.json()

    if (!data.success || data.score < MIN_SCORE) {
      return { success: false, score: data.score }
    }

    return { success: true, score: data.score }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return { success: false }
  }
}
