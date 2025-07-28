'use client'

import { PieChart, TrendingUp, Activity, DollarSign, BarChart3 } from 'lucide-react'
import { TabType } from '@/types/portfolio'

interface NavigationTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  selectedStock: string | null
  onBackToHoldings: () => void
}

const tabsConfig = [
  { id: 'overview' as TabType, name: 'Overview', icon: PieChart, color: 'blue' },
  { id: 'holdings' as TabType, name: 'Holdings', icon: TrendingUp, color: 'emerald' },
  { id: 'dividends' as TabType, name: 'Dividends', icon: Activity, color: 'purple' },
  { id: 'orders' as TabType, name: 'Orders', icon: DollarSign, color: 'amber' },
  { id: 'stock-analysis' as TabType, name: 'Stock Analysis', icon: BarChart3, color: 'indigo' },
]

export function NavigationTabs({ 
  activeTab, 
  onTabChange, 
  selectedStock, 
  onBackToHoldings 
}: NavigationTabsProps) {
  return (
    <section aria-labelledby="navigation-tabs" className="relative">
      <h2 id="navigation-tabs" className="sr-only">Portfolio Navigation</h2>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 rounded-2xl"></div>
      <div className="relative bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/10 p-2">
        <div className="flex space-x-2 overflow-x-auto" role="tablist" style={{padding: "5px 0px"}}>
          {tabsConfig.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            // Don't show stock analysis tab unless a stock is selected
            if (tab.id === 'stock-analysis' && !selectedStock) {
              return null
            }
            
            const colorClasses = {
              blue: isActive 
                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/50 dark:border-blue-600/50' 
                : 'text-blue-600/80 dark:text-blue-400/80 hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300',
              emerald: isActive 
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300/50 dark:border-emerald-600/50' 
                : 'text-emerald-600/80 dark:text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300',
              purple: isActive 
                ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/50 dark:border-purple-600/50' 
                : 'text-purple-600/80 dark:text-purple-400/80 hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300',
              amber: isActive 
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300/50 dark:border-amber-600/50' 
                : 'text-amber-600/80 dark:text-amber-400/80 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300',
              indigo: isActive 
                ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300/50 dark:border-indigo-600/50' 
                : 'text-indigo-600/80 dark:text-indigo-400/80 hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300'
            }

            return (
              <button
                key={tab.id}
                onClick={() => tab.id === 'stock-analysis' ? null : onTabChange(tab.id)}
                className={`
                  relative flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-transparent whitespace-nowrap
                  ${colorClasses[tab.color as keyof typeof colorClasses]}
                  ${isActive ? 'shadow-lg shadow-black/5 dark:shadow-black/20 border-opacity-50' : ''}
                  ${tab.id === 'stock-analysis' ? 'cursor-default' : 'cursor-pointer hover:scale-105'}
                `}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                tabIndex={isActive ? 0 : -1}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'animate-bounce-gentle' : ''}`} />
                <span className="font-semibold">
                  {tab.id === 'stock-analysis' && selectedStock 
                    ? `${selectedStock} Analysis` 
                    : tab.name}
                </span>
                {isActive && (
                  <div className="absolute inset-0 rounded-xl from-white/20 to-transparent pointer-events-none"></div>
                )}
                {tab.id === 'stock-analysis' && onBackToHoldings && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onBackToHoldings()
                    }}
                    className="ml-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-xs"
                    title="Back to Holdings"
                  >
                    ×
                  </button>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}