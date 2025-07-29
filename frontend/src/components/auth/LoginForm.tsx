'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { TrendingUp, Shield, RefreshCw } from 'lucide-react'

interface LoginForm {
  username: string
  password: string
  mfaCode: string
}

interface LoginFormProps {
  onLogin: (isLoggedIn: boolean) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: '',
    password: '',
    mfaCode: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
          mfa_code: loginForm.mfaCode || undefined,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        onLogin(true)
      } else {
        alert(data.message || 'Login failed')
      }
    } catch (error) {
      alert('Connection error. Please make sure the backend server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-slate-100 dark:from-blue-950/20 dark:via-black dark:to-black opacity-70"></div>
      
      <Card className="w-full max-w-md shadow-2xl border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md relative z-10">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Portfolio Analyzer
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
              Connect your Robinhood account for comprehensive portfolio insights
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-3">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-white">
                Username/Email
              </label>
              <Input
                id="username"
                type="email"
                placeholder="Enter your Robinhood email"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                required
                autoComplete="username"
                className="h-12 bg-white/50 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors relative z-10"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-white">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
                autoComplete="current-password"
                className="h-12 bg-white/50 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors relative z-10"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="mfaCode" className="text-sm font-semibold text-gray-700 dark:text-white">
                MFA Code <span className="text-gray-400 font-normal">(if required)</span>
              </label>
              <Input
                id="mfaCode"
                type="text"
                placeholder="Enter 6-digit MFA code"
                value={loginForm.mfaCode}
                onChange={(e) => setLoginForm(prev => ({ ...prev, mfaCode: e.target.value }))}
                autoComplete="one-time-code"
                className="h-12 bg-white/50 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors relative z-10"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Signing in...
                </div>
              ) : 'Sign in to Portfolio'}
            </Button>
          </form>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-300">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Your credentials are secure and encrypted
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}