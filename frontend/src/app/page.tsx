'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { TrendingUp, DollarSign, PieChart, Activity, Shield, RefreshCw, LogOut } from 'lucide-react'

interface LoginForm {
  username: string
  password: string
  mfaCode: string
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
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
      const response = await fetch('/api/auth/login', {
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
        setIsLoggedIn(true)
      } else {
        alert(data.message || 'Login failed')
      }
    } catch (error) {
      alert('Connection error. Please make sure the backend server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
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

  return <Dashboard />
}

function Dashboard() {
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/portfolio/summary')
      const data = await response.json()
      if (data.success) {
        setPortfolioData(data.data)
      } else {
        setError(data.message || 'Failed to fetch portfolio data')
      }
    } catch (err) {
      setError('Error connecting to the server. Please make sure the backend is running.')
      console.error('Error fetching portfolio data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setError(null)
    fetchPortfolioData()
  }

  // Fetch data on mount
  useEffect(() => {
    fetchPortfolioData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto">
              <RefreshCw className="animate-spin h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">Loading Portfolio Data</p>
            <p className="text-gray-600 dark:text-gray-400">Analyzing your investments...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border border-red-200 dark:border-red-800 bg-white/95 dark:bg-black/90 backdrop-blur-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/50">
              <Activity className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Connection Error</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Unable to load your portfolio data
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button 
              onClick={handleRefresh} 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Portfolio Analyzer
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-300">Real-time insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button 
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Portfolio Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time insights into your investment performance
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        {portfolioData && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-800/50 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-gray-950 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total Equity</CardTitle>
                <div className="p-2 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  ${portfolioData.total_equity?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Current portfolio value</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-800/50 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-gray-950 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">Market Value</CardTitle>
                <div className="p-2 bg-green-500/10 dark:bg-green-400/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                  ${portfolioData.total_market_value?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">Total market value</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-800/50 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-gray-950 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Total Positions</CardTitle>
                <div className="p-2 bg-purple-500/10 dark:bg-purple-400/10 rounded-lg">
                  <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {portfolioData.total_positions || 0}
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">Number of holdings</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-800/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-gray-950 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">Total Dividends</CardTitle>
                <div className="p-2 bg-amber-500/10 dark:bg-amber-400/10 rounded-lg">
                  <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  ${portfolioData.total_dividends?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">Lifetime dividends earned</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <PieChart className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                  Portfolio Overview
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Comprehensive analysis of your investment portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black rounded-xl border border-slate-200 dark:border-gray-800">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <PieChart className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Advanced Analytics Coming Soon
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        Interactive charts, performance metrics, and detailed portfolio breakdowns will be available in the next update.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Explore your portfolio insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all" variant="outline">
                  <TrendingUp className="h-5 w-5 mr-3 text-green-500" />
                  View Performance
                </Button>
                <Button className="w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all" variant="outline">
                  <PieChart className="h-5 w-5 mr-3 text-purple-500" />
                  Asset Allocation
                </Button>
                <Button className="w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-600 transition-all" variant="outline">
                  <Activity className="h-5 w-5 mr-3 text-amber-500" />
                  Dividend History
                </Button>
                <Button className="w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all" variant="outline">
                  <DollarSign className="h-5 w-5 mr-3 text-indigo-500" />
                  Performance Report
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Market Insights</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Latest market trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Market Rally</h4>
                      <p className="text-blue-700 dark:text-blue-300 text-xs">S&P 500 reaches record highs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">Tech Surge</h4>
                      <p className="text-green-700 dark:text-green-300 text-xs">Strong quarterly earnings</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                    <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">Dividend Season</h4>
                      <p className="text-purple-700 dark:text-purple-300 text-xs">Q4 payouts announced</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
