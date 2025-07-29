import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Activity, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency, formatQuantity } from '@/lib/utils'

interface OrdersTabProps {
  ordersData: any[]
  openOrdersData: any[]
  showAllOrders: boolean
  onToggleShowAll: () => void
}

export function OrdersTab({ 
  ordersData, 
  openOrdersData, 
  showAllOrders, 
  onToggleShowAll 
}: OrdersTabProps) {
  return (
    <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <DollarSign className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
          Orders
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Your trading history and open orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(ordersData && ordersData.length > 0) || (openOrdersData && openOrdersData.length > 0) ? (
          <div className="space-y-6">
            {/* Orders Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {ordersData?.length || 0}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Open Orders</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {openOrdersData?.length || 0}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Buy Orders</p>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                      {ordersData?.filter((order: any) => order.side === 'buy').length || 0}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">Sell Orders</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {ordersData?.filter((order: any) => order.side === 'sell').length || 0}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Open Orders Section */}
            {openOrdersData && openOrdersData.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-500" />
                  Open Orders
                </h3>
                {openOrdersData.map((order: any, index: number) => (
                  <div key={order.id || index} className="p-4 border border-green-200 dark:border-green-700 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{order.symbol}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.side.toUpperCase()} • {order.type.toUpperCase()} • {order.time_in_force}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(order.price)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatQuantity(order.quantity)} shares
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">State</p>
                        <p className="font-semibold text-green-600 dark:text-green-400 capitalize">{order.state}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Created</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Updated</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(order.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total Value</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(parseFloat(order.price) * parseFloat(order.quantity))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Orders Section */}
            {ordersData && ordersData.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                    Recent Orders
                  </h3>
                  {ordersData.length > 10 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleShowAll}
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    >
                      {showAllOrders ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Show All ({ordersData.length})
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {ordersData
                  .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, showAllOrders ? ordersData.length : 10)
                  .map((order: any, index: number) => (
                  <div key={order.id || index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{order.symbol}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.side.toUpperCase()} • {order.type.toUpperCase()} • {order.time_in_force}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(order.price)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatQuantity(order.quantity)} shares
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">State</p>
                        <p className={`font-semibold capitalize ${
                          order.state === 'filled' 
                            ? 'text-green-600 dark:text-green-400' 
                            : order.state === 'cancelled' 
                              ? 'text-red-600 dark:text-red-400'
                              : order.state === 'queued' || order.state === 'confirmed'
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {order.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Created</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Updated</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(order.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      {order.executed_at && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Executed</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {new Date(order.executed_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total Value</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(parseFloat(order.price) * parseFloat(order.quantity))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black rounded-xl border border-slate-200 dark:border-gray-800">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  No Orders Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  You haven&apos;t placed any orders yet, or the data is still loading.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}