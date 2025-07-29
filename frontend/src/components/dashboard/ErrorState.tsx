import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border border-red-200 dark:border-red-800 bg-white/95 dark:bg-black/90 backdrop-blur-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/50">
            <Activity className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Connection Error</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Unable to load your portfolio data
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
          <Button 
            onClick={onRetry} 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}