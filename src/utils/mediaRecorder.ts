export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private screenStream: MediaStream | null = null;
  private webcamStream: MediaStream | null = null;
  private combinedStream: MediaStream | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private isRecordingActive = false;

  async requestPermissions(): Promise<boolean> {
    try {
      console.log('🎥 Requesting screen capture permissions...');
      
      // Request screen capture with audio
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          mediaSource: 'screen',
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      console.log('✅ Screen capture granted');

      // Request webcam (optional)
      try {
        console.log('📹 Requesting webcam permissions...');
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640, max: 640 }, 
            height: { ideal: 480, max: 480 },
            facingMode: 'user',
            frameRate: { ideal: 30, max: 30 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        });
        console.log('✅ Webcam access granted');
      } catch (webcamError) {
        console.warn('⚠️ Webcam access denied, continuing with screen only:', webcamError);
      }

      // Listen for screen share end
      this.screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('🛑 Screen sharing ended by user');
        this.forceStop();
      });

      return true;
    } catch (error) {
      console.error('❌ Permission denied:', error);
      this.cleanup();
      return false;
    }
  }

  createCombinedStream(): MediaStream {
    console.log('🎬 Creating combined stream...');
    
    if (!this.screenStream) {
      throw new Error('No screen stream available');
    }

    // For simplicity, let's use the screen stream directly with audio
    // This avoids canvas complexity that might cause data loss
    const combinedStream = new MediaStream();
    
    // Add video track from screen
    const videoTrack = this.screenStream.getVideoTracks()[0];
    if (videoTrack) {
      combinedStream.addTrack(videoTrack);
      console.log('🎥 Added screen video track');
    }

    // Add audio tracks from screen
    const screenAudioTracks = this.screenStream.getAudioTracks();
    screenAudioTracks.forEach(track => {
      combinedStream.addTrack(track);
      console.log('🔊 Added screen audio track:', track.label);
    });

    // Add audio from webcam if available
    if (this.webcamStream) {
      const webcamAudioTracks = this.webcamStream.getAudioTracks();
      webcamAudioTracks.forEach(track => {
        combinedStream.addTrack(track);
        console.log('🎤 Added webcam audio track:', track.label);
      });
    }

    this.combinedStream = combinedStream;
    console.log('✅ Combined stream created with', combinedStream.getTracks().length, 'tracks');
    
    return combinedStream;
  }

  startRecording(onDataAvailable?: (chunk: Blob) => void): void {
    console.log('🎬 Starting recording...');
    
    if (!this.screenStream) {
      throw new Error('No screen stream available. Please request permissions first.');
    }

    this.recordedChunks = [];
    this.isRecordingActive = true;
    
    if (!this.combinedStream) {
      this.combinedStream = this.createCombinedStream();
    }

    // Use a simple, reliable codec
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      ? 'video/webm;codecs=vp8'
      : 'video/webm';
    
    console.log('🎥 Using MIME type:', mimeType);

    try {
      this.mediaRecorder = new MediaRecorder(this.combinedStream, {
        mimeType,
        videoBitsPerSecond: 1000000, // 1 Mbps - more conservative
        audioBitsPerSecond: 128000   // 128 kbps
      });

      // CRITICAL: Collect data immediately when available
      this.mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Data chunk received:', event.data.size, 'bytes');
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
          onDataAvailable?.(event.data);
        } else {
          console.warn('⚠️ Received empty data chunk');
        }
      };

      this.mediaRecorder.onstart = () => {
        console.log('✅ MediaRecorder started successfully');
        this.isRecordingActive = true;
      };

      this.mediaRecorder.onstop = () => {
        console.log('⏹️ MediaRecorder stopped');
        console.log('📊 Total chunks collected:', this.recordedChunks.length);
        const totalSize = this.recordedChunks.reduce((sum, chunk) => sum + chunk.size, 0);
        console.log('📊 Total data size:', totalSize, 'bytes');
        this.isRecordingActive = false;
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        this.isRecordingActive = false;
      };

      // Start recording with small time slices for better data collection
      this.mediaRecorder.start(250); // Collect data every 250ms
      
    } catch (error) {
      console.error('❌ Failed to start MediaRecorder:', error);
      this.isRecordingActive = false;
      throw error;
    }
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      console.log('⏸️ Pausing recording...');
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      console.log('▶️ Resuming recording...');
      this.mediaRecorder.resume();
    }
  }

  isPaused(): boolean {
    return this.mediaRecorder?.state === 'paused';
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      console.log('⏹️ Stopping recording...');
      
      if (!this.mediaRecorder) {
        console.error('❌ No media recorder found');
        this.cleanup();
        reject(new Error('No media recorder available'));
        return;
      }

      if (this.mediaRecorder.state === 'inactive') {
        console.log('⚠️ MediaRecorder already inactive');
        this.handleRecordingComplete(resolve, reject);
        return;
      }

      // Set up the stop handler
      this.mediaRecorder.onstop = () => {
        this.handleRecordingComplete(resolve, reject);
      };

      // Request any remaining data
      if (this.mediaRecorder.state === 'recording' || this.mediaRecorder.state === 'paused') {
        this.mediaRecorder.requestData();
        
        // Give a moment for data to be collected, then stop
        setTimeout(() => {
          if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
          }
        }, 500);
      }
    });
  }

  private handleRecordingComplete(resolve: (blob: Blob) => void, reject: (error: Error) => void): void {
    console.log('📊 Processing recorded chunks:', this.recordedChunks.length);
    
    if (this.recordedChunks.length === 0) {
      console.error('❌ No recorded chunks available!');
      this.cleanup();
      reject(new Error('No recording data available. The recording may have failed to start properly.'));
      return;
    }

    try {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      console.log('✅ Final blob created:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        console.error('❌ Generated blob is empty!');
        this.cleanup();
        reject(new Error('Recording failed - no data captured. Please try again.'));
        return;
      }
      
      this.cleanup();
      resolve(blob);
    } catch (error) {
      console.error('❌ Error creating blob:', error);
      this.cleanup();
      reject(new Error('Failed to process recording data'));
    }
  }

  forceStop(): void {
    console.log('🛑 Force stopping recording...');
    this.isRecordingActive = false;
    this.cleanup();
  }

  getWebcamStream(): MediaStream | null {
    return this.webcamStream;
  }

  getScreenStream(): MediaStream | null {
    return this.screenStream;
  }

  isRecording(): boolean {
    return this.isRecordingActive && this.mediaRecorder?.state === 'recording';
  }

  cleanup(): void {
    console.log('🧹 Cleaning up all media streams and resources...');
    
    this.isRecordingActive = false;
    
    // Stop animation frame
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Stop MediaRecorder first
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      console.log('⏹️ Stopping MediaRecorder...');
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.warn('⚠️ Error stopping MediaRecorder:', error);
      }
    }
    this.mediaRecorder = null;
    
    // Stop and cleanup screen stream
    if (this.screenStream) {
      console.log('🖥️ Stopping screen stream tracks...');
      this.screenStream.getTracks().forEach(track => {
        console.log(`Stopping screen ${track.kind} track:`, track.label);
        track.stop();
      });
      this.screenStream = null;
    }
    
    // Stop and cleanup webcam stream
    if (this.webcamStream) {
      console.log('📹 Stopping webcam stream tracks...');
      this.webcamStream.getTracks().forEach(track => {
        console.log(`Stopping webcam ${track.kind} track:`, track.label);
        track.stop();
      });
      this.webcamStream = null;
    }
    
    // Stop and cleanup combined stream
    if (this.combinedStream) {
      console.log('🎬 Stopping combined stream tracks...');
      this.combinedStream.getTracks().forEach(track => {
        console.log(`Stopping combined ${track.kind} track:`, track.label);
        track.stop();
      });
      this.combinedStream = null;
    }

    // Cleanup canvas
    if (this.canvas) {
      this.canvas = null;
      this.ctx = null;
    }

    // Clear recorded chunks
    this.recordedChunks = [];
    
    console.log('✅ All media streams and resources cleaned up successfully');
  }
}