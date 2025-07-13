// Supabase Storage - 100% Free Alternative to Firebase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadVideoToSupabase = async (
  videoBlob: Blob,
  videoId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Simulate progress for better UX
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) progress = 95;
      onProgress?.(progress);
    }, 200);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(`${videoId}.webm`, videoBlob, {
        cacheControl: '3600',
        upsert: false
      });

    clearInterval(progressInterval);
    onProgress?.(100);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(`${videoId}.webm`);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Supabase upload failed:', error);
    throw new Error('Upload failed');
  }
};

export const getVideoFromSupabase = async (videoId: string): Promise<string | null> => {
  try {
    const { data } = supabase.storage
      .from('videos')
      .getPublicUrl(`${videoId}.webm`);

    return data.publicUrl;
  } catch (error) {
    console.error('Failed to get video from Supabase:', error);
    return null;
  }
};