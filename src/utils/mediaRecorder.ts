export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private screenStream: MediaStream | null = null;
  private webcamStream: MediaStream | null = null;
  private combinedStream: MediaStream | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      // Request screen capture
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });

      // Request webcam and microphone
      this.webcamStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      return false;
    }
  }

  createCombinedStream(): MediaStream {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 1280;
    canvas.height = 720;

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
    
    // Combine audio tracks
    const audioTracks = [
      ...(this.screenStream?.getAudioTracks() || []),
      ...(this.webcamStream?.getAudioTracks() || [])
    ];

    audioTracks.forEach(track => {
      canvasStream.addTrack(track);
    });

    // Draw combined video
    const drawFrame = () => {
      if (this.mediaRecorder?.state === 'recording') {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw screen capture (main area)
        if (screenVideo.readyState >= 2) {
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        }

        // Draw webcam (picture-in-picture, bottom-right)
        if (webcamVideo.readyState >= 2) {
          const webcamWidth = 240;
          const webcamHeight = 180;
          const x = canvas.width - webcamWidth - 20;
          const y = canvas.height - webcamHeight - 20;
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(x - 5, y - 5, webcamWidth + 10, webcamHeight + 10);
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
    this.mediaRecorder = new MediaRecorder(this.combinedStream, {
      mimeType: 'video/webm;codecs=vp9'
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
          resolve(blob);
        };
        this.mediaRecorder.stop();
      }
    });
  }

  getWebcamStream(): MediaStream | null {
    return this.webcamStream;
  }

  cleanup(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
    }
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(track => track.stop());
    }
    if (this.combinedStream) {
      this.combinedStream.getTracks().forEach(track => track.stop());
    }
  }
}