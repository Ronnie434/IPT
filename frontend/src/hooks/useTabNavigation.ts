import { useState } from 'react'
import { TabType } from '@/types/portfolio'

export function useTabNavigation() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  const handleStockAnalysis = (symbol: string) => {
    setActiveTab('stock-analysis')
  }

  const handleBackToHoldings = () => {
    setActiveTab('holdings')
  }

  return {
    activeTab,
    handleTabChange,
    handleStockAnalysis,
    handleBackToHoldings
  }
}