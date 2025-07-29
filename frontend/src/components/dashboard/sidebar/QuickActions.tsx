import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Activity, DollarSign, PieChart } from 'lucide-react'

interface QuickActionsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function QuickActions({ activeTab, onTabChange }: QuickActionsProps) {
  return (
    <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Navigate to different sections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => onTabChange('holdings')}
          className={`w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all ${
            activeTab === 'holdings' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
          }`} 
          variant="outline"
        >
          <TrendingUp className="h-5 w-5 mr-3 text-green-500" />
          View Holdings
        </Button>
        <Button 
          onClick={() => onTabChange('dividends')}
          className={`w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all ${
            activeTab === 'dividends' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
          }`} 
          variant="outline"
        >
          <Activity className="h-5 w-5 mr-3 text-purple-500" />
          Dividend History
        </Button>
        <Button 
          onClick={() => onTabChange('orders')}
          className={`w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-600 transition-all ${
            activeTab === 'orders' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : ''
          }`} 
          variant="outline"
        >
          <DollarSign className="h-5 w-5 mr-3 text-amber-500" />
          Order History
        </Button>
        <Button 
          onClick={() => onTabChange('overview')}
          className={`w-full justify-start h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all ${
            activeTab === 'overview' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
          }`} 
          variant="outline"
        >
          <PieChart className="h-5 w-5 mr-3 text-indigo-500" />
          Overview
        </Button>
      </CardContent>
    </Card>
  )
}