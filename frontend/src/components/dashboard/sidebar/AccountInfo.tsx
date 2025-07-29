import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AccountInfoProps {
  userData: any
  accountData: any
}

export function AccountInfo({ userData, accountData }: AccountInfoProps) {
  return (
    <Card className="border border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Account Information</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Your account and profile details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {userData ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {userData.first_name?.[0]?.toUpperCase() || userData.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {userData.first_name && userData.last_name 
                    ? `${userData.first_name} ${userData.last_name}`
                    : userData.username
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</p>
              </div>
            </div>
            
            {userData.account_id && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Account ID</p>
                <p className="font-mono text-sm text-gray-900 dark:text-white">{userData.account_id}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400">Loading account information...</p>
          </div>
        )}
        
        {accountData && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Details</p>
            <div className="space-y-2 text-sm">
              {accountData.profile && Object.keys(accountData.profile).length > 0 && (
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <p className="text-green-700 dark:text-green-300">✓ Profile configured</p>
                </div>
              )}
              {accountData.account && Object.keys(accountData.account).length > 0 && (
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="text-blue-700 dark:text-blue-300">✓ Account active</p>
                </div>
              )}
              {accountData.portfolio && Object.keys(accountData.portfolio).length > 0 && (
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <p className="text-purple-700 dark:text-purple-300">✓ Portfolio connected</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}