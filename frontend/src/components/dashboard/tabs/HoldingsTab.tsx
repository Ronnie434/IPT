import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, ChevronDown, ChevronUp, BarChart3, MoreHorizontal, Info, Activity, DollarSign } from 'lucide-react'

interface HoldingsTabProps {
  holdingsData: any
  expandedHoldings: Set<string>
  onFetchStockAnalysis: (symbol: string) => void
  onToggleHoldingExpansion: (symbol: string) => void
}

export function HoldingsTab({ 
  holdingsData, 
  expandedHoldings, 
  onFetchStockAnalysis, 
  onToggleHoldingExpansion 
}: HoldingsTabProps) {
  return (
    <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
          Holdings
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Detailed view of your current positions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {holdingsData && Object.keys(holdingsData).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(holdingsData).map(([symbol, holding]: [string, any]) => {
              const isExpanded = expandedHoldings.has(symbol)
              return (
                <div key={symbol} className="border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Main Holding Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => onFetchStockAnalysis(symbol)}
                            className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          >
                            {symbol}
                          </button>
                          <button
                            onClick={() => onToggleHoldingExpansion(symbol)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-expanded={isExpanded}
                            aria-controls={`holding-details-${symbol}`}
                            aria-label={isExpanded ? `Hide details for ${symbol}` : `Show details for ${symbol}`}
                          >
                            {isExpanded ? 
                              <ChevronUp className="h-4 w-4 text-gray-500" aria-hidden="true" /> : 
                              <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
                            }
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{holding.name || 'Stock'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${holding.price}</p>
                        <p className={`text-sm font-medium ${
                          parseFloat(holding.percent_change) >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {parseFloat(holding.percent_change) >= 0 ? '+' : ''}{holding.percent_change}%
                        </p>
                      </div>
                    </div>

                    {/* Basic Metrics - Always Visible */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide">Quantity</p>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{holding.quantity}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide">Market Value</p>
                        <p className="text-lg font-bold text-green-900 dark:text-green-100">${holding.market_value}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wide">Avg Cost</p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-100">${holding.average_buy_price}</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                        <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide">Total Return</p>
                        <p className={`text-lg font-bold ${
                          parseFloat(holding.total_return_today) >= 0 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          ${holding.total_return_today}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Progressive Disclosure */}
                  {isExpanded && (
                    <div 
                      id={`holding-details-${symbol}`}
                      className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 animate-slide-down"
                      role="region"
                      aria-labelledby={`holding-metrics-${symbol}`}
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                          <h4 id={`holding-metrics-${symbol}`} className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Metrics for {symbol}</h4>
                        </div>
                        
                        {/* Advanced Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {holding.pe_ratio && (
                            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
                                  <p className="text-xl font-bold text-gray-900 dark:text-white">{holding.pe_ratio}</p>
                                </div>
                                <Info className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          )}
                          
                          {holding.dividend_yield && (
                            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Dividend Yield</p>
                                  <p className="text-xl font-bold text-gray-900 dark:text-white">{holding.dividend_yield}%</p>
                                </div>
                                <Activity className="h-5 w-5 text-green-500" />
                              </div>
                            </div>
                          )}
                          
                          {/* Calculate total value */}
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Investment</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  ${(parseFloat(holding.average_buy_price) * parseFloat(holding.quantity)).toFixed(2)}
                                </p>
                              </div>
                              <DollarSign className="h-5 w-5 text-blue-500" />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            onClick={() => onFetchStockAnalysis(symbol)}
                            variant="gradient"
                            size="sm"
                            className="shadow-lg"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Analysis
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 dark:border-gray-600"
                          >
                            <MoreHorizontal className="h-4 w-4 mr-2" />
                            More Actions
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black rounded-xl border border-slate-200 dark:border-gray-800">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  No Holdings Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Your portfolio appears to be empty or the data is still loading.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}