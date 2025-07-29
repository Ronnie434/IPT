import { PieChart, TrendingUp, Activity, DollarSign } from 'lucide-react'

interface NavigationTabsProps {
  activeTab: string
  selectedStock: string | null
  onTabChange: (tab: string) => void
  onBackToHoldings: () => void
}

export function NavigationTabs({ activeTab, selectedStock, onTabChange, onBackToHoldings }: NavigationTabsProps) {
  const tabs = [
    { id: 'overview', name: 'Overview', icon: PieChart, color: 'blue' },
    { id: 'holdings', name: 'Holdings', icon: TrendingUp, color: 'emerald' },
    { id: 'dividends', name: 'Dividends', icon: Activity, color: 'purple' },
    { id: 'orders', name: 'Orders', icon: DollarSign, color: 'amber' },
    ...(selectedStock ? [{ id: 'stock-analysis', name: `${selectedStock} Analysis`, icon: TrendingUp, color: 'indigo' }] : [])
  ]

  const colorClasses = {
    blue: (isActive: boolean) => isActive 
      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
      : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30',
    emerald: (isActive: boolean) => isActive 
      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
      : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    purple: (isActive: boolean) => isActive 
      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
      : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30',
    amber: (isActive: boolean) => isActive 
      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
      : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30',
    indigo: (isActive: boolean) => isActive 
      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
      : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
  }

  return (
    <nav className="relative hidden md:block" aria-labelledby="navigation-tabs" role="navigation">
      <h2 id="navigation-tabs" className="sr-only">Portfolio Navigation</h2>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 rounded-2xl"></div>
      <div className="relative bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/10 p-2">
        <div className="flex space-x-2 overflow-x-auto" role="tablist" style={{padding: "5px 0px"}}>
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => tab.id === 'stock-analysis' ? null : onTabChange(tab.id)}
                className={`
                  relative py-3 px-6 rounded-xl font-medium text-sm flex items-center space-x-3 transition-all duration-300 whitespace-nowrap transform
                  ${colorClasses[tab.color as keyof typeof colorClasses](isActive)}
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
                      onBackToHoldings()
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
  )
}