import { Card, CardHeader } from '@/components/ui/card'
import { DollarSign, TrendingUp, PieChart, Activity } from 'lucide-react'

interface PortfolioData {
  total_equity?: number
  total_market_value?: number
  total_positions?: number
  total_dividends?: number
}

interface PortfolioSummaryCardsProps {
  portfolioData: PortfolioData | null
}

export function PortfolioSummaryCards({ portfolioData }: PortfolioSummaryCardsProps) {
  if (!portfolioData) return null

  return (
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
  )
}