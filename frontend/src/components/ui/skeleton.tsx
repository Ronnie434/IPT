import { cn } from "../../lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] animate-shimmer", className)}
      {...props}
    />
  )
}

interface SkeletonCardProps {
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

const SkeletonCard = ({ variant = 'default', className }: SkeletonCardProps) => {
  if (variant === 'compact') {
    return (
      <div className={cn("p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 space-y-3 animate-fade-in", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
    )
  }
  
  if (variant === 'detailed') {
    return (
      <div className={cn("p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 space-y-4 animate-fade-in", className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn("p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 space-y-4 animate-fade-in", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-56" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

const SkeletonTable = ({ rows = 5, columns = 4, className }: SkeletonTableProps) => {
  return (
    <div className={cn("space-y-3 animate-fade-in", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 animate-slide-up" style={{ animationDelay: `${rowIndex * 0.1}s` }}>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface SkeletonListProps {
  items?: number
  withAvatar?: boolean
  className?: string
}

const SkeletonList = ({ items = 6, withAvatar = false, className }: SkeletonListProps) => {
  return (
    <div className={cn("space-y-3 animate-fade-in", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
          {withAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface SkeletonStatsProps {
  count?: number
  className?: string
}

const SkeletonStats = ({ count = 4, className }: SkeletonStatsProps) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm space-y-4 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonList, SkeletonStats }