export type UserRole = 'student' | 'parent' | 'teacher' | 'admin'

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
  success: boolean
  /** Present after password login when the API returns the user. */
  role?: UserRole
}
