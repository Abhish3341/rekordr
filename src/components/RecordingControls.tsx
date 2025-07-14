import React from 'react';
import { Play, Square, Pause, Video, Mic } from 'lucide-react';
import { RecordingState } from '../types';
import { isSupabaseConfigured } from '../utils/supabaseStorage';

interface RecordingControlsProps {
  recordingState: RecordingState;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordingState,
  onStartRecording,
  onStopRecording,
  onPauseRecording
}) => {
  const supabaseReady = isSupabaseConfigured();

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-dark-700 transition-colors duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recording Controls</h2>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-1">
            <Video className="w-4 h-4" />
            <span>Screen + Webcam</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mic className="w-4 h-4" />
            <span>Audio</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-2">
          {formatDuration(recordingState.duration)}
        </div>
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
          recordingState.isRecording 
            ? recordingState.isPaused
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            recordingState.isRecording 
              ? recordingState.isPaused 
                ? 'bg-yellow-500' 
                : 'bg-red-500 animate-pulse' 
              : 'bg-gray-400'
          }`} />
          <span>
            {recordingState.isRecording 
              ? recordingState.isPaused 
                ? 'Paused' 
                : 'Recording' 
              : 'Ready to Record'}
          </span>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!recordingState.isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={!supabaseReady}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg ${
              supabaseReady 
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            <Play className="w-5 h-5" />
            <span>{supabaseReady ? 'Start Recording' : 'Configure Supabase First'}</span>
          </button>
        ) : (
          <>
            <button
              onClick={onPauseRecording}
              className={`flex items-center space-x-2 ${
                recordingState.isPaused 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-yellow-600 hover:bg-yellow-700'
              } text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg`}
            >
              {recordingState.isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </>
              )}
            </button>
            <button
              onClick={onStopRecording}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};