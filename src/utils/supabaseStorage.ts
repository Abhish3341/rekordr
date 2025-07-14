// Supabase Storage - The ONLY storage solution for Rekordr
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Missing',
  key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Missing',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
  storageMode: 'SUPABASE_ONLY'
});

function isValidSupabaseConfig(): boolean {
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables - Storage disabled');
    return false;
  }
  
  // Check for placeholder patterns
  const placeholderPatterns = [
    'your-project', 'your_project', 'your-rekordr', 'your_supabase',
    'example', 'placeholder', 'your_actual', 'your_anon_key',
    'your_project_id', 'abcdefghijklmnop', 'your-project-id'
  ];
  
  const hasPlaceholder = placeholderPatterns.some(pattern => 
    supabaseUrl.toLowerCase().includes(pattern) || supabaseKey.toLowerCase().includes(pattern)
  );
  
  if (hasPlaceholder) {
    console.error('❌ Supabase configuration contains placeholder values - Storage disabled');
    return false;
  }
  
  // Validate URL format
  const hasValidFormat = supabaseUrl.includes('.supabase.co') && supabaseUrl.startsWith('https://');
  
  // Validate key format (JWT tokens are long and contain dots)
  const hasValidKey = supabaseKey.length > 100 && supabaseKey.includes('.');
  
  if (!hasValidFormat) {
    console.error('❌ Invalid Supabase URL format - Storage disabled');
    return false;
  }
  
  if (!hasValidKey) {
    console.error('❌ Invalid Supabase API key format - Storage disabled');
    return false;
  }
  
  console.log('✅ Supabase configuration is valid - Storage enabled');
  return true;
}

// Create Supabase client only if configuration is valid
export const supabase = isValidSupabaseConfig() 
  ? createClient(supabaseUrl!, supabaseKey!) 
  : null;

export const isSupabaseConfigured = (): boolean => {
  const configured = !!(supabase && isValidSupabaseConfig());
  console.log('🔍 Supabase configured check:', configured ? 'ENABLED' : 'DISABLED - Configure Supabase to record videos');
  return configured;
};

export const uploadVideo = async (
  videoBlob: Blob,
  videoId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!supabase || !isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }

  // Validate blob before upload
  if (!videoBlob || videoBlob.size === 0) {
    throw new Error('Invalid video data - blob is empty or corrupted. Please try recording again.');
  }

  console.log('📋 Upload details:');
  console.log('  - Video ID:', videoId);
  console.log('  - Blob size:', (videoBlob.size / 1024 / 1024).toFixed(2), 'MB');
  console.log('  - Blob type:', videoBlob.type);
  console.log('  - Timestamp:', new Date().toISOString());


  try {
    // Test basic connection first
    console.log('🔗 Testing Supabase connection...');
    
    // Simple connection test - try to get storage info
    const { error: connectionError } = await supabase.storage.from('videos').list('', { limit: 1 });
    
    if (connectionError) {
      console.error('❌ Supabase connection test failed:', connectionError);
      
      // Check if it's a bucket not found error
      if (connectionError.message?.includes('not found') || connectionError.message?.includes('does not exist')) {
        throw new Error('Videos bucket not found. Please create a "videos" bucket in Supabase Storage and make sure it\'s public.');
      }
      
      throw new Error(`Supabase connection failed: ${connectionError.message}`);
    }
    
    console.log('✅ Supabase connection successful');

    // Simulate progress for better UX
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) progress = 95;
      onProgress?.(progress);
    }, 200);

    // Upload to Supabase Storage
    console.log('⬆️ Uploading to Supabase Storage...');
    const fileName = `${videoId}.webm`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, videoBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: videoBlob.type || 'video/webm'
      });

    clearInterval(progressInterval);
    onProgress?.(100);

    if (error) {
      console.error('❌ Supabase upload error:', error);
      
      // Provide specific error messages
      if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
        throw new Error('Videos bucket not found. Please create a "videos" bucket in Supabase Storage.');
      }
      
      if (error.message?.includes('permission') || error.message?.includes('unauthorized')) {
        throw new Error('Permission denied. Please check your Supabase bucket policies and make sure the bucket is public.');
      }
      
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('✅ Supabase upload successful:', data);
    console.log('📊 Uploaded file path:', data.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log('🔗 Generated public URL:', publicUrl);
    
    // Verify the uploaded file exists and has content
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      console.log('📊 Upload verification - Status:', response.status);
      console.log('📊 Upload verification - Content-Length:', response.headers.get('content-length'));
      
      if (!response.ok) {
        throw new Error(`Upload verification failed: ${response.status}`);
      }
    } catch (verifyError) {
      console.warn('⚠️ Could not verify upload:', verifyError);
    }
    
    return publicUrl;
  } catch (error) {
    console.error('❌ Supabase upload failed:', error);
    throw error;
  }
};

export const getVideoFromSupabase = async (videoId: string): Promise<string | null> => {
  if (!supabase || !isSupabaseConfigured()) {
    console.warn('⚠️ Supabase not configured');
    return null;
  }

  try {
    const fileName = `${videoId}.webm`;
    const { data } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    console.log('🎥 Retrieved video URL from Supabase:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('❌ Failed to get video from Supabase:', error);
    return null;
  }
};