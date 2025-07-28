'use client'

import { useState, useEffect } from 'react'
import { Button } from './button'
import { Menu, X, TrendingUp, PieChart, Activity, DollarSign } from 'lucide-react'
import { cn } from '../../lib/utils'

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
        <div className="h-full glass-card border-l border-white/20 dark:border-white/10 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Navigation</h2>
                <p className="text-sm text-white/70">Portfolio sections</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="p-6 space-y-3">
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              const colorClasses = {
                blue: isActive 
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/50' 
                  : 'text-blue-300/80 hover:bg-blue-500/10 hover:text-blue-300',
                emerald: isActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' 
                  : 'text-emerald-300/80 hover:bg-emerald-500/10 hover:text-emerald-300',
                purple: isActive 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400/50' 
                  : 'text-purple-300/80 hover:bg-purple-500/10 hover:text-purple-300',
                amber: isActive 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' 
                  : 'text-amber-300/80 hover:bg-amber-500/10 hover:text-amber-300',
                indigo: isActive 
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50' 
                  : 'text-indigo-300/80 hover:bg-indigo-500/10 hover:text-indigo-300'
              }

              return (
                <button
                  key={item.id}
                  onClick={() => item.id === 'stock-analysis' ? null : handleTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 border border-transparent animate-slide-up",
                    colorClasses[item.color as keyof typeof colorClasses],
                    isActive && "border-opacity-50",
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
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs opacity-70">
                      {item.id === 'overview' && 'Portfolio summary'}
                      {item.id === 'holdings' && 'Your positions'}
                      {item.id === 'dividends' && 'Dividend history'}
                      {item.id === 'orders' && 'Trading activity'}
                      {item.id === 'stock-analysis' && 'Stock details'}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-8 bg-current rounded-full opacity-60"></div>
                  )}
                  {item.id === 'stock-analysis' && onBackToHoldings && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onBackToHoldings()
                        setIsOpen(false)
                      }}
                      className="ml-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20 dark:border-white/10">
            <div className="text-center space-y-2">
              <p className="text-white/70 text-sm">Portfolio Analyzer</p>
              <p className="text-white/50 text-xs">Real-time investment insights</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}