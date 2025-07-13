import React, { useState, useEffect, useRef } from 'react';
import { VideoRecorder } from '../utils/mediaRecorder';
import { uploadVideo } from '../utils/firebase';
import { RecordingControls } from '../components/RecordingControls';
import { WebcamPreview } from '../components/WebcamPreview';
import { UploadProgress } from '../components/UploadProgress';
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
    // Initialize recorder and request permissions
    const initializeRecorder = async () => {
      const recorder = new VideoRecorder();
      const hasPermissions = await recorder.requestPermissions();
      
      setRecordingState(prev => ({ ...prev, hasPermissions }));
      recorderRef.current = recorder;
    };

    initializeRecorder();

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

    recorderRef.current.startRecording();
    setRecordingState(prev => ({ ...prev, isRecording: true, duration: 0 }));

    // Start duration timer
    intervalRef.current = setInterval(() => {
      setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setRecordingState(prev => ({ ...prev, isRecording: false }));

    try {
      const videoBlob = await recorderRef.current.stopRecording();
      const videoId = `video_${Date.now()}`;

      setUploadProgress({ isUploading: true, progress: 0 });

      const downloadURL = await uploadVideo(
        videoBlob, 
        videoId,
        (progress) => setUploadProgress(prev => ({ ...prev, progress }))
      );

      const shareableUrl = `${window.location.origin}/video/${videoId}`;
      setShareableUrl(shareableUrl);
      setUploadProgress({ isUploading: false, progress: 100 });

      // Store the video URL in localStorage for demo purposes
      localStorage.setItem(videoId, downloadURL);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: 'Upload failed. Please try again.'
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Rekordr</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Record your screen, webcam, and audio simultaneously</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

        <UploadProgress 
          uploadProgress={uploadProgress}
          shareableUrl={shareableUrl}
        />
      </div>
    </div>
  );
};