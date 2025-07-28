import { useState, useEffect } from 'react'
import { 
  PortfolioData, 
  HoldingData, 
  DividendData, 
  OrderData, 
  AccountData, 
  UserData, 
  StockAnalysisData 
} from '@/types/portfolio'

interface PortfolioDataState {
  portfolioData: PortfolioData | null
  holdingsData: HoldingData[] | null
  dividendsData: DividendData[] | null
  ordersData: OrderData[] | null
  openOrdersData: OrderData[] | null
  accountData: AccountData | null
  userData: UserData | null
  stockAnalysisData: StockAnalysisData | null
  loading: boolean
  error: string | null
}

export function usePortfolioData() {
  const [state, setState] = useState<PortfolioDataState>({
    portfolioData: null,
    holdingsData: null,
    dividendsData: null,
    ordersData: null,
    openOrdersData: null,
    accountData: null,
    userData: null,
    stockAnalysisData: null,
    loading: true,
    error: null
  })

  const [selectedStock, setSelectedStock] = useState<string | null>(null)

  const fetchPortfolioData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const [
        summaryResponse, 
        holdingsResponse, 
        dividendsResponse, 
        ordersResponse, 
        openOrdersResponse, 
        accountResponse, 
        userResponse
      ] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/summary`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/holdings`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/dividends`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/all`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/open`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/info`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/info`)
      ])
      
      const [
        summaryData, 
        holdingsDataResponse, 
        dividendsDataResponse, 
        ordersDataResponse, 
        openOrdersDataResponse, 
        accountDataResponse, 
        userDataResponse
      ] = await Promise.all([
        summaryResponse.json(),
        holdingsResponse.json(),
        dividendsResponse.json(),
        ordersResponse.json(),
        openOrdersResponse.json(),
        accountResponse.json(),
        userResponse.json()
      ])

      setState(prev => ({
        ...prev,
        portfolioData: summaryData.success ? summaryData.data : null,
        holdingsData: holdingsDataResponse.success ? holdingsDataResponse.data : null,
        dividendsData: dividendsDataResponse.success ? dividendsDataResponse.data : null,
        ordersData: ordersDataResponse.success ? ordersDataResponse.data : null,
        openOrdersData: openOrdersDataResponse.success ? openOrdersDataResponse.data : null,
        accountData: accountDataResponse.success ? accountDataResponse.data : null,
        userData: userDataResponse.success ? userDataResponse.data : null,
        loading: false,
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load portfolio data. Please try again.'
      }))
    }
  }

  const fetchStockAnalysis = async (symbol: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/${symbol}/analysis`)
      const data = await response.json()
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          stockAnalysisData: data.data,
          loading: false
        }))
        setSelectedStock(symbol)
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.message || 'Failed to load stock analysis'
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load stock analysis. Please try again.'
      }))
    }
  }

  const clearStockAnalysis = () => {
    setState(prev => ({ ...prev, stockAnalysisData: null }))
    setSelectedStock(null)
  }

  const refreshData = () => {
    fetchPortfolioData()
  }

  const clearCache = () => {
    setState({
      portfolioData: null,
      holdingsData: null,
      dividendsData: null,
      ordersData: null,
      openOrdersData: null,
      accountData: null,
      userData: null,
      stockAnalysisData: null,
      loading: true,
      error: null
    })
    setSelectedStock(null)
    fetchPortfolioData()
  }

  const clearSession = () => {
    setState({
      portfolioData: null,
      holdingsData: null,
      dividendsData: null,
      ordersData: null,
      openOrdersData: null,
      accountData: null,
      userData: null,
      stockAnalysisData: null,
      loading: false,
      error: null
    })
    setSelectedStock(null)
  }

  // Initial data fetch
  useEffect(() => {
    fetchPortfolioData()
  }, [])

  return {
    ...state,
    selectedStock,
    fetchStockAnalysis,
    clearStockAnalysis,
    refreshData,
    clearCache,
    clearSession
  }
}