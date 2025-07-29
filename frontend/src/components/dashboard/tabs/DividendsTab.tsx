import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, DollarSign, PieChart, ChevronDown, ChevronUp } from 'lucide-react'

interface DividendsTabProps {
  dividendsData: any[]
  portfolioData: any
  showAllDividends: boolean
  onToggleShowAll: () => void
}

export function DividendsTab({ 
  dividendsData, 
  portfolioData, 
  showAllDividends, 
  onToggleShowAll 
}: DividendsTabProps) {
  return (
    <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Activity className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
          Dividends
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Your dividend history and earnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {dividendsData && dividendsData.length > 0 ? (
          <div className="space-y-4">
            {/* Dividend Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Dividends</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      ${portfolioData?.total_dividends?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Payments</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {dividendsData.filter((div: any) => div.state === 'paid').length}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Unique Stocks</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {new Set(dividendsData.map((div: any) => div.symbol)).size}
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Dividend History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Dividend Payments</h3>
                {dividendsData.length > 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleShowAll}
                    className="border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  >
                    {showAllDividends ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Show All ({dividendsData.length})
                      </>
                    )}
                  </Button>
                )}
              </div>
              {dividendsData
                .sort((a: any, b: any) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime())
                .slice(0, showAllDividends ? dividendsData.length : 5)
                .map((dividend: any, index: number) => (
                <div key={dividend.id || index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        dividend.state === 'paid' 
                          ? 'bg-green-500' 
                          : dividend.state === 'pending' 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-500'
                      }`}></div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{dividend.symbol}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dividend.state === 'paid' ? 'Paid' : dividend.state === 'pending' ? 'Pending' : 'Other'} • 
                          {new Date(dividend.paid_at || dividend.payable_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(dividend.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${parseFloat(dividend.rate).toFixed(4)} per share
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Position</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{dividend.position} shares</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Record Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(dividend.record_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Payable Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(dividend.payable_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Status</p>
                      <p className={`font-semibold capitalize ${
                        dividend.state === 'paid' 
                          ? 'text-green-600 dark:text-green-400' 
                          : dividend.state === 'pending' 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {dividend.state}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black rounded-xl border border-slate-200 dark:border-gray-800">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  No Dividends Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  You haven&apos;t received any dividend payments yet, or the data is still loading.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}