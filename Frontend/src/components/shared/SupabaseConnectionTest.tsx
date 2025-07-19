'use client'

import { useState } from 'react'
import { validateSupabaseConnection, logDatabaseOperation } from '@/lib/supabase'

export default function SupabaseConnectionTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    status: 'idle' | 'success' | 'error'
    message: string
    timestamp?: string
  }>({ status: 'idle', message: 'Click to test connection' })

  const testConnection = async () => {
    setIsLoading(true)
    logDatabaseOperation('connection_test', 'supabase_client')
    
    try {
      const isValid = await validateSupabaseConnection()
      
      if (isValid) {
        setConnectionStatus({
          status: 'success',
          message: 'Connection successful! ✅',
          timestamp: new Date().toISOString()
        })
      } else {
        setConnectionStatus({
          status: 'error',
          message: 'Connection failed! ❌',
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      setConnectionStatus({
        status: 'error',
        message: `Connection error: ${error}`,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Supabase Connection Test
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isLoading ? 'Testing Connection...' : 'Test Connection'}
        </button>

        <div className={`p-3 rounded-md ${
          connectionStatus.status === 'success'
            ? 'bg-green-50 border border-green-200'
            : connectionStatus.status === 'error'
            ? 'bg-red-50 border border-red-200'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <p className={`text-sm font-medium ${
            connectionStatus.status === 'success'
              ? 'text-green-800'
              : connectionStatus.status === 'error'
              ? 'text-red-800'
              : 'text-gray-700'
          }`}>
            {connectionStatus.message}
          </p>
          
          {connectionStatus.timestamp && (
            <p className="text-xs text-gray-500 mt-1">
              Last tested: {new Date(connectionStatus.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        <div className="text-xs text-gray-500">
          <p className="mb-1">💡 This test validates:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Environment variables configuration</li>
            <li>Supabase client initialization</li>
            <li>Database connectivity</li>
            <li>Authentication service access</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
