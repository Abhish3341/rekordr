import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, AlertCircle, ArrowLeft } from 'lucide-react';
import { getVideoFromSupabase, isSupabaseConfigured } from '../utils/supabaseStorage';

export const ViewerPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [videoUrl, setVideoUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoId) {
        setError('Video ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        // Get video from Supabase (only storage option)
        if (isSupabaseConfigured()) {
          const videoUrl = await getVideoFromSupabase(videoId);
          setVideoUrl(videoUrl || undefined);
        } else {
          setError('Supabase is not configured. Please check your environment variables.');
        }

        if (!videoUrl) {
          setError('Video not found');
        }
      } catch (err) {
        console.error('❌ Failed to load video:', err);
        setError('Failed to load video from Supabase');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Video Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Recorder</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-dark-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-gray-400 dark:text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Recorder</span>
          </a>
        </div>

        <div className="bg-black dark:bg-dark-900 rounded-lg overflow-hidden shadow-2xl transition-colors duration-300">
          <div className="aspect-video">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect width='1280' height='720' fill='%23000'/%3E%3C/svg%3E"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p>Video not available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-dark-900 rounded-lg p-6 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Screen Recording</h1>
          <p className="text-gray-600 dark:text-gray-300">Video ID: {videoId}</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Recorded with Rekordr</span>
            <span>•</span>
            <span>Screen + Webcam + Audio</span>
          </div>
        </div>
      </div>
    </div>
  );
};