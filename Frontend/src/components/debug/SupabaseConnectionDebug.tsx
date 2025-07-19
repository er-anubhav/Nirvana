'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export function SupabaseConnectionDebug() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [error, setError] = useState<string | null>(null);
  const [envCheck, setEnvCheck] = useState<{
    hasUrl: boolean;
    hasKey: boolean;
    urlPreview?: string;
    keyPreview?: string;
  }>({
    hasUrl: false,
    hasKey: false
  });

  useEffect(() => {
    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setEnvCheck({
      hasUrl: !!url,
      hasKey: !!key,
      urlPreview: url ? `${url.substring(0, 20)}...${url.substring(url.length - 10)}` : undefined,
      keyPreview: key ? `${key.substring(0, 10)}...${key.substring(key.length - 5)}` : undefined
    });

    // Test connection
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);

      console.log('Testing Supabase connection...');

      // Try a simple query to test connection
      const { data, error: queryError } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1);

      if (queryError) {
        console.error('Connection test failed:', queryError);
        setError(`Connection failed: ${queryError.message}`);
        setConnectionStatus('failed');
      } else {
        console.log('Connection test successful:', data);
        setConnectionStatus('connected');
      }
    } catch (err) {
      console.error('Connection test error:', err);
      setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setConnectionStatus('failed');
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
      <h3 className="mb-4 text-lg font-semibold text-white">Supabase Connection Debug</h3>
      
      {/* Environment Variables Check */}
      <div className="mb-4 space-y-2">
        <h4 className="font-medium text-purple-300">Environment Variables:</h4>
        <div className="flex items-center space-x-2">
          {envCheck.hasUrl ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className={envCheck.hasUrl ? 'text-green-300' : 'text-red-300'}>
            NEXT_PUBLIC_SUPABASE_URL: {envCheck.hasUrl ? envCheck.urlPreview : 'Missing'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {envCheck.hasKey ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className={envCheck.hasKey ? 'text-green-300' : 'text-red-300'}>
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {envCheck.hasKey ? envCheck.keyPreview : 'Missing'}
          </span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center mb-4 space-x-2">
        {connectionStatus === 'testing' && (
          <>
            <div className="w-4 h-4 border-2 border-purple-400 rounded-full border-t-transparent animate-spin" />
            <span className="text-purple-300">Testing connection...</span>
          </>
        )}
        {connectionStatus === 'connected' && (
          <>
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-green-300">Connected to Supabase</span>
          </>
        )}
        {connectionStatus === 'failed' && (
          <>
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-red-300">Connection failed</span>
          </>
        )}
      </div>

      {/* Error Details */}
      {error && (
        <div className="p-3 mb-4 border rounded-lg bg-red-500/10 border-red-500/30">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={testConnection}
        disabled={connectionStatus === 'testing'}
        className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-600/50"
      >
        Test Connection Again
      </button>

      {/* Instructions */}
      {(!envCheck.hasUrl || !envCheck.hasKey) && (
        <div className="p-3 mt-4 border rounded-lg bg-amber-500/10 border-amber-500/30">
          <p className="text-sm text-amber-300">
            <strong>Setup Required:</strong> Create a <code>.env.local</code> file in your project root with:
          </p>
          <pre className="mt-2 text-xs text-amber-200">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
          </pre>
        </div>
      )}
    </div>
  );
}
