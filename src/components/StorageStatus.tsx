import React from 'react';
import { Cloud, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '../utils/supabaseStorage';

export const StorageStatus: React.FC = () => {
  const [supabaseConfigured, setSupabaseConfigured] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);

  const checkConfiguration = React.useCallback(() => {
    setIsChecking(true);
    setTimeout(() => {
      const configured = isSupabaseConfigured();
      setSupabaseConfigured(configured);
      setIsChecking(false);
    }, 500);
  }, []);

  React.useEffect(() => {
    checkConfiguration();
  }, [checkConfiguration]);

  const handleRefresh = () => {
    checkConfiguration();
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-dark-700 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Cloud className="w-6 h-6 text-blue-600" />
          <span>Supabase Storage</span>
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isChecking}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          title="Refresh configuration"
        >
          <RefreshCw className={`w-5 h-5 text-gray-500 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          {isChecking ? (
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          ) : supabaseConfigured ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
          <div className="flex-1">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isChecking 
                ? 'Checking configuration...'
                : supabaseConfigured 
                  ? 'Connected and Ready'
                  : 'Not Configured'
              }
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isChecking 
                ? 'Verifying Supabase connection...'
                : supabaseConfigured 
                  ? 'Your videos will be uploaded to Supabase Storage'
                  : 'Supabase configuration required to record videos'
              }
            </p>
          </div>
        </div>
        
        {!supabaseConfigured && !isChecking && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300">
              Please configure Supabase to enable video recording. Follow the setup instructions in the documentation.
            </p>
          </div>
        )}
      </div>
      
      {supabaseConfigured && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800 dark:text-green-300">
              <p className="font-semibold mb-1">🎉 Supabase is Ready!</p>
              <p>Your videos will be securely uploaded to Supabase Storage and accessible via shareable links.</p>
            </div>
          </div>
        </div>
      )}

      {!supabaseConfigured && !isChecking && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800 dark:text-red-300">
              <p className="font-semibold mb-2">⚠️ Supabase Configuration Required</p>
              <p className="mb-3">Recording is disabled until Supabase is properly configured.</p>
              <div className="space-y-2">
                <p className="font-medium">Setup Steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Create a free account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
                  <li>Create a new project</li>
                  <li>Go to Settings → API to get your credentials</li>
                  <li>Create a "videos" bucket in Storage (make it public)</li>
                  <li>Add credentials to your .env file</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};