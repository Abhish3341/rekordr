// Backup solution using local storage for development
export class LocalVideoStorage {
  private static readonly STORAGE_KEY = 'rekordr_videos';
  
  static async storeVideo(videoBlob: Blob, videoId: string): Promise<string> {
    try {
      // Create object URL for the video
      const videoUrl = URL.createObjectURL(videoBlob);
      
      // Store video metadata
      const videoData = {
        id: videoId,
        url: videoUrl,
        timestamp: Date.now(),
        size: videoBlob.size,
        type: videoBlob.type
      };
      
      // Get existing videos
      const existingVideos = this.getStoredVideos();
      existingVideos[videoId] = videoData;
      
      // Store in localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingVideos));
      
      return videoUrl;
    } catch (error) {
      console.error('Failed to store video locally:', error);
      throw new Error('Local storage failed');
    }
  }
  
  static getVideo(videoId: string): string | null {
    const videos = this.getStoredVideos();
    return videos[videoId]?.url || null;
  }
  
  static getStoredVideos(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }
  
  static clearOldVideos(maxAge: number = 24 * 60 * 60 * 1000): void {
    const videos = this.getStoredVideos();
    const now = Date.now();
    
    Object.keys(videos).forEach(videoId => {
      if (now - videos[videoId].timestamp > maxAge) {
        URL.revokeObjectURL(videos[videoId].url);
        delete videos[videoId];
      }
    });
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
  }
}