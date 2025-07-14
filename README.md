# Rekordr - Video Walkthrough Recording App

A web application that allows users to record their screen, webcam, and microphone simultaneously, upload recordings to Supabase Storage, and share videos via unique links.

## Features

- **Multi-source Recording**: Capture screen, webcam, and microphone audio simultaneously
- **Live Preview**: Real-time webcam preview during recording
- **Direct Cloud Upload**: Upload videos directly to Supabase Storage from the browser
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
- Supabase project with Storage enabled

### Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. **Configure Supabase Environment Variables:**
   
   a. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   b. Get your Supabase configuration:
   - Create a Supabase project at https://supabase.com
   - Go to Settings → API to get your credentials
   - Copy the configuration values
   
   c. Update the `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Set up Supabase Storage:**
   - Go to your Supabase project dashboard
   - Navigate to Storage
   - Create a new bucket named "videos"
   - Set the bucket to public for video sharing

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

1. **Browser Recording**: Recording is saved as a Blob in browser memory
2. **Direct Upload**: Video is uploaded directly to Supabase Storage from the browser
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

This app uses a **serverless frontend architecture** with direct Supabase integration:

- **Simplified Deployment**: No backend server to manage
- **Faster Development**: Direct browser-to-Supabase communication
- **Cost Effective**: No server hosting costs
- **Scalable**: Supabase handles all backend infrastructure
- **Secure**: Supabase Storage security rules control access

### Why No Backend Server?

- Supabase Storage allows secure direct uploads from browsers
- Supabase provides built-in authentication and security rules
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
# Deploy to any static hosting platform
```

### Environment Variables

**Required Environment Variables:**

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important Notes:**
- All environment variables must start with `VITE_` for Vite to expose them to the frontend
- Never commit your `.env` file to version control (it's in .gitignore)
- For production deployment, set these variables in your hosting platform's environment settings

## Technical Implementation

### Key Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Recording**: MediaRecorder API, Canvas API
- **Storage**: Supabase Storage (direct upload)
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite

### Security Considerations

- All recording happens client-side
- Videos are uploaded directly to Supabase Storage
- Supabase Storage security rules control access
- Shareable links use unique identifiers
- No sensitive data stored in localStorage

## Limitations & Known Issues

1. **Browser Permissions**: Users must grant screen capture and camera/microphone permissions
2. **File Size**: Large recordings may take time to upload depending on connection speed
3. **Storage Costs**: Supabase has generous free tier limits
4. **Safari Compatibility**: Screen recording is not supported in Safari
5. **Mobile Devices**: Screen recording is not available on mobile browsers

## Supabase Storage Setup

### Bucket Setup

1. **Create Videos Bucket:**
   - Go to your Supabase project dashboard
   - Navigate to Storage
   - Click "Create bucket"
   - Name it "videos"
   - Set it to public for video sharing

2. **Configure Policies (Optional):**
   - Set up Row Level Security policies if needed
   - Configure upload size limits
   - Set up access controls

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