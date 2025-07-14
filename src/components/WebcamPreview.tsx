import React, { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

interface WebcamPreviewProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

export const WebcamPreview: React.FC<WebcamPreviewProps> = ({ stream, isRecording }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="bg-white dark:bg-dark-900 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-dark-700 transition-colors duration-300">
      <div className="flex items-center space-x-2 mb-4">
        <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Webcam Preview</h3>
        {isRecording && (
          <div className="flex items-center space-x-1 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-medium">Live</span>
          </div>
        )}
      </div>
      
      <div className="relative aspect-video bg-gray-900 dark:bg-dark-800 rounded-lg overflow-hidden transition-colors duration-300">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <Camera className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-sm sm:text-base">No camera detected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};