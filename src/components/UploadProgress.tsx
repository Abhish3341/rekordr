import React from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { UploadProgress as UploadProgressType } from '../types';

interface UploadProgressProps {
  uploadProgress: UploadProgressType;
  shareableUrl?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ uploadProgress, shareableUrl }) => {
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (!uploadProgress.isUploading && !shareableUrl && !uploadProgress.error) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-dark-900 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-dark-700 transition-colors duration-300">
      <div className="text-center">
        {uploadProgress.isUploading && (
          <>
            <div className="flex justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600 animate-bounce" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Uploading Video...</h3>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{Math.round(uploadProgress.progress)}% complete</p>
          </>
        )}

        {uploadProgress.error && (
          <>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-red-900 dark:text-red-400 mb-2">Upload Failed</h3>
            <p className="text-sm text-red-600 dark:text-red-400">{uploadProgress.error}</p>
          </>
        )}

        {shareableUrl && !uploadProgress.isUploading && (
          <>
            <div className="flex justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Complete!</h3>
            <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 mb-4 transition-colors duration-300">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Share this link:</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                <input
                  type="text"
                  value={shareableUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-xs sm:text-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white transition-colors duration-300"
                />
                <button
                  onClick={() => copyToClipboard(shareableUrl)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
            <a
              href={shareableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View Video
            </a>
          </>
        )}
      </div>
    </div>
  );
};