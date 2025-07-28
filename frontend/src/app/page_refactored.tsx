'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { Dashboard } from '@/components/dashboard/Dashboard'

export default function Home() {
  const {
    isLoggedIn,
    isLoading,
    loginForm,
    setIsLoggedIn,
    updateLoginForm,
    handleLogin
  } = useAuth()

  if (!isLoggedIn) {
    return (
      <LoginForm
        loginForm={loginForm}
        isLoading={isLoading}
        onSubmit={handleLogin}
        onUpdateForm={updateLoginForm}
      />
    )
  }

  return <Dashboard setIsLoggedIn={setIsLoggedIn} />
}