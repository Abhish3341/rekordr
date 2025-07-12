export interface Recording {
  id: string;
  videoBlob: Blob;
  timestamp: Date;
  duration: number;
}

export interface UploadedVideo {
  id: string;
  url: string;
  shareableUrl: string;
  uploadedAt: Date;
  size: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  hasPermissions: boolean;
}

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  error?: string;
}