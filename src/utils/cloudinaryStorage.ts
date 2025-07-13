// Cloudinary - Free 25GB Storage
export const uploadToCloudinary = async (
  videoBlob: Blob,
  videoId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary not configured');
  }

  const formData = new FormData();
  formData.append('file', videoBlob);
  formData.append('upload_preset', uploadPreset);
  formData.append('public_id', videoId);
  formData.append('resource_type', 'video');

  try {
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 95) progress = 95;
      onProgress?.(progress);
    }, 300);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    clearInterval(progressInterval);
    onProgress?.(100);

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Upload failed');
  }
};