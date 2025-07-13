// Simple Firebase implementation with local storage fallback
import { LocalVideoStorage } from './localStorageBackup';
import { uploadVideoToSupabase } from './supabaseStorage';

export const uploadVideo = async (
  videoBlob: Blob, 
  videoId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Try Supabase first if configured, fallback to local storage
  
  try {
    // Check if Supabase is configured
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('Using Supabase storage...');
      return await uploadVideoToSupabase(videoBlob, videoId, onProgress);
    }
    
    // Fallback to local storage
    console.log('Using local storage...');
    // Simulate upload progress for better UX
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 95) progress = 95;
      onProgress?.(progress);
    }, 100);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    clearInterval(progressInterval);
    onProgress?.(100);

    // Store video locally
    return await LocalVideoStorage.storeVideo(videoBlob, videoId);
    
  } catch (error) {
    console.error('Upload failed:', error);
    // Always fallback to local storage
    console.log('Falling back to local storage...');
    return await LocalVideoStorage.storeVideo(videoBlob, videoId);
  }
};

// Future: Add cloud storage providers here
export const uploadToCloud = async (
  videoBlob: Blob,
  videoId: string,
  provider: 'supabase' | 'cloudinary' = 'supabase'
) => {
  // This can be implemented when you want to add cloud storage
  console.log(`Future: Upload to ${provider}`);
  return uploadVideo(videoBlob, videoId);
};