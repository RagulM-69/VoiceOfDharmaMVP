const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
const RECAPTCHA_ENABLED = process.env.RECAPTCHA_ENABLED === 'true'
const MIN_SCORE = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.3')

export async function verifyRecaptcha(
  token: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  // If reCAPTCHA is disabled at config level, allow through
  if (!RECAPTCHA_ENABLED) {
    return { success: true, score: 1.0 }
  }

  // In development mode, allow dev testing if keys or token are missing or fail domain check on localhost
  if (process.env.NODE_ENV === 'development') {
    if (!RECAPTCHA_SECRET_KEY || !token || token === 'dev_token') {
      console.warn('[reCAPTCHA Dev Fallback] Allowing request in development mode.')
      return { success: true, score: 1.0 }
    }
  } else {
    // Missing secret key — fail closed in production
    if (!RECAPTCHA_SECRET_KEY) {
      console.error('[reCAPTCHA] RECAPTCHA_SECRET_KEY is not set.')
      return { success: false, error: 'Server misconfiguration' }
    }

    // Missing or placeholder token
    if (!token || token === 'dev_token') {
      console.warn('[reCAPTCHA] Missing or placeholder token received.')
      return { success: false, error: 'Verification token missing' }
    }
  }

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY!,
          response: token,
        }),
      }
    )

    const data = await response.json()

    if (process.env.NODE_ENV === 'development') {
      console.log('[reCAPTCHA] Verify response:', JSON.stringify(data))
    }

    if (!data.success) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[reCAPTCHA Dev Fallback] Google rejected localhost domain, allowing dev test.', data)
        return { success: true, score: 1.0 }
      }
      return { success: false, score: data.score, error: 'Token validation failed' }
    }

    if (data.score < MIN_SCORE) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[reCAPTCHA Dev Fallback] Score low in dev mode, allowing dev test.', data.score)
        return { success: true, score: 1.0 }
      }
      return { success: false, score: data.score, error: `Score too low: ${data.score}` }
    }

    return { success: true, score: data.score }
  } catch (error) {
    console.error('[reCAPTCHA] Verification error:', error)
    if (process.env.NODE_ENV === 'development') {
      return { success: true, score: 1.0 }
    }
    return { success: false, error: 'Network error during verification' }
  }
}

