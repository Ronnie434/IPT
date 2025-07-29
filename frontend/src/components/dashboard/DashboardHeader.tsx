import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { TrendingUp, Shield, RefreshCw, LogOut } from 'lucide-react'
import { MobileNavDrawer } from '@/components/ui/mobile-nav-drawer'

interface DashboardHeaderProps {
  activeTab: string
  selectedStock: string | null
  onRefresh: () => void
  onClearSession: () => void
  onClearCache: () => void
  onLogout: () => void
  onTabChange: (tab: string) => void
  onBackToHoldings: () => void
}

export function DashboardHeader({
  activeTab,
  selectedStock,
  onRefresh,
  onClearSession,
  onClearCache,
  onLogout,
  onTabChange,
  onBackToHoldings
}: DashboardHeaderProps) {
  return (
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
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <MobileNavDrawer
              activeTab={activeTab}
              onTabChange={onTabChange}
              selectedStock={selectedStock}
              onBackToHoldings={onBackToHoldings}
            />
            <div className="hidden sm:flex items-center space-x-3">
              <Button 
                onClick={onRefresh}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 p-2"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                onClick={onClearSession}
                variant="outline"
                size="sm"
                className="border-yellow-300 dark:border-yellow-700 bg-white dark:bg-gray-900 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 p-2"
                title="Clear Session"
              >
                <Shield className="h-4 w-4" />
              </Button>
              <Button 
                onClick={onClearCache}
                variant="outline"
                size="sm"
                className="border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2"
                title="Clear Cache"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                onClick={onLogout}
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
  )
}