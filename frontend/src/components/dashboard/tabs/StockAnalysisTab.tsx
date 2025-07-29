'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp } from 'lucide-react'
import { formatCurrency, formatQuantity, formatDividendRate } from '@/lib/utils'

interface StockAnalysisData {
  current_holding?: {
    quantity: number
    price: string
    market_value: string
    average_buy_price: string
  }
  metrics?: {
    total_bought_quantity: number
    total_sold_quantity: number
    net_quantity: number
    total_orders: number
    buy_orders: number
    sell_orders: number
    calculated_avg_price: number
    total_dividend_amount: number
  }
  orders?: Array<{
    id: string
    side: 'buy' | 'sell'
    quantity: string
    price: string
    created_at: string
    state: string
  }>
  dividends?: Array<{
    id: string
    amount: string
    rate: string
    position: string
    paid_at?: string
    payable_date: string
    state: string
  }>
}

interface StockAnalysisTabProps {
  selectedStock: string
  stockAnalysisData: StockAnalysisData | null
  onBackToHoldings: () => void
}

export function StockAnalysisTab({ 
  selectedStock, 
  stockAnalysisData, 
  onBackToHoldings 
}: StockAnalysisTabProps) {
  if (!stockAnalysisData) {
    return (
      <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Loading Stock Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Fetching detailed analysis for {selectedStock}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
            {selectedStock} Analysis
          </CardTitle>
          <Button 
            onClick={onBackToHoldings}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-700"
          >
            Back to Holdings
          </Button>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Comprehensive analysis and trading history for {selectedStock}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Holding */}
          {stockAnalysisData.current_holding && Object.keys(stockAnalysisData.current_holding).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Position</h3>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Shares Owned</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                      {stockAnalysisData.current_holding.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Current Price</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                      ${stockAnalysisData.current_holding.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Market Value</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                      ${stockAnalysisData.current_holding.market_value}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Avg Cost</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                      ${stockAnalysisData.current_holding.average_buy_price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Summary */}
          {stockAnalysisData.metrics && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trading Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400">Total Bought</p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100">
                    {stockAnalysisData.metrics.total_bought_quantity}
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">Total Sold</p>
                  <p className="text-lg font-bold text-red-900 dark:text-red-100">
                    {stockAnalysisData.metrics.total_sold_quantity}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400">Net Position</p>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                    {stockAnalysisData.metrics.net_quantity}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Total Orders</p>
                  <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                    {stockAnalysisData.metrics.total_orders}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Buy Orders</p>
                  <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                    {stockAnalysisData.metrics.buy_orders}
                  </p>
                </div>
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-800">
                  <p className="text-sm text-rose-600 dark:text-rose-400">Sell Orders</p>
                  <p className="text-lg font-bold text-rose-900 dark:text-rose-100">
                    {stockAnalysisData.metrics.sell_orders}
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">Calculated Avg</p>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(stockAnalysisData.metrics.calculated_avg_price)}
                  </p>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
                  <p className="text-sm text-teal-600 dark:text-teal-400">Total Dividends</p>
                  <p className="text-lg font-bold text-teal-900 dark:text-teal-100">
                    {formatCurrency(stockAnalysisData.metrics.total_dividend_amount)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders */}
          {stockAnalysisData.orders && stockAnalysisData.orders.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {stockAnalysisData.orders.slice(0, 5).map((order: any, index: number) => (
                  <div key={order.id || index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.side.toUpperCase()} {formatQuantity(order.quantity)} shares
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.created_at).toLocaleDateString()} • {order.state}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(order.price)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(parseFloat(order.price) * parseFloat(order.quantity))} total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dividend History */}
          {stockAnalysisData.dividends && stockAnalysisData.dividends.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dividend History</h3>
              <div className="space-y-3">
                {stockAnalysisData.dividends.slice(0, 5).map((dividend: any, index: number) => (
                  <div key={dividend.id || index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(dividend.amount)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(dividend.paid_at || dividend.payable_date).toLocaleDateString()} • {dividend.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDividendRate(dividend.rate)} per share
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatQuantity(dividend.position)} shares
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}