'use client'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNavDrawer } from '@/components/ui/mobile-nav-drawer'
import { TrendingUp, RefreshCw, Shield, LogOut } from 'lucide-react'
import { TabType } from '@/types/portfolio'

interface DashboardHeaderProps {
  onRefresh: () => void
  onClearSession: () => void
  onClearCache: () => void
  onLogout: () => void
  activeTab: TabType
  selectedStock: string | null
  onTabChange: (tab: TabType) => void
  onBackToHoldings: () => void
}

export function DashboardHeader({
  onRefresh,
  onClearSession,
  onClearCache,
  onLogout,
  activeTab,
  selectedStock,
  onTabChange,
  onBackToHoldings
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
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

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
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

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Navigation */}
            <MobileNavDrawer
              activeTab={activeTab}
              onTabChange={onTabChange}
              selectedStock={selectedStock}
              onBackToHoldings={onBackToHoldings}
            />
          </div>
        </div>
      </div>
    </header>
  )
}