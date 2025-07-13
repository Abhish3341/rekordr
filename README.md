# Rekordr - Video Walkthrough Recording App

A web application that allows users to record their screen, webcam, and microphone simultaneously, upload recordings to Firebase Storage, and share videos via unique links.

## Features

- **Multi-source Recording**: Capture screen, webcam, and microphone audio simultaneously
- **Live Preview**: Real-time webcam preview during recording
- **Direct Cloud Upload**: Upload videos directly to Firebase Storage from the browser
- **Shareable Links**: Generate unique URLs for video sharing
- **Responsive Design**: Optimized for desktop recording workflows
- **Real-time Feedback**: Recording status, upload progress, and completion notifications

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions (Firebase, MediaRecorder)
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── README.md
```

## Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with MediaRecorder API support
- Firebase project with Storage enabled

### Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. **Configure Firebase Environment Variables:**
   
   a. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   b. Get your Firebase configuration:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firebase Storage
   - Go to Project Settings > General > Your apps
   - Click on the web app icon (</>) to create a web app
   - Copy the configuration values
   
   c. Update the `.env` file with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Set up Firebase Storage security rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /videos/{videoId} {
         allow read: if true;
         allow write: if request.resource.size < 500 * 1024 * 1024; // 500MB limit
       }
     }
   }
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## How It Works

### Recording Process

1. **Permission Request**: The app requests access to screen capture and webcam/microphone
2. **Stream Combination**: Combines screen capture with webcam overlay using HTML5 Canvas
3. **MediaRecorder**: Uses the MediaRecorder API to record the combined stream
4. **Real-time Preview**: Shows live webcam feed during recording

### Upload & Sharing

1. **Local Storage**: Recording is saved as a Blob in browser memory
2. **Direct Upload**: Video is uploaded directly to Firebase Storage from the browser
3. **URL Generation**: Creates a shareable link for the video
4. **Viewer Page**: Dedicated page for video playback

### Video Playback

- HTML5 video player with standard controls
- Responsive design for various screen sizes
- Error handling for missing or corrupted videos

## Browser Compatibility

- **Chrome/Chromium**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Limited support (no screen recording) ⚠️
- **Edge**: Full support ✅

## Architecture Benefits

### Frontend-Only Approach

This app uses a **serverless frontend architecture** with direct Firebase integration:

- **Simplified Deployment**: No backend server to manage
- **Faster Development**: Direct browser-to-Firebase communication
- **Cost Effective**: No server hosting costs
- **Scalable**: Firebase handles all backend infrastructure
- **Secure**: Firebase Storage security rules control access

### Why No Backend Server?

- Firebase Storage allows secure direct uploads from browsers
- Firebase provides built-in authentication and security rules
- Reduces complexity and deployment requirements
- Perfect for rapid prototyping and MVP development

## Deployment

The app can be deployed to static hosting platforms:

### Netlify (Recommended)
```bash
npm run build
# Deploy the dist/ folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy using Vercel CLI or GitHub integration
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Environment Variables

**Required Environment Variables:**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important Notes:**
- All environment variables must start with `VITE_` for Vite to expose them to the frontend
- Never commit your `.env` file to version control (it's in .gitignore)
- For production deployment, set these variables in your hosting platform's environment settings

## Technical Implementation

### Key Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Recording**: MediaRecorder API, Canvas API
- **Storage**: Firebase Storage (direct upload)
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite

### Security Considerations

- All recording happens client-side
- Videos are uploaded directly to Firebase Storage
- Firebase Storage security rules control access
- Shareable links use unique identifiers
- No sensitive data stored in localStorage

## Limitations & Known Issues

1. **Browser Permissions**: Users must grant screen capture and camera/microphone permissions
2. **File Size**: Large recordings may take time to upload depending on connection speed
3. **Storage Costs**: Firebase Storage usage may incur costs for large numbers of videos
4. **Safari Compatibility**: Screen recording is not supported in Safari
5. **Mobile Devices**: Screen recording is not available on mobile browsers

## Firebase Storage Setup

### Security Rules

Configure Firebase Storage rules for secure access:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{videoId} {
      // Allow anyone to read videos (for sharing)
      allow read: if true;
      
      // Allow uploads with size limit
      allow write: if request.resource.size < 500 * 1024 * 1024 && 
                      request.resource.contentType.matches('video/.*');
    }
  }
}
```

### CORS Configuration

Ensure Firebase Storage allows browser uploads by configuring CORS:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT"],
    "maxAgeSeconds": 3600
  }
]
```

## Future Enhancements

- User authentication and video management
- Video editing capabilities
- Custom branding and themes
- Analytics and view tracking
- Integration with other storage providers
- Mobile app version
- Collaborative features and comments
- Video compression and optimization

## Performance Optimizations

- Lazy loading of video components
- Progressive video upload with chunking
- Optimized Canvas rendering for smooth recording
- Efficient memory management for large recordings

## License

This project is open source and available under the MIT License.