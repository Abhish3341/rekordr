// Universal Storage Manager - Handles Multiple Providers
import { LocalVideoStorage } from './localStorageBackup';
import { uploadVideoToSupabase } from './supabaseStorage';
import { uploadToCloudinary } from './cloudinaryStorage';

export type StorageProvider = 'local' | 'supabase' | 'cloudinary';

export class StorageManager {
  private static getProvider(): StorageProvider {
    // Check which provider is configured
    if (import.meta.env.VITE_SUPABASE_URL) return 'supabase';
    if (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) return 'cloudinary';
    return 'local';
  }

  static async uploadVideo(
    videoBlob: Blob,
    videoId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const provider = this.getProvider();
    
    console.log(`Using storage provider: ${provider}`);

    try {
      switch (provider) {
        case 'supabase':
          return await uploadVideoToSupabase(videoBlob, videoId, onProgress);
        
        case 'cloudinary':
          return await uploadToCloudinary(videoBlob, videoId, onProgress);
        
        case 'local':
        default:
          // Simulate upload progress for local storage
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 95) progress = 95;
            onProgress?.(progress);
          }, 100);

          await new Promise(resolve => setTimeout(resolve, 1500));
          clearInterval(progressInterval);
          onProgress?.(100);

          return await LocalVideoStorage.storeVideo(videoBlob, videoId);
      }
    } catch (error) {
      console.error(`${provider} upload failed, falling back to local storage:`, error);
      return await LocalVideoStorage.storeVideo(videoBlob, videoId);
    }
  }

  static getVideo(videoId: string): string | null {
    return LocalVideoStorage.getVideo(videoId);
  }
}