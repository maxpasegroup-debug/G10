import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '../auth/types'
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
      navigate(`/dashboard?role=${nextRole}`)
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
