'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { Dashboard } from '@/components/dashboard/Dashboard'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <LoginForm onLogin={setIsLoggedIn} />
  }

  return <Dashboard setIsLoggedIn={setIsLoggedIn} />
}