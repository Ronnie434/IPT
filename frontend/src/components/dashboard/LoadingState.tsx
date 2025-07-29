import { TrendingUp, RefreshCw } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { SkeletonCard, SkeletonTable, SkeletonList, SkeletonStats } from '@/components/ui/skeleton'

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg animate-pulse">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient-blue">Portfolio Analyzer</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-300">Loading insights...</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Header Skeleton */}
        <div className="text-center lg:text-left space-y-3 animate-fade-in">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-80 mx-auto lg:mx-0 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto lg:mx-0 animate-pulse"></div>
        </div>

        {/* Portfolio Summary Cards Skeleton */}
        <SkeletonStats count={4} className="animate-slide-up" />

        {/* Navigation Tabs Skeleton */}
        <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/10 p-2">
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" style={{ width: `${80 + index * 10}px`, animationDelay: `${index * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard variant="detailed" />
            <SkeletonTable rows={5} columns={4} />
          </div>
          <div className="space-y-6">
            <SkeletonCard variant="compact" />
            <SkeletonCard variant="default" />
            <SkeletonList items={4} withAvatar={true} />
          </div>
        </div>

        {/* Loading Animation Center */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center space-y-6 animate-bounce-gentle">
            <div className="relative">
              <div className="w-20 h-20 mx-auto">
                <RefreshCw className="animate-spin h-20 w-20 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white animate-pulse">Loading Portfolio Data</p>
              <p className="text-gray-600 dark:text-gray-400">Analyzing your investments...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}