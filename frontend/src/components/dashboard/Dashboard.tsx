'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { PortfolioSummaryCards } from './PortfolioSummaryCards'
import { NavigationTabs } from './NavigationTabs'
import { OverviewTab } from './tabs/OverviewTab'
import { HoldingsTab } from './tabs/HoldingsTab'
import { DividendsTab } from './tabs/DividendsTab'
import { OrdersTab } from './tabs/OrdersTab'
import { StockAnalysisTab } from './tabs/StockAnalysisTab'
import { AccountInfo } from './sidebar/AccountInfo'
import { QuickActions } from './sidebar/QuickActions'
import { MarketInsights } from './sidebar/MarketInsights'
import { LoadingState } from './LoadingState'
import { ErrorState } from './ErrorState'

interface DashboardProps {
  setIsLoggedIn: (value: boolean) => void
}

export function Dashboard({ setIsLoggedIn }: DashboardProps) {
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [holdingsData, setHoldingsData] = useState<any>(null)
  const [accountData, setAccountData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [stockAnalysisData, setStockAnalysisData] = useState<any>(null)
  const [dividendsData, setDividendsData] = useState<any>(null)
  const [ordersData, setOrdersData] = useState<any>(null)
  const [openOrdersData, setOpenOrdersData] = useState<any>(null)
  const [showAllDividends, setShowAllDividends] = useState(false)
  const [showAllOrders, setShowAllOrders] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedHoldings, setExpandedHoldings] = useState<Set<string>>(new Set())

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
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRefresh} />
  }

  return (
    <div className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <DashboardHeader
        activeTab={activeTab}
        selectedStock={selectedStock}
        onRefresh={handleRefresh}
        onClearSession={handleClearSession}
        onClearCache={handleClearCache}
        onLogout={handleLogout}
        onTabChange={setActiveTab}
        onBackToHoldings={handleBackToHoldings}
      />

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

        <PortfolioSummaryCards portfolioData={portfolioData} />

        <NavigationTabs
          activeTab={activeTab}
          selectedStock={selectedStock}
          onTabChange={setActiveTab}
          onBackToHoldings={handleBackToHoldings}
        />

        {/* Dynamic Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && <OverviewTab />}
            
            {activeTab === 'holdings' && (
              <HoldingsTab
                holdingsData={holdingsData}
                expandedHoldings={expandedHoldings}
                onFetchStockAnalysis={fetchStockAnalysis}
                onToggleHoldingExpansion={toggleHoldingExpansion}
              />
            )}

            {activeTab === 'dividends' && (
              <DividendsTab
                dividendsData={dividendsData}
                portfolioData={portfolioData}
                showAllDividends={showAllDividends}
                onToggleShowAll={() => setShowAllDividends(!showAllDividends)}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab
                ordersData={ordersData}
                openOrdersData={openOrdersData}
                showAllOrders={showAllOrders}
                onToggleShowAll={() => setShowAllOrders(!showAllOrders)}
              />
            )}

            {activeTab === 'stock-analysis' && (
              <StockAnalysisTab
                selectedStock={selectedStock}
                stockAnalysisData={stockAnalysisData}
                onBackToHoldings={handleBackToHoldings}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <AccountInfo userData={userData} accountData={accountData} />
            <QuickActions activeTab={activeTab} onTabChange={setActiveTab} />
            <MarketInsights />
          </div>
        </div>
      </main>
    </div>
  )
}