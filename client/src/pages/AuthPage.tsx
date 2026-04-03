import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '../auth/types'
import { decodeJwtPayload, getDashboardPathForRole, isJwtExpired } from '../auth/jwt'
import { getStoredToken } from '../auth/authService'
import { AuthLayout } from '../components/auth/AuthLayout'
import { LoginForm } from '../components/auth/LoginForm'
import { RoleSelection } from '../components/auth/RoleSelection'

export function AuthPage() {
  const [role, setRole] = useState<UserRole | null>(null)
  const navigate = useNavigate()

  const handleSelectRole = useCallback((r: UserRole) => {
    setRole(r)
  }, [])

  const handleChangeRole = useCallback(() => {
    setRole(null)
  }, [])

  const handleLoginSuccess = useCallback(
    (nextRole: UserRole) => {
      const token = getStoredToken()
      const payload = decodeJwtPayload(token)
      let path: string | null = null
      if (token && payload && !isJwtExpired(payload)) {
        path = getDashboardPathForRole(payload.role)
      }
      if (!path) path = getDashboardPathForRole(nextRole)
      if (path) navigate(path, { replace: true })
      else navigate('/login', { replace: true })
    },
    [navigate],
  )

  return (
    <AuthLayout>
      {role === null ? (
        <RoleSelection onSelect={handleSelectRole} />
      ) : (
        <LoginForm
          role={role}
          onChangeRole={handleChangeRole}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </AuthLayout>
  )
}
