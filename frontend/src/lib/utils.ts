import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting utility - always 2 decimal places
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '$0.00'
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return '$0.00'
  }
  
  return `$${numValue.toFixed(2)}`
}

// Number formatting utility - always 2 decimal places for consistency
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0.00'
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return '0.00'
  }
  
  return numValue.toFixed(2)
}

// Stock quantity formatting - whole numbers for shares
export function formatQuantity(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0'
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return '0'
  }
  
  // Round to nearest whole number for stock quantities
  return Math.round(numValue).toString()
}

// Percentage formatting - 2 decimal places
export function formatPercentage(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0.00%'
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return '0.00%'
  }
  
  return `${numValue.toFixed(2)}%`
}

// Dividend rate formatting - 4 decimal places for precision
export function formatDividendRate(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '$0.0000'
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return '$0.0000'
  }
  
  return `$${numValue.toFixed(4)}`
}