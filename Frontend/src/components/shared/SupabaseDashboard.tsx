'use client'

import { useState, useEffect } from 'react'
import { validateSupabaseConnection } from '@/lib/supabase'
import { useSupabaseLogs } from '@/lib/supabase-logger'

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  operation: string
  table?: string
  userId?: string
  duration?: number
  details?: any
  error?: any
}

export default function SupabaseDashboard() {
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown')
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selectedLogLevel, setSelectedLogLevel] = useState<'all' | 'info' | 'warn' | 'error' | 'debug'>('all')
  
  const { getRecentLogs, getLogsByLevel, clearLogs, exportLogs } = useSupabaseLogs()

  useEffect(() => {
    // Initial connection check
    checkConnection()
    
    // Update logs
    updateLogs()
    
    // Set up periodic log updates
    const interval = setInterval(updateLogs, 2000)
    
    return () => clearInterval(interval)
  }, [selectedLogLevel])

  const checkConnection = async () => {
    setIsLoading(true)
    try {
      const isConnected = await validateSupabaseConnection()
      setConnectionStatus(isConnected ? 'connected' : 'disconnected')
    } catch (error) {
      setConnectionStatus('disconnected')
    } finally {
      setIsLoading(false)
    }
  }

  const updateLogs = () => {
    const recentLogs = selectedLogLevel === 'all' 
      ? getRecentLogs(50) 
      : getLogsByLevel(selectedLogLevel as any)
    setLogs(recentLogs.reverse()) // Show newest first
  }

  const handleClearLogs = () => {
    clearLogs()
    setLogs([])
  }

  const handleExportLogs = () => {
    const logsData = exportLogs()
    const blob = new Blob([logsData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supabase-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200'
      case 'disconnected': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50'
      case 'warn': return 'text-yellow-600 bg-yellow-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      case 'debug': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Supabase Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={checkConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Test Connection'}
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'disconnected' ? 'bg-red-500' : 'bg-gray-400'
          }`} />
          <h2 className="text-lg font-semibold">
            Connection Status: {connectionStatus.toUpperCase()}
          </h2>
        </div>
        <p className="text-sm mt-1">
          {connectionStatus === 'connected' && 'Successfully connected to Supabase'}
          {connectionStatus === 'disconnected' && 'Failed to connect to Supabase - check configuration'}
          {connectionStatus === 'unknown' && 'Connection status unknown'}
        </p>
      </div>

      {/* Environment Variables Check */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Environment Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <p>Green: Configured</p>
            <p>Red: Missing or empty</p>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Activity Logs</h3>
            <div className="flex space-x-2">
              <select
                value={selectedLogLevel}
                onChange={(e) => setSelectedLogLevel(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warnings</option>
                <option value="error">Errors</option>
                <option value="debug">Debug</option>
              </select>
              <button
                onClick={handleClearLogs}
                className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
              >
                Clear
              </button>
              <button
                onClick={handleExportLogs}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {logs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {logs.map((log, index) => (
                <div key={index} className="p-3 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{log.operation}</span>
                        <span className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
                      </div>
                      {log.table && (
                        <p className="text-xs text-gray-600">Table: {log.table}</p>
                      )}
                      {(log.details || log.error) && (
                        <pre className="text-xs text-gray-600 mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details || log.error, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No logs available</p>
              <p className="text-sm">Logs will appear here as you interact with Supabase</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
