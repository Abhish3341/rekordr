import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  // Note: In production, these should be environment variables
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadVideo = async (
  videoBlob: Blob, 
  videoId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, `videos/${videoId}`);
  
  try {
    // Upload with progress tracking
    const uploadTask = uploadBytes(storageRef, videoBlob);
    
    // Simulate progress for better UX (Firebase doesn't provide real-time progress for uploadBytes)
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) {
        progress = 95;
      }
      onProgress?.(progress);
    }, 200);
    
    await uploadTask;
    clearInterval(progressInterval);
    onProgress?.(100);
    
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};