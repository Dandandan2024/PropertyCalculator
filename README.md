# Secure Notebook App

A modern, secure notebook application that saves your notes to the cloud using Supabase. Built with vanilla JavaScript, HTML, and CSS for a lightweight, fast experience.

## Features

- ✨ **Modern UI**: Beautiful, responsive design with glassmorphism effects
- 🔒 **Secure Storage**: All notes are stored securely in Supabase database
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🔍 **Search Functionality**: Find your notes quickly with real-time search
- ✏️ **Edit & Delete**: Full CRUD operations for your notes
- 🎨 **Beautiful Animations**: Smooth transitions and hover effects
- 📝 **Rich Text Support**: Support for longer notes with proper formatting
- 🔔 **Toast Notifications**: User-friendly feedback for all actions

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (ready for implementation)
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome 6

## Prerequisites

- A Supabase account (free tier available)
- Basic knowledge of HTML/CSS/JavaScript
- A web server or hosting service

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization and enter a project name
4. Set a database password (save this securely)
5. Choose a region close to your users
6. Wait for the project to be created (usually takes 1-2 minutes)

### 2. Set Up the Database

Once your project is created, you'll need to create the notes table:

1. Go to your Supabase dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Run the following SQL command:

```sql
-- Create the notes table
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to only see their own notes
CREATE POLICY "Users can only access their own notes" ON notes
    FOR ALL USING (auth.uid()::text = user_id);

-- For anonymous access (demo mode), you can temporarily disable RLS
-- ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
```

### 3. Get Your Supabase Credentials

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy your "Project URL" and "anon public" key
3. You'll need these for the next step

### 4. Configure the App

1. Open `script.js` in your code editor
2. Find these lines near the top:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

3. Replace the placeholder values with your actual Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 5. Deploy Your App

#### Option A: Deploy to Netlify (Recommended for beginners)

1. Push your code to a GitHub repository
2. Go to [netlify.com](https://netlify.com) and sign up/sign in
3. Click "New site from Git"
4. Choose your repository
5. Deploy settings:
   - Build command: Leave empty (not needed for static sites)
   - Publish directory: Leave as default
6. Click "Deploy site"

#### Option B: Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up/sign in
3. Click "New Project"
4. Import your repository
5. Deploy settings:
   - Framework Preset: Other
   - Build Command: Leave empty
   - Output Directory: Leave as default
6. Click "Deploy"

#### Option C: Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to your repository settings
3. Scroll down to "GitHub Pages" section
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

#### Option D: Use a Local Server (for development)

If you want to test locally:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have it installed)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Security Features

- **Row Level Security (RLS)**: Users can only access their own notes
- **Input Sanitization**: All user inputs are properly escaped to prevent XSS
- **Secure Database**: Supabase provides enterprise-grade security
- **HTTPS Only**: All data transmission is encrypted

## Customization

### Changing Colors

The app uses CSS custom properties for easy color customization. In `styles.css`, you can modify:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #48bb78;
    --danger-color: #f56565;
}
```

### Adding Features

The modular JavaScript structure makes it easy to add new features:

- **Tags**: Add a tags field to the notes table and UI
- **Categories**: Implement note categorization
- **Rich Text**: Integrate a rich text editor like TinyMCE or Quill
- **File Attachments**: Add file upload capabilities
- **Collaboration**: Implement real-time collaboration features

## Troubleshooting

### Common Issues

1. **"Error initializing app"**
   - Check your Supabase URL and API key
   - Ensure your database table is created correctly
   - Check browser console for detailed error messages

2. **"Error loading notes"**
   - Verify your database table structure
   - Check if RLS policies are configured correctly
   - Ensure your user_id field matches the expected format

3. **Notes not saving**
   - Check browser console for errors
   - Verify your Supabase permissions
   - Ensure the notes table has the correct columns

### Debug Mode

To enable debug mode, add this to your browser console:

```javascript
localStorage.setItem('debug', 'true');
```

This will show more detailed error messages and API calls.

## Performance Optimization

- **Lazy Loading**: Notes are loaded on-demand
- **Debounced Search**: Search input is debounced to prevent excessive API calls
- **Efficient Rendering**: Only necessary DOM updates are performed
- **Optimized Queries**: Database queries are optimized with proper indexing

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this application.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you need help:

1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check browser console for error messages
4. Ensure all setup steps are completed correctly

## Future Enhancements

- [ ] User authentication and user management
- [ ] Note sharing and collaboration
- [ ] Rich text editing
- [ ] File attachments
- [ ] Note categories and tags
- [ ] Export functionality (PDF, Markdown)
- [ ] Offline support with service workers
- [ ] Dark mode toggle
- [ ] Note templates
- [ ] Advanced search filters

---

**Happy Note-Taking! 📝✨**