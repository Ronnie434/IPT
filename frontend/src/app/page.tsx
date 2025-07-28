'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { TrendingUp, DollarSign, PieChart, Activity, Shield, RefreshCw, LogOut, ChevronDown, ChevronUp, MoreHorizontal, BarChart3, Info } from 'lucide-react'
import { SkeletonCard, SkeletonTable, SkeletonList, SkeletonStats } from '@/components/ui/skeleton'
import { MobileNavDrawer } from '@/components/ui/mobile-nav-drawer'

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

  return <Dashboard setIsLoggedIn={setIsLoggedIn} />
}

function Dashboard({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) {
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [holdingsData, setHoldingsData] = useState<any>(null)
  const [dividendsData, setDividendsData] = useState<any>(null)
  const [ordersData, setOrdersData] = useState<any>(null)
  const [openOrdersData, setOpenOrdersData] = useState<any>(null)
  const [accountData, setAccountData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [stockAnalysisData, setStockAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedHoldings, setExpandedHoldings] = useState<Set<string>>(new Set())
  const [showAllOrders, setShowAllOrders] = useState(false)
  const [showAllDividends, setShowAllDividends] = useState(false)
  const [portfolioSummaryExpanded, setPortfolioSummaryExpanded] = useState(false)

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [summaryResponse, holdingsResponse, dividendsResponse, ordersResponse, openOrdersResponse, accountResponse, userResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/summary`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/holdings`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/dividends`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/all`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/open`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/info`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/info`)
      ])
      
      const [summaryData, holdingsDataResponse, dividendsDataResponse, ordersDataResponse, openOrdersDataResponse, accountDataResponse, userDataResponse] = await Promise.all([
        summaryResponse.json(),
        holdingsResponse.json(),
        dividendsResponse.json(),
        ordersResponse.json(),
        openOrdersResponse.json(),
        accountResponse.json(),
        userResponse.json()
      ])
      
      if (summaryData.success) {
        setPortfolioData(summaryData.data)
      } else {
        setError(summaryData.message || 'Failed to fetch portfolio summary')
      }
      
      if (holdingsDataResponse.success) {
        setHoldingsData(holdingsDataResponse.data)
      } else {
        console.warn('Failed to fetch holdings data:', holdingsDataResponse.message)
      }
      
      if (dividendsDataResponse.success) {
        setDividendsData(dividendsDataResponse.data)
      } else {
        console.warn('Failed to fetch dividends data:', dividendsDataResponse.message)
      }
      
      if (ordersDataResponse.success) {
        setOrdersData(ordersDataResponse.data)
      } else {
        console.warn('Failed to fetch orders data:', ordersDataResponse.message)
      }
      
      if (openOrdersDataResponse.success) {
        setOpenOrdersData(openOrdersDataResponse.data)
      } else {
        console.warn('Failed to fetch open orders data:', openOrdersDataResponse.message)
      }
      
      if (accountDataResponse.success) {
        setAccountData(accountDataResponse.data)
      } else {
        console.warn('Failed to fetch account data:', accountDataResponse.message)
      }
      
      if (userDataResponse.success) {
        setUserData(userDataResponse.data)
      } else {
        console.warn('Failed to fetch user data:', userDataResponse.message)
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

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggedIn(false)
    }
  }

  const handleClearSession = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (data.success) {
        alert('Session cleared successfully')
        fetchPortfolioData()
      } else {
        alert(data.message || 'Failed to clear session')
      }
    } catch (error) {
      alert('Error clearing session')
      console.error('Clear session error:', error)
    }
  }

  const handleClearCache = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cache/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (data.success) {
        alert('Cache cleared successfully')
        fetchPortfolioData()
      } else {
        alert(data.message || 'Failed to clear cache')
      }
    } catch (error) {
      alert('Error clearing cache')
      console.error('Clear cache error:', error)
    }
  }

  const fetchStockAnalysis = async (symbol: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stock/${symbol}`)
      const data = await response.json()
      if (data.success) {
        setStockAnalysisData(data.data)
        setSelectedStock(symbol)
        setActiveTab('stock-analysis')
      } else {
        alert(data.message || 'Failed to fetch stock analysis')
      }
    } catch (error) {
      alert('Error fetching stock analysis')
      console.error('Stock analysis error:', error)
    }
  }

  const handleBackToHoldings = () => {
    setSelectedStock(null)
    setStockAnalysisData(null)
    setActiveTab('holdings')
  }

  const toggleHoldingExpansion = (symbol: string) => {
    const newExpanded = new Set(expandedHoldings)
    if (newExpanded.has(symbol)) {
      newExpanded.delete(symbol)
    } else {
      newExpanded.add(symbol)
    }
    setExpandedHoldings(newExpanded)
  }

  // Fetch data on mount
  useEffect(() => {
    fetchPortfolioData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg animate-pulse">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gradient-blue">Portfolio Analyzer</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-300">Loading insights...</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Dashboard Header Skeleton */}
          <div className="text-center lg:text-left space-y-3 animate-fade-in">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-80 mx-auto lg:mx-0 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto lg:mx-0 animate-pulse"></div>
          </div>

          {/* Portfolio Summary Cards Skeleton */}
          <SkeletonStats count={4} className="animate-slide-up" />

          {/* Navigation Tabs Skeleton */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/10 p-2">
              <div className="flex space-x-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" style={{ width: `${80 + index * 10}px`, animationDelay: `${index * 0.1}s` }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="lg:col-span-2 space-y-6">
              <SkeletonCard variant="detailed" />
              <SkeletonTable rows={5} columns={4} />
            </div>
            <div className="space-y-6">
              <SkeletonCard variant="compact" />
              <SkeletonCard variant="default" />
              <SkeletonList items={4} withAvatar={true} />
            </div>
          </div>

          {/* Loading Animation Center */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-center space-y-6 animate-bounce-gentle">
              <div className="relative">
                <div className="w-20 h-20 mx-auto">
                  <RefreshCw className="animate-spin h-20 w-20 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white animate-pulse">Loading Portfolio Data</p>
                <p className="text-gray-600 dark:text-gray-400">Analyzing your investments...</p>
              </div>
            </div>
          </div>
        </main>
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
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm" role="banner" aria-label="Site header">
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
                  {/* <p className="text-xs text-gray-500 dark:text-gray-300">Real-time insights</p> */}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <MobileNavDrawer
                activeTab={activeTab}
                onTabChange={setActiveTab}
                selectedStock={selectedStock}
                onBackToHoldings={handleBackToHoldings}
              />
              <div className="hidden sm:flex items-center space-x-3">
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 p-2"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleClearSession}
                  variant="outline"
                  size="sm"
                  className="border-yellow-300 dark:border-yellow-700 bg-white dark:bg-gray-900 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 p-2"
                  title="Clear Session"
                >
                  <Shield className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleClearCache}
                  variant="outline"
                  size="sm"
                  className="border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2"
                  title="Clear Cache"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 p-2"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" role="main" aria-label="Portfolio dashboard">
        {/* Dashboard Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2" id="dashboard-title">
            Portfolio Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300" aria-describedby="dashboard-title">
            Real-time insights into your investment performance
          </p>
        </div>

        {/* Enhanced Portfolio Summary Cards */}
        {portfolioData && (
          <section aria-labelledby="portfolio-summary" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <h2 id="portfolio-summary" className="sr-only">Portfolio Summary</h2>
            <Card className="group relative overflow-hidden animate-scale-in bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none" style={{ animationDelay: '0.1s' }} role="article" aria-labelledby="total-equity">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 dark:from-blue-500/20 dark:to-indigo-700/20"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wide" id="total-equity">Total Equity</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300" aria-describedby="total-equity">
                  ${portfolioData.total_equity?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-gray-600 dark:text-blue-300/80">Current portfolio value</p>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden animate-scale-in bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 dark:from-emerald-500/20 dark:to-teal-700/20"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-300 uppercase tracking-wide">Market Value</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  ${portfolioData.total_market_value?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-gray-600 dark:text-emerald-300/80">Total market value</p>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden animate-scale-in bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/5 dark:from-purple-500/20 dark:to-pink-700/20"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wide">Positions</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  {portfolioData.total_positions || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-purple-300/80">Number of holdings</p>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden animate-scale-in bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 dark:from-amber-500/20 dark:to-orange-700/20"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300 animate-pulse">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xs font-medium text-amber-600 dark:text-amber-300 uppercase tracking-wide">Dividends</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                  ${portfolioData.total_dividends?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-gray-600 dark:text-amber-300/80">Lifetime dividends earned</p>
              </CardHeader>
            </Card>
          </section>
        )}

        {/* Enhanced Navigation Tabs - Hidden on Mobile */}
        <nav className="relative hidden md:block" aria-labelledby="navigation-tabs" role="navigation">
          <h2 id="navigation-tabs" className="sr-only">Portfolio Navigation</h2>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 rounded-2xl"></div>
          <div className="relative bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/10 p-2">
            <div className="flex space-x-2 overflow-x-auto" role="tablist" style={{padding: "5px 0px"}}>
              {[
                { id: 'overview', name: 'Overview', icon: PieChart, color: 'blue' },
                { id: 'holdings', name: 'Holdings', icon: TrendingUp, color: 'emerald' },
                { id: 'dividends', name: 'Dividends', icon: Activity, color: 'purple' },
                { id: 'orders', name: 'Orders', icon: DollarSign, color: 'amber' },
                ...(selectedStock ? [{ id: 'stock-analysis', name: `${selectedStock} Analysis`, icon: TrendingUp, color: 'indigo' }] : [])
              ].map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                const colorClasses = {
                  blue: isActive 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30',
                  emerald: isActive 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
                  purple: isActive 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30',
                  amber: isActive 
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30',
                  indigo: isActive 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
                }
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => tab.id === 'stock-analysis' ? null : setActiveTab(tab.id)}
                    className={`
                      relative py-3 px-6 rounded-xl font-medium text-sm flex items-center space-x-3 transition-all duration-300 whitespace-nowrap transform
                      ${colorClasses[tab.color as keyof typeof colorClasses]}
                      ${isActive ? 'scale-105 -translate-y-0.5' : 'hover:scale-102'}
                      ${tab.id === 'stock-analysis' ? 'cursor-default' : 'cursor-pointer'}
                      animate-slide-up
                    `}
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${tab.id}-panel`}
                    tabIndex={isActive ? 0 : -1}
                    aria-label={`${tab.name} section`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'animate-bounce-gentle' : ''}`} />
                    <span className="font-semibold">{tab.name}</span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl from-white/20 to-transparent pointer-events-none"></div>
                    )}
                    {tab.id === 'stock-analysis' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBackToHoldings()
                        }}
                        className="ml-2 w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Dynamic Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
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
            )}

            {activeTab === 'holdings' && (
              <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                    Holdings
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Detailed view of your current positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {holdingsData && Object.keys(holdingsData).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(holdingsData).map(([symbol, holding]: [string, any]) => {
                        const isExpanded = expandedHoldings.has(symbol)
                        return (
                          <div key={symbol} className="border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden">
                            {/* Main Holding Info */}
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={() => fetchStockAnalysis(symbol)}
                                      className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                    >
                                      {symbol}
                                    </button>
                                    <button
                                      onClick={() => toggleHoldingExpansion(symbol)}
                                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                      aria-expanded={isExpanded}
                                      aria-controls={`holding-details-${symbol}`}
                                      aria-label={isExpanded ? `Hide details for ${symbol}` : `Show details for ${symbol}`}
                                    >
                                      {isExpanded ? 
                                        <ChevronUp className="h-4 w-4 text-gray-500" aria-hidden="true" /> : 
                                        <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
                                      }
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{holding.name || 'Stock'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-900 dark:text-white">${holding.price}</p>
                                  <p className={`text-sm font-medium ${
                                    parseFloat(holding.percent_change) >= 0 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    {parseFloat(holding.percent_change) >= 0 ? '+' : ''}{holding.percent_change}%
                                  </p>
                                </div>
                              </div>

                              {/* Basic Metrics - Always Visible */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                  <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide">Quantity</p>
                                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{holding.quantity}</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                  <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide">Market Value</p>
                                  <p className="text-lg font-bold text-green-900 dark:text-green-100">${holding.market_value}</p>
                                </div>
                                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                  <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wide">Avg Cost</p>
                                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100">${holding.average_buy_price}</p>
                                </div>
                                <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                                  <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide">Total Return</p>
                                  <p className={`text-lg font-bold ${
                                    parseFloat(holding.total_return_today) >= 0 
                                      ? 'text-emerald-600 dark:text-emerald-400' 
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    ${holding.total_return_today}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Details - Progressive Disclosure */}
                            {isExpanded && (
                              <div 
                                id={`holding-details-${symbol}`}
                                className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 animate-slide-down"
                                role="region"
                                aria-labelledby={`holding-metrics-${symbol}`}
                              >
                                <div className="p-6 space-y-4">
                                  <div className="flex items-center space-x-2 mb-4">
                                    <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                                    <h4 id={`holding-metrics-${symbol}`} className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Metrics for {symbol}</h4>
                                  </div>
                                  
                                  {/* Advanced Metrics Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {holding.pe_ratio && (
                                      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">{holding.pe_ratio}</p>
                                          </div>
                                          <Info className="h-5 w-5 text-gray-400" />
                                        </div>
                                      </div>
                                    )}
                                    
                                    {holding.dividend_yield && (
                                      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Dividend Yield</p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">{holding.dividend_yield}%</p>
                                          </div>
                                          <Activity className="h-5 w-5 text-green-500" />
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Calculate total value */}
                                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Investment</p>
                                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            ${(parseFloat(holding.average_buy_price) * parseFloat(holding.quantity)).toFixed(2)}
                                          </p>
                                        </div>
                                        <DollarSign className="h-5 w-5 text-blue-500" />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                      onClick={() => fetchStockAnalysis(symbol)}
                                      variant="gradient"
                                      size="sm"
                                      className="shadow-lg"
                                    >
                                      <BarChart3 className="h-4 w-4 mr-2" />
                                      View Analysis
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-gray-300 dark:border-gray-600"
                                    >
                                      <MoreHorizontal className="h-4 w-4 mr-2" />
                                      More Actions
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black rounded-xl border border-slate-200 dark:border-gray-800">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <TrendingUp className="h-10 w-10 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No Holdings Found
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md">
                            Your portfolio appears to be empty or the data is still loading.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'dividends' && (
              <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Activity className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                    Dividends
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Your dividend history and earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dividendsData && dividendsData.length > 0 ? (
                    <div className="space-y-4">
                      {/* Dividend Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Dividends</p>
                              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                ${portfolioData?.total_dividends?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                            <Activity className="h-8 w-8 text-green-500" />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Payments</p>
                              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {dividendsData.filter((div: any) => div.state === 'paid').length}
                              </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-blue-500" />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Unique Stocks</p>
                              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {new Set(dividendsData.map((div: any) => div.symbol)).size}
                              </p>
                            </div>
                            <PieChart className="h-8 w-8 text-purple-500" />
                          </div>
                        </div>
                      </div>

                      {/* Dividend History */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Dividend Payments</h3>
                          {dividendsData.length > 5 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAllDividends(!showAllDividends)}
                              className="border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                            >
                              {showAllDividends ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-2" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                  Show All ({dividendsData.length})
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        {dividendsData
                          .sort((a: any, b: any) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime())
                          .slice(0, showAllDividends ? dividendsData.length : 5)
                          .map((dividend: any, index: number) => (
                          <div key={dividend.id || index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-start space-x-3">
                                <div className={`w-3 h-3 rounded-full mt-2 ${
                                  dividend.state === 'paid' 
                                    ? 'bg-green-500' 
                                    : dividend.state === 'pending' 
                                      ? 'bg-yellow-500' 
                                      : 'bg-gray-500'
                                }`}></div>
                                <div>
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{dividend.symbol}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {dividend.state === 'paid' ? 'Paid' : dividend.state === 'pending' ? 'Pending' : 'Other'} • 
                                    {new Date(dividend.paid_at || dividend.payable_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                  ${parseFloat(dividend.amount).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  ${parseFloat(dividend.rate).toFixed(4)} per share
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Position</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{dividend.position} shares</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Record Date</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(dividend.record_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Payable Date</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(dividend.payable_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Status</p>
                                <p className={`font-semibold capitalize ${
                                  dividend.state === 'paid' 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : dividend.state === 'pending' 
                                      ? 'text-yellow-600 dark:text-yellow-400' 
                                      : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {dividend.state}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black rounded-xl border border-slate-200 dark:border-gray-800">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Activity className="h-10 w-10 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No Dividends Found
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md">
                            You haven't received any dividend payments yet, or the data is still loading.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'orders' && (
              <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                    Orders
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Your trading history and open orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(ordersData && ordersData.length > 0) || (openOrdersData && openOrdersData.length > 0) ? (
                    <div className="space-y-6">
                      {/* Orders Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Orders</p>
                              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {ordersData?.length || 0}
                              </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-blue-500" />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Open Orders</p>
                              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                {openOrdersData?.length || 0}
                              </p>
                            </div>
                            <Activity className="h-8 w-8 text-green-500" />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Buy Orders</p>
                              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                                {ordersData?.filter((order: any) => order.side === 'buy').length || 0}
                              </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-emerald-500" />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg border border-red-200 dark:border-red-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Sell Orders</p>
                              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                                {ordersData?.filter((order: any) => order.side === 'sell').length || 0}
                              </p>
                            </div>
                            <Activity className="h-8 w-8 text-red-500" />
                          </div>
                        </div>
                      </div>

                      {/* Open Orders Section */}
                      {openOrdersData && openOrdersData.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-green-500" />
                            Open Orders
                          </h3>
                          {openOrdersData.map((order: any, index: number) => (
                            <div key={order.id || index} className="p-4 border border-green-200 dark:border-green-700 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-start space-x-3">
                                  <div className={`w-3 h-3 rounded-full mt-2 ${
                                    order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                                  }`}></div>
                                  <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{order.symbol}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {order.side.toUpperCase()} • {order.type.toUpperCase()} • {order.time_in_force}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    ${parseFloat(order.price).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.quantity} shares
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">State</p>
                                  <p className="font-semibold text-green-600 dark:text-green-400 capitalize">{order.state}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Created</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Updated</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {new Date(order.updated_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Total Value</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    ${(parseFloat(order.price) * parseFloat(order.quantity)).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* All Orders Section */}
                      {ordersData && ordersData.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                              <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                              Recent Orders
                            </h3>
                            {ordersData.length > 10 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAllOrders(!showAllOrders)}
                                className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                              >
                                {showAllOrders ? (
                                  <>
                                    <ChevronUp className="h-4 w-4 mr-2" />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                    Show All ({ordersData.length})
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                          {ordersData
                            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .slice(0, showAllOrders ? ordersData.length : 10)
                            .map((order: any, index: number) => (
                            <div key={order.id || index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-start space-x-3">
                                  <div className={`w-3 h-3 rounded-full mt-2 ${
                                    order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                                  }`}></div>
                                  <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{order.symbol}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {order.side.toUpperCase()} • {order.type.toUpperCase()} • {order.time_in_force}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    ${parseFloat(order.price).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.quantity} shares
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">State</p>
                                  <p className={`font-semibold capitalize ${
                                    order.state === 'filled' 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : order.state === 'cancelled' 
                                        ? 'text-red-600 dark:text-red-400'
                                        : order.state === 'queued' || order.state === 'confirmed'
                                          ? 'text-yellow-600 dark:text-yellow-400'
                                          : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {order.state}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Created</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Updated</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {new Date(order.updated_at).toLocaleDateString()}
                                  </p>
                                </div>
                                {order.executed_at && (
                                  <div>
                                    <p className="text-gray-500 dark:text-gray-400">Executed</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                      {new Date(order.executed_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Total Value</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    ${(parseFloat(order.price) * parseFloat(order.quantity)).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black rounded-xl border border-slate-200 dark:border-gray-800">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <DollarSign className="h-10 w-10 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No Orders Found
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md">
                            You haven't placed any orders yet, or the data is still loading.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'stock-analysis' && stockAnalysisData && (
              <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <TrendingUp className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                      {selectedStock} Analysis
                    </CardTitle>
                    <Button 
                      onClick={handleBackToHoldings}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-700"
                    >
                      Back to Holdings
                    </Button>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Comprehensive analysis and trading history for {selectedStock}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current Holding */}
                    {stockAnalysisData.current_holding && Object.keys(stockAnalysisData.current_holding).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Position</h3>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400">Shares Owned</p>
                              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                {stockAnalysisData.current_holding.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400">Current Price</p>
                              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                ${stockAnalysisData.current_holding.price}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400">Market Value</p>
                              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                ${stockAnalysisData.current_holding.market_value}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400">Avg Cost</p>
                              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                ${stockAnalysisData.current_holding.average_buy_price}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Metrics Summary */}
                    {stockAnalysisData.metrics && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trading Metrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-600 dark:text-green-400">Total Bought</p>
                            <p className="text-lg font-bold text-green-900 dark:text-green-100">
                              {stockAnalysisData.metrics.total_bought_quantity}
                            </p>
                          </div>
                          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400">Total Sold</p>
                            <p className="text-lg font-bold text-red-900 dark:text-red-100">
                              {stockAnalysisData.metrics.total_sold_quantity}
                            </p>
                          </div>
                          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <p className="text-sm text-purple-600 dark:text-purple-400">Net Position</p>
                            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                              {stockAnalysisData.metrics.net_quantity}
                            </p>
                          </div>
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">Total Orders</p>
                            <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                              {stockAnalysisData.metrics.total_orders}
                            </p>
                          </div>
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">Buy Orders</p>
                            <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                              {stockAnalysisData.metrics.buy_orders}
                            </p>
                          </div>
                          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-800">
                            <p className="text-sm text-rose-600 dark:text-rose-400">Sell Orders</p>
                            <p className="text-lg font-bold text-rose-900 dark:text-rose-100">
                              {stockAnalysisData.metrics.sell_orders}
                            </p>
                          </div>
                          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <p className="text-sm text-indigo-600 dark:text-indigo-400">Calculated Avg</p>
                            <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                              ${stockAnalysisData.metrics.calculated_avg_price?.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
                            <p className="text-sm text-teal-600 dark:text-teal-400">Total Dividends</p>
                            <p className="text-lg font-bold text-teal-900 dark:text-teal-100">
                              ${stockAnalysisData.metrics.total_dividend_amount?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recent Orders */}
                    {stockAnalysisData.orders && stockAnalysisData.orders.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
                        <div className="space-y-3">
                          {stockAnalysisData.orders.slice(0, 5).map((order: any, index: number) => (
                            <div key={order.id || index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                                  }`}></div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {order.side.toUpperCase()} {order.quantity} shares
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {new Date(order.created_at).toLocaleDateString()} • {order.state}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    ${parseFloat(order.price).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ${(parseFloat(order.price) * parseFloat(order.quantity)).toFixed(2)} total
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dividends */}
                    {stockAnalysisData.dividends && stockAnalysisData.dividends.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dividend History</h3>
                        <div className="space-y-3">
                          {stockAnalysisData.dividends.slice(0, 5).map((dividend: any, index: number) => (
                            <div key={dividend.id || index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    ${parseFloat(dividend.amount).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(dividend.paid_at || dividend.payable_date).toLocaleDateString()} • {dividend.state}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ${parseFloat(dividend.rate).toFixed(4)} per share
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {dividend.position} shares
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Account Information</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your account and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {userData.first_name?.[0]?.toUpperCase() || userData.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {userData.first_name && userData.last_name 
                            ? `${userData.first_name} ${userData.last_name}`
                            : userData.username
                          }
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</p>
                      </div>
                    </div>
                    
                    {userData.account_id && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Account ID</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">{userData.account_id}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400">Loading account information...</p>
                  </div>
                )}
                
                {accountData && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Details</p>
                    <div className="space-y-2 text-sm">
                      {accountData.profile && Object.keys(accountData.profile).length > 0 && (
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <p className="text-green-700 dark:text-green-300">✓ Profile configured</p>
                        </div>
                      )}
                      {accountData.account && Object.keys(accountData.account).length > 0 && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-blue-700 dark:text-blue-300">✓ Account active</p>
                        </div>
                      )}
                      {accountData.portfolio && Object.keys(accountData.portfolio).length > 0 && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <p className="text-purple-700 dark:text-purple-300">✓ Portfolio connected</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Navigate to different sections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setActiveTab('holdings')}
                  className={`w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all ${
                    activeTab === 'holdings' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                  }`} 
                  variant="outline"
                >
                  <TrendingUp className="h-5 w-5 mr-3 text-green-500" />
                  View Holdings
                </Button>
                <Button 
                  onClick={() => setActiveTab('dividends')}
                  className={`w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all ${
                    activeTab === 'dividends' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                  }`} 
                  variant="outline"
                >
                  <Activity className="h-5 w-5 mr-3 text-purple-500" />
                  Dividend History
                </Button>
                <Button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-600 transition-all ${
                    activeTab === 'orders' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : ''
                  }`} 
                  variant="outline"
                >
                  <DollarSign className="h-5 w-5 mr-3 text-amber-500" />
                  Order History
                </Button>
                <Button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all ${
                    activeTab === 'overview' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                  }`} 
                  variant="outline"
                >
                  <PieChart className="h-5 w-5 mr-3 text-indigo-500" />
                  Overview
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
