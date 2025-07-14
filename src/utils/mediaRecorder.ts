export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private screenStream: MediaStream | null = null;
  private webcamStream: MediaStream | null = null;
  private combinedStream: MediaStream | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      // Request screen capture with audio in a single call
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Only request webcam if screen capture was successful
      try {
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        });
      } catch (webcamError) {
        console.warn('Webcam access denied, continuing with screen recording only:', webcamError);
        // Continue without webcam - this is optional
      }

      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      this.cleanup();
      return false;
    }
  }

  createCombinedStream(): MediaStream {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 1920;
    canvas.height = 1080;

    const screenVideo = document.createElement('video');
    const webcamVideo = document.createElement('video');

    if (this.screenStream) {
      screenVideo.srcObject = this.screenStream;
      screenVideo.play();
    }

    if (this.webcamStream) {
      webcamVideo.srcObject = this.webcamStream;
      webcamVideo.play();
    }

    const canvasStream = canvas.captureStream(30);
    
    // Combine audio tracks from both sources
    const audioTracks: MediaStreamTrack[] = [];
    
    if (this.screenStream) {
      audioTracks.push(...this.screenStream.getAudioTracks());
    }
    
    if (this.webcamStream) {
      audioTracks.push(...this.webcamStream.getAudioTracks());
    }

    // Add audio tracks to canvas stream
    audioTracks.forEach(track => {
      canvasStream.addTrack(track);
    });

    // Draw combined video frames
    const drawFrame = () => {
      if (this.mediaRecorder?.state === 'recording') {
        // Clear canvas with black background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw screen capture (full canvas)
        if (screenVideo.readyState >= 2) {
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        }

        // Draw webcam overlay (bottom-right corner)
        if (webcamVideo.readyState >= 2 && this.webcamStream) {
          const webcamWidth = 320;
          const webcamHeight = 240;
          const x = canvas.width - webcamWidth - 20;
          const y = canvas.height - webcamHeight - 20;
          
          // Add border around webcam
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(x - 3, y - 3, webcamWidth + 6, webcamHeight + 6);
          
          // Draw webcam feed
          ctx.drawImage(webcamVideo, x, y, webcamWidth, webcamHeight);
        }

        requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
    this.combinedStream = canvasStream;
    return canvasStream;
  }

  startRecording(onDataAvailable?: (chunk: Blob) => void): void {
    if (!this.combinedStream) {
      this.combinedStream = this.createCombinedStream();
    }

    this.recordedChunks = [];
    
    // Use the best available codec
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8,opus';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    this.mediaRecorder = new MediaRecorder(this.combinedStream, {
      mimeType,
      videoBitsPerSecond: 2500000, // 2.5 Mbps
      audioBitsPerSecond: 128000   // 128 kbps
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
        onDataAvailable?.(event.data);
      }
    };

    this.mediaRecorder.start(1000); // Collect data every second
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  isPaused(): boolean {
    return this.mediaRecorder?.state === 'paused';
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          
          // CRITICAL: Immediately cleanup all streams after recording stops
          this.cleanup();
          
          resolve(blob);
        };
        this.mediaRecorder.stop();
      } else {
        // If no recording was made, still cleanup and return empty blob
        this.cleanup();
        resolve(new Blob([], { type: 'video/webm' }));
      }
    });
  }

  getWebcamStream(): MediaStream | null {
    return this.webcamStream;
  }

  getScreenStream(): MediaStream | null {
    return this.screenStream;
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  cleanup(): void {
    console.log('🧹 Cleaning up media streams...');
    
    // Stop and cleanup screen stream
    if (this.screenStream) {
      console.log('🖥️ Stopping screen stream tracks...');
      this.screenStream.getTracks().forEach(track => {
        console.log(`Stopping ${track.kind} track:`, track.label);
        track.stop();
      });
      this.screenStream = null;
    }
    
    // Stop and cleanup webcam stream
    if (this.webcamStream) {
      console.log('📹 Stopping webcam stream tracks...');
      this.webcamStream.getTracks().forEach(track => {
        console.log(`Stopping ${track.kind} track:`, track.label);
        track.stop();
      });
      this.webcamStream = null;
    }
    
    // Stop and cleanup combined stream
    if (this.combinedStream) {
      console.log('🎬 Stopping combined stream tracks...');
      this.combinedStream.getTracks().forEach(track => {
        console.log(`Stopping ${track.kind} track:`, track.label);
        track.stop();
      });
      this.combinedStream = null;
    }

    // Stop media recorder
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      console.log('⏹️ Stopping media recorder...');
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
    this.recordedChunks = [];
    
    console.log('✅ All media streams cleaned up successfully');
  }
}