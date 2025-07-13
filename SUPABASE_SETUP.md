# 🚀 Supabase Setup Guide (100% FREE)

## Why Supabase?
- ✅ **1GB storage FREE** (no credit card required)
- ✅ **Open source** and completely trustworthy
- ✅ **PostgreSQL database** included
- ✅ **Real-time features**
- ✅ **No hidden charges**

## Step-by-Step Setup

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with **GitHub** (recommended) or email
4. **No payment information required!**

### 2. Create New Project
1. Click "New project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Project name**: `rekordr-app` (or any name)
   - **Database password**: Generate a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. **Wait 2-3 minutes** for project setup

### 3. Setup Storage Bucket
1. In your project dashboard, go to **Storage** (left sidebar)
2. Click "Create a new bucket"
3. Bucket details:
   - **Name**: `videos`
   - **Public bucket**: ✅ **Check this box** (for video sharing)
   - **File size limit**: 50MB (or higher if needed)
   - **Allowed MIME types**: `video/*`
4. Click "Create bucket"

### 4. Configure Storage Policies
1. In Storage, click on your `videos` bucket
2. Go to **Policies** tab
3. Click "New policy"
4. **For uploads** (allow anyone to upload):
   ```sql
   -- Policy name: Allow video uploads
   -- Operation: INSERT
   -- Target roles: public
   
   true
   ```
5. Click "Review" → "Save policy"
6. **For downloads** (allow anyone to view):
   ```sql
   -- Policy name: Allow video downloads  
   -- Operation: SELECT
   -- Target roles: public
   
   true
   ```
7. Click "Review" → "Save policy"

### 5. Get Your Credentials
1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 6. Update Your .env File
```env
# Add these to your .env file
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Keep your existing Firebase config (as backup)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
```

### 7. Test Your Setup
```bash
npm run dev
```

1. Go to `/record`
2. Record a video
3. Check if it uploads to Supabase
4. Verify the video plays back

## 🔍 Verify Setup

### Check Storage in Supabase Dashboard:
1. Go to **Storage** → **videos** bucket
2. After recording, you should see `.webm` files
3. Click on a file to get its public URL

### Check Browser Console:
- Should see: `"Using Supabase storage..."`
- If you see: `"Using local storage..."` → Supabase not configured

## 🛠️ Troubleshooting

### "Upload failed" Error:
1. **Check bucket policies** - Make sure both INSERT and SELECT are allowed
2. **Verify bucket is public** - Check the public checkbox
3. **Check file size limits** - Increase if needed
4. **Verify credentials** - Double-check URL and anon key

### Videos Not Loading:
1. **Check bucket policies** - SELECT policy must allow public access
2. **Verify public bucket** - Must be checked during creation
3. **Check browser console** for error messages

### Still Using Local Storage:
1. **Check .env file** - Make sure variables start with `VITE_`
2. **Restart dev server** - `npm run dev`
3. **Check browser console** - Should show "Using Supabase storage..."

## 🎯 Benefits After Setup

- ✅ **Cloud storage** - Videos accessible from anywhere
- ✅ **Real sharing** - Send links to anyone
- ✅ **Automatic backup** - Videos stored safely
- ✅ **Better performance** - Optimized delivery
- ✅ **Scalable** - Handles multiple users

## 🔒 Security Notes

- **Public bucket** is safe for this use case (videos are meant to be shared)
- **anon key** is safe to expose (it's designed for frontend use)
- **RLS policies** control what users can do
- **File size limits** prevent abuse

Your app will automatically use Supabase once configured, with local storage as fallback! 🎥