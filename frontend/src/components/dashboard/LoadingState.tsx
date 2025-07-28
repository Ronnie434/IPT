'use client'

import { SkeletonCard, SkeletonStats } from '@/components/ui/skeleton'

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-black dark:via-gray-950 dark:to-black">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Portfolio Summary Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonStats />
          <SkeletonStats />
          <SkeletonStats />
          <SkeletonStats />
        </div>

        {/* Navigation Skeleton */}
        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />

        {/* Content Skeleton */}
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}