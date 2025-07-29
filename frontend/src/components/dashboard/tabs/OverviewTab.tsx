import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart } from 'lucide-react'

export function OverviewTab() {
  return (
    <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <PieChart className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
          Portfolio Overview
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Comprehensive analysis of your investment portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black rounded-xl border border-slate-200 dark:border-gray-800">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <PieChart className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Advanced Analytics Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Interactive charts, performance metrics, and detailed portfolio breakdowns will be available in the next update.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}