# 🚀 Deployment Guide

## Deploy to Vercel (Recommended)

### Quick Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/rekordr)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

### GitHub Integration

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   - Add your Supabase credentials in the Environment Variables section

4. **Deploy**
   - Click "Deploy"
   - Automatic deployments on every push to main branch

## Other Deployment Options

### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Configure environment variables in Site Settings

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

### Static Hosting
The built files in `dist/` can be served by any static hosting service:
- GitHub Pages
- Surge.sh
- AWS S3
- DigitalOcean Spaces

## Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase bucket is created and public
- [ ] Application loads without errors
- [ ] Recording functionality works
- [ ] Video upload and sharing works
- [ ] All pages are accessible
- [ ] HTTPS is enabled