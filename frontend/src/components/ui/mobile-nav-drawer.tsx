'use client'

import { useState, useEffect } from 'react'
import { Button } from './button'
import { Menu, X, TrendingUp, PieChart, Activity, DollarSign } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTheme } from '../theme-provider'

interface MobileNavDrawerProps {
  activeTab: string
  onTabChange: (tab: string) => void
  selectedStock?: string | null
  onBackToHoldings?: () => void
  className?: string
}

export const MobileNavDrawer = ({
  activeTab,
  onTabChange,
  selectedStock,
  onBackToHoldings,
  className
}: MobileNavDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close drawer on tab change
  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setIsOpen(false)
  }

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: PieChart, color: 'blue' },
    { id: 'holdings', name: 'Holdings', icon: TrendingUp, color: 'emerald' },
    { id: 'dividends', name: 'Dividends', icon: Activity, color: 'purple' },
    { id: 'orders', name: 'Orders', icon: DollarSign, color: 'amber' },
    ...(selectedStock ? [{ id: 'stock-analysis', name: `${selectedStock} Analysis`, icon: TrendingUp, color: 'indigo' }] : [])
  ]

  if (!isMobile) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className={cn("md:hidden", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-white/30 dark:border-white/20 hover:bg-white dark:hover:bg-gray-900"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Navigation</h2>
                {/* <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio sections</p> */}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="p-6 space-y-3" style={{background: theme === "dark" ? 'black' : 'white'}}>
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              const colorClasses = {
                blue: isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                emerald: isActive 
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                purple: isActive 
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                amber: isActive 
                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                indigo: isActive 
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }

              return (
                <button
                  key={item.id}
                  onClick={() => item.id === 'stock-analysis' ? null : handleTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 border animate-slide-up",
                    colorClasses[item.color as keyof typeof colorClasses],
                    item.id === 'stock-analysis' ? 'cursor-default' : 'cursor-pointer'
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-105"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.id === 'overview' && 'Portfolio summary'}
                      {item.id === 'holdings' && 'Your positions'}
                      {item.id === 'dividends' && 'Dividend history'}
                      {item.id === 'orders' && 'Trading activity'}
                      {item.id === 'stock-analysis' && 'Stock details'}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-8 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                  )}
                  {item.id === 'stock-analysis' && onBackToHoldings && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onBackToHoldings()
                        setIsOpen(false)
                      }}
                      className="ml-2 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  )}
                </button>
              )
            })}
          </div>

        </div>
      </div>
    </>
  )
}
