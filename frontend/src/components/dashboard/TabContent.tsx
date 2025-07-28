'use client'

import { TabType } from '@/types/portfolio'

// Placeholder components for now - these would be replaced with full implementations
function OverviewTab() {
  return (
    <div className="bg-white dark:bg-black/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Comprehensive portfolio analytics and insights will be displayed here.
      </p>
    </div>
  )
}

function HoldingsTab({ holdingsData, expandableItems, onStockAnalysis }: any) {
  return (
    <div className="bg-white dark:bg-black/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Holdings</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Your portfolio holdings will be displayed here.
      </p>
      {/* Holdings implementation would go here */}
    </div>
  )
}

function DividendsTab({ dividendsData, expandableItems }: any) {
  return (
    <div className="bg-white dark:bg-black/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Dividends</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Your dividend history will be displayed here.
      </p>
      {/* Dividends implementation would go here */}
    </div>
  )
}

function OrdersTab({ ordersData, openOrdersData, expandableItems }: any) {
  return (
    <div className="bg-white dark:bg-black/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Orders</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Your order history will be displayed here.
      </p>
      {/* Orders implementation would go here */}
    </div>
  )
}

function StockAnalysisTab({ stockAnalysisData, selectedStock, onBackToHoldings }: any) {
  return (
    <div className="bg-white dark:bg-black/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4">
        Stock Analysis: {selectedStock}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Detailed stock analysis will be displayed here.
      </p>
      {/* Stock analysis implementation would go here */}
    </div>
  )
}

interface TabContentProps {
  activeTab: TabType
  portfolioData: any // This would be the return type of usePortfolioData
  expandableItems: any // This would be the return type of useExpandableItems
  onStockAnalysis: (symbol: string) => void
  onBackToHoldings: () => void
}

export function TabContent({ 
  activeTab, 
  portfolioData, 
  expandableItems, 
  onStockAnalysis, 
  onBackToHoldings 
}: TabContentProps) {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab />
    
    case 'holdings':
      return (
        <HoldingsTab
          holdingsData={portfolioData.holdingsData}
          expandableItems={expandableItems}
          onStockAnalysis={onStockAnalysis}
        />
      )
    
    case 'dividends':
      return (
        <DividendsTab
          dividendsData={portfolioData.dividendsData}
          expandableItems={expandableItems}
        />
      )
    
    case 'orders':
      return (
        <OrdersTab
          ordersData={portfolioData.ordersData}
          openOrdersData={portfolioData.openOrdersData}
          expandableItems={expandableItems}
        />
      )
    
    case 'stock-analysis':
      return (
        <StockAnalysisTab
          stockAnalysisData={portfolioData.stockAnalysisData}
          selectedStock={portfolioData.selectedStock}
          onBackToHoldings={onBackToHoldings}
        />
      )
    
    default:
      return <OverviewTab />
  }
}