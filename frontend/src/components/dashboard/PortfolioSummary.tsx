'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { DollarSign, TrendingUp, PieChart, Activity } from 'lucide-react'
import { PortfolioData } from '@/types/portfolio'

interface PortfolioSummaryProps {
  data: PortfolioData
  loading: boolean
}

interface SummaryCardProps {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'emerald' | 'purple' | 'amber'
  delay: string
}

function SummaryCard({ title, value, description, icon: Icon, color, delay }: SummaryCardProps) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500/5 to-indigo-600/5 dark:from-blue-500/20 dark:to-indigo-700/20',
      iconBg: 'from-blue-500 to-indigo-600',
      iconShadow: 'shadow-blue-500/25',
      titleColor: 'text-blue-600 dark:text-blue-300',
    },
    emerald: {
      gradient: 'from-emerald-500/5 to-teal-600/5 dark:from-emerald-500/20 dark:to-teal-700/20',
      iconBg: 'from-emerald-500 to-teal-600',
      iconShadow: 'shadow-emerald-500/25',
      titleColor: 'text-emerald-600 dark:text-emerald-300',
    },
    purple: {
      gradient: 'from-purple-500/5 to-pink-600/5 dark:from-purple-500/20 dark:to-pink-700/20',
      iconBg: 'from-purple-500 to-pink-600',
      iconShadow: 'shadow-purple-500/25',
      titleColor: 'text-purple-600 dark:text-purple-300',
    },
    amber: {
      gradient: 'from-amber-500/5 to-orange-600/5 dark:from-amber-500/20 dark:to-orange-700/20',
      iconBg: 'from-amber-500 to-orange-600',
      iconShadow: 'shadow-amber-500/25',
      titleColor: 'text-amber-600 dark:text-amber-300',
    },
  }

  const colors = colorClasses[color]

  return (
    <Card 
      className="group relative overflow-hidden animate-scale-in bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none" 
      style={{ animationDelay: delay }} 
      role="article" 
      aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-title`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`}></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 bg-gradient-to-br ${colors.iconBg} rounded-2xl shadow-lg ${colors.iconShadow} group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className={`text-xs font-medium ${colors.titleColor} uppercase tracking-wide`} id={`${title.toLowerCase().replace(/\s+/g, '-')}-title`}>
            {title}
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300" aria-describedby={`${title.toLowerCase().replace(/\s+/g, '-')}-title`}>
          {value}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </CardHeader>
    </Card>
  )
}

export function PortfolioSummary({ data, loading }: PortfolioSummaryProps) {
  if (loading) {
    return (
      <section aria-labelledby="portfolio-summary" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <h2 id="portfolio-summary" className="sr-only">Portfolio Summary</h2>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-32" />
        ))}
      </section>
    )
  }

  return (
    <section aria-labelledby="portfolio-summary" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <h2 id="portfolio-summary" className="sr-only">Portfolio Summary</h2>
      
      <SummaryCard
        title="Total Equity"
        value={`$${data.total_equity?.toFixed(2) || '0.00'}`}
        description="Current portfolio value"
        icon={DollarSign}
        color="blue"
        delay="0.1s"
      />

      <SummaryCard
        title="Market Value"
        value={`$${data.total_market_value?.toFixed(2) || '0.00'}`}
        description="Total market value"
        icon={TrendingUp}
        color="emerald"
        delay="0.2s"
      />

      <SummaryCard
        title="Positions"
        value={data.total_positions?.toString() || '0'}
        description="Number of holdings"
        icon={PieChart}
        color="purple"
        delay="0.3s"
      />

      <SummaryCard
        title="Dividends"
        value={`$${data.total_dividends?.toFixed(2) || '0.00'}`}
        description="Lifetime dividends earned"
        icon={Activity}
        color="amber"
        delay="0.4s"
      />
    </section>
  )
}