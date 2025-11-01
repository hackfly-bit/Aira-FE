'use client';

import { useState } from 'react';
import { useApi, useApiPost } from '../lib/hooks/useApi';
import { checkApiHealth } from '../lib/api';

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null);
  const [testEndpoint, setTestEndpoint] = useState('/health');
  const [testResult, setTestResult] = useState<string>('');

  // Test GET request
  const { data, loading, error, execute } = useApi(testEndpoint, {
    onSuccess: (data) => {
      setTestResult(`✅ GET Success: ${JSON.stringify(data, null, 2)}`);
    },
    onError: (error) => {
      setTestResult(`❌ GET Error: ${error}`);
    }
  });

  // Test POST request
  const { 
    data: postData, 
    loading: postLoading, 
    error: postError, 
    execute: executePost 
  } = useApiPost('/test', {
    onSuccess: (data) => {
      setTestResult(`✅ POST Success: ${JSON.stringify(data, null, 2)}`);
    },
    onError: (error) => {
      setTestResult(`❌ POST Error: ${error}`);
    }
  });

  const handleHealthCheck = async () => {
    try {
      const isHealthy = await checkApiHealth();
      setHealthStatus(isHealthy);
      setTestResult(isHealthy ? '✅ API is healthy!' : '❌ API is not responding');
    } catch (error) {
      setHealthStatus(false);
      setTestResult(`❌ Health check failed: ${error}`);
    }
  };

  const handleGetTest = () => {
    execute();
  };

  const handlePostTest = () => {
    executePost({ message: 'Test from frontend', timestamp: new Date().toISOString() });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      {/* API Status */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">API Status</h2>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleHealthCheck}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Check API Health
          </button>
          {healthStatus !== null && (
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              healthStatus 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {healthStatus ? 'Healthy' : 'Unhealthy'}
            </span>
          )}
        </div>
      </div>

      {/* Test Endpoints */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Test Endpoints</h2>
        
        {/* Endpoint Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Test Endpoint:
          </label>
          <input
            type="text"
            value={testEndpoint}
            onChange={(e) => setTestEndpoint(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="/health"
          />
        </div>

        {/* Test Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleGetTest}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Testing GET...' : 'Test GET'}
          </button>
          
          <button
            onClick={handlePostTest}
            disabled={postLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {postLoading ? 'Testing POST...' : 'Test POST'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Test Results</h2>
        
        {testResult && (
          <div className="mb-4">
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
              {testResult}
            </pre>
          </div>
        )}

        {/* Current State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">GET Request State:</h3>
            <div className="text-sm space-y-1">
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>Error: {error || 'None'}</div>
              <div>Data: {data ? 'Received' : 'None'}</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">POST Request State:</h3>
            <div className="text-sm space-y-1">
              <div>Loading: {postLoading ? 'Yes' : 'No'}</div>
              <div>Error: {postError || 'None'}</div>
              <div>Data: {postData ? 'Received' : 'None'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration Info */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Configuration Info</h2>
        <div className="text-sm space-y-2">
          <div><strong>Backend URL:</strong> http://127.0.0.1:8000/api</div>
          <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
          <div><strong>API URL (Public):</strong> {process.env.NEXT_PUBLIC_API_URL}</div>
          <div><strong>Proxy:</strong> Enabled via Next.js rewrites</div>
        </div>
      </div>
    </div>
  );
}