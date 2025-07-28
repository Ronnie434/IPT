export interface LoginForm {
  username: string
  password: string
  mfaCode: string
}

export interface PortfolioData {
  total_equity: number
  total_market_value: number
  total_positions: number
  total_dividends: number
}

export interface HoldingData {
  symbol: string
  name: string
  price: string
  percent_change: string
  quantity: string
  market_value: string
  average_buy_price: string
  total_return_today: string
  pe_ratio?: string
  dividend_yield?: string
}

export interface DividendData {
  id: string
  symbol: string
  amount: string
  rate: string
  paid_at: string
  payable_date: string
  state: string
  position: string
}

export interface OrderData {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: string
  price: string
  state: string
  type: string
  time_in_force: string
  created_at: string
}

export interface StockAnalysisData {
  symbol: string
  name: string
  price: string
  percent_change: string
  recent_orders: OrderData[]
  dividend_history: DividendData[]
  // Add more fields as needed
}

export interface AccountData {
  account_number: string
  buying_power: string
  cash: string
  sma: string
  total_value: string
  // Add more fields as needed
}

export interface UserData {
  email: string
  first_name: string
  last_name: string
  username: string
  // Add more fields as needed
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export type TabType = 'overview' | 'holdings' | 'dividends' | 'orders' | 'stock-analysis'