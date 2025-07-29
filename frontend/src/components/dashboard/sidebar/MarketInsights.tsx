import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function MarketInsights() {
  return (
    <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Market Insights</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Latest market trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Market Rally</h4>
              <p className="text-blue-700 dark:text-blue-300 text-xs">S&P 500 reaches record highs</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">Tech Surge</h4>
              <p className="text-green-700 dark:text-green-300 text-xs">Strong quarterly earnings</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">Dividend Season</h4>
              <p className="text-purple-700 dark:text-purple-300 text-xs">Q4 payouts announced</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}