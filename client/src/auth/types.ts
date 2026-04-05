export type UserRole = 'student' | 'parent' | 'teacher' | 'admin'

export interface PasswordLoginPayload {
  role: UserRole
  /** Mobile number (students/parents/teachers) or email (e.g. admin@g10amr.com). */
  identifier: string
  password: string
}

export interface AuthResult {
  success: boolean
  /** Present after password login when the API returns the user. */
  role?: UserRole
}
