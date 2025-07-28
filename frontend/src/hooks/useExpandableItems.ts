import { useState } from 'react'

export function useExpandableItems() {
  const [expandedHoldings, setExpandedHoldings] = useState<Set<string>>(new Set())
  const [showAllOrders, setShowAllOrders] = useState(false)
  const [showAllDividends, setShowAllDividends] = useState(false)
  const [portfolioSummaryExpanded, setPortfolioSummaryExpanded] = useState(false)

  const toggleHoldingExpansion = (symbol: string) => {
    setExpandedHoldings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(symbol)) {
        newSet.delete(symbol)
      } else {
        newSet.add(symbol)
      }
      return newSet
    })
  }

  const isHoldingExpanded = (symbol: string) => {
    return expandedHoldings.has(symbol)
  }

  const toggleShowAllOrders = () => {
    setShowAllOrders(prev => !prev)
  }

  const toggleShowAllDividends = () => {
    setShowAllDividends(prev => !prev)
  }

  const togglePortfolioSummary = () => {
    setPortfolioSummaryExpanded(prev => !prev)
  }

  const collapseAll = () => {
    setExpandedHoldings(new Set())
    setShowAllOrders(false)
    setShowAllDividends(false)
    setPortfolioSummaryExpanded(false)
  }

  return {
    // Holdings
    expandedHoldings,
    toggleHoldingExpansion,
    isHoldingExpanded,
    
    // Orders
    showAllOrders,
    toggleShowAllOrders,
    
    // Dividends
    showAllDividends,
    toggleShowAllDividends,
    
    // Portfolio Summary
    portfolioSummaryExpanded,
    togglePortfolioSummary,
    
    // Utilities
    collapseAll
  }
}