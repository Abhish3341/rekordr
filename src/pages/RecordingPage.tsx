import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { VideoRecorder } from '../utils/mediaRecorder';
import { uploadVideo } from '../utils/supabaseStorage';
import { RecordingControls } from '../components/RecordingControls';
import { WebcamPreview } from '../components/WebcamPreview';
import { UploadProgress } from '../components/UploadProgress';
import { StorageStatus } from '../components/StorageStatus';
import { RecordingState, UploadProgress as UploadProgressType } from '../types';

export const RecordingPage: React.FC = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    hasPermissions: false
  });

  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({
    isUploading: false,
    progress: 0
  });

  const [shareableUrl, setShareableUrl] = useState<string>();
  const recorderRef = useRef<VideoRecorder>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize recorder without requesting permissions immediately
    const recorder = new VideoRecorder();
    recorderRef.current = recorder;

    return () => {
      if (recorderRef.current) {
        recorderRef.current.cleanup();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    if (!recorderRef.current) return;

    // Request permissions only when user clicks start recording
    const initializeAndStart = async () => {
      const hasPermissions = await recorderRef.current!.requestPermissions();
      
      if (!hasPermissions) {
        alert('Please grant permissions to record screen and webcam');
        return;
      }

      setRecordingState(prev => ({ ...prev, hasPermissions, isRecording: true, duration: 0 }));
      
      recorderRef.current!.startRecording();

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    };

    initializeAndStart();
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    console.log('🛑 User clicked stop recording');

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Update state immediately to show recording has stopped
    setRecordingState(prev => ({ 
      ...prev, 
      isRecording: false, 
      isPaused: false,
      hasPermissions: false
    }));

    try {
      const videoBlob = await recorderRef.current.stopRecording();
      
      console.log('📊 Recording stopped. Blob size:', videoBlob.size, 'bytes');
      
      if (videoBlob.size === 0) {
        throw new Error('Recording failed - no data captured. Please check permissions and try again.');
      }
      
      console.log('🎥 Recording completed successfully, starting upload...');
      
      const videoId = `video_${Date.now()}`;

      setUploadProgress({ isUploading: true, progress: 0 });

      const supabaseUrl = await uploadVideo(
        videoBlob, 
        videoId,
        (progress) => setUploadProgress(prev => ({ ...prev, progress }))
      );

      console.log('✅ Upload complete. Shareable URL:', supabaseUrl);
      setShareableUrl(supabaseUrl);
      setUploadProgress({ isUploading: false, progress: 100 });

    } catch (error) {
      console.error('❌ Upload failed:', error);
      
      // Force cleanup on error
      if (recorderRef.current) {
        recorderRef.current.cleanup();
      }
      
      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Recording failed. Please try again.'
      });
    }
  };

  const pauseRecording = () => {
    if (!recorderRef.current) return;

    if (recorderRef.current.isPaused()) {
      recorderRef.current.resumeRecording();
      setRecordingState(prev => ({ ...prev, isPaused: false }));
      
      // Resume timer
      intervalRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } else {
      recorderRef.current.pauseRecording();
      setRecordingState(prev => ({ ...prev, isPaused: true }));
      
      // Pause timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-dark-900 dark:to-purple-950/20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base font-medium">Back to Home</span>
          </Link>
        </div>
        
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Rekordr</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 px-4">Record your screen, webcam, and audio simultaneously</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <RecordingControls
              recordingState={recordingState}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onPauseRecording={pauseRecording}
            />
          </div>
          
          <div>
            <WebcamPreview
              stream={recorderRef.current?.getWebcamStream() || null}
              isRecording={recordingState.isRecording}
            />
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <StorageStatus />
        </div>

        <UploadProgress 
          uploadProgress={uploadProgress}
          shareableUrl={shareableUrl}
        />
      </div>
    </div>
  );
};