export type UserRole = 'student' | 'parent' | 'teacher'

export interface LoginCredentials {
  role: UserRole
  /** Email address or mobile number (E.164 or local format). */
  emailOrMobile: string
}

export interface PasswordLoginPayload extends LoginCredentials {
  password: string
}

export interface OtpLoginPayload extends LoginCredentials {
  otp: string
}

export interface AuthResult {
  /** Future: session token, user id, etc. */
  success: boolean
}
