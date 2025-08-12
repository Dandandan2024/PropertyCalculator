# Quick Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API and copy your Project URL and anon key

### Step 2: Update Configuration
1. Open `config.js`
2. Replace `YOUR_SUPABASE_URL` with your Project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your anon key

### Step 3: Set Up Database
1. In Supabase dashboard, go to SQL Editor
2. Run this SQL:

```sql
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For demo mode, disable RLS temporarily
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
```

### Step 4: Deploy
Choose one option:

**Option A: Netlify (Easiest)**
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your repo and deploy

**Option B: Local Testing**
```bash
python -m http.server 8000
# Then open http://localhost:8000
```

## ✅ Done!
Your secure notebook app is now running with cloud storage!

---

**Need help?** Check the main [README.md](README.md) for detailed instructions.