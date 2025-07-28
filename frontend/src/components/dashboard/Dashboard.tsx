'use client'

import { usePortfolioData } from '@/hooks/usePortfolioData'
import { useTabNavigation } from '@/hooks/useTabNavigation'
import { useExpandableItems } from '@/hooks/useExpandableItems'
import { DashboardHeader } from './DashboardHeader'
import { PortfolioSummary } from './PortfolioSummary'
import { NavigationTabs } from './NavigationTabs'
import { TabContent } from './TabContent'
import { LoadingState } from './LoadingState'
import { ErrorState } from './ErrorState'

interface DashboardProps {
  setIsLoggedIn: (value: boolean) => void
}

export function Dashboard({ setIsLoggedIn }: DashboardProps) {
  const portfolioData = usePortfolioData()
  const tabNavigation = useTabNavigation()
  const expandableItems = useExpandableItems()

  const handleLogout = () => {
    portfolioData.clearSession()
    setIsLoggedIn(false)
  }

  const handleStockAnalysis = (symbol: string) => {
    portfolioData.fetchStockAnalysis(symbol)
    tabNavigation.handleStockAnalysis(symbol)
  }

  const handleBackToHoldings = () => {
    portfolioData.clearStockAnalysis()
    tabNavigation.handleBackToHoldings()
  }

  if (portfolioData.loading) {
    return <LoadingState />
  }

  if (portfolioData.error) {
    return <ErrorState error={portfolioData.error} onRetry={portfolioData.refreshData} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-black dark:via-gray-950 dark:to-black">
      {/* Header */}
      <DashboardHeader
        onRefresh={portfolioData.refreshData}
        onClearSession={portfolioData.clearSession}
        onClearCache={portfolioData.clearCache}
        onLogout={handleLogout}
        activeTab={tabNavigation.activeTab}
        selectedStock={portfolioData.selectedStock}
        onTabChange={tabNavigation.handleTabChange}
        onBackToHoldings={handleBackToHoldings}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Portfolio Summary */}
        {portfolioData.portfolioData && (
          <PortfolioSummary 
            data={portfolioData.portfolioData}
            loading={portfolioData.loading}
          />
        )}

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={tabNavigation.activeTab}
          onTabChange={tabNavigation.handleTabChange}
          selectedStock={portfolioData.selectedStock}
          onBackToHoldings={handleBackToHoldings}
        />

        {/* Tab Content */}
        <TabContent
          activeTab={tabNavigation.activeTab}
          portfolioData={portfolioData}
          expandableItems={expandableItems}
          onStockAnalysis={handleStockAnalysis}
          onBackToHoldings={handleBackToHoldings}
        />
      </main>
    </div>
  )
}