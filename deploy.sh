#!/bin/bash

# Secure Notebook App - Deployment Script
# This script helps you deploy your app to various hosting services

echo "🚀 Secure Notebook App - Deployment Helper"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Secure Notebook App"
    echo "✅ Git repository initialized!"
    echo ""
fi

# Check current git status
echo "📊 Current Git Status:"
git status --short
echo ""

# Show deployment options
echo "🌐 Choose your deployment method:"
echo ""
echo "1. Netlify (Recommended - Easiest)"
echo "2. GitHub Pages (Free)"
echo "3. Render (Great alternative to Vercel)"
echo "4. Cloudflare Pages (Fastest CDN)"
echo "5. Surge.sh (Command line deployment)"
echo "6. Firebase Hosting (Google's platform)"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Deploying to Netlify..."
        echo "1. Push your code to GitHub:"
        echo "   git push origin main"
        echo ""
        echo "2. Go to https://netlify.com"
        echo "3. Click 'New site from Git'"
        echo "4. Choose your repository"
        echo "5. Deploy settings:"
        echo "   - Build command: Leave empty"
        echo "   - Publish directory: Leave as default"
        echo "6. Click 'Deploy site'"
        echo ""
        echo "✅ Your app will be live in minutes!"
        ;;
    2)
        echo ""
        echo "📚 Deploying to GitHub Pages..."
        echo "1. Push your code to GitHub:"
        echo "   git push origin main"
        echo ""
        echo "2. Go to your repository on GitHub"
        echo "3. Click Settings → Pages"
        echo "4. Source: Deploy from a branch"
        echo "5. Branch: main, Folder: / (root)"
        echo "6. Click Save"
        echo ""
        echo "✅ Your site will be at: https://yourusername.github.io/repository-name"
        ;;
    3)
        echo ""
        echo "⚡ Deploying to Render..."
        echo "1. Push your code to GitHub:"
        echo "   git push origin main"
        echo ""
        echo "2. Go to https://render.com"
        echo "3. Click 'New +' → 'Static Site'"
        echo "4. Connect your GitHub repository"
        echo "5. Configure:"
        echo "   - Name: your-notebook-app"
        echo "   - Branch: main"
        echo "   - Build Command: Leave empty"
        echo "   - Publish Directory: Leave as default"
        echo "6. Click 'Create Static Site'"
        echo ""
        echo "✅ Your app will be live with global CDN!"
        ;;
    4)
        echo ""
        echo "🚀 Deploying to Cloudflare Pages..."
        echo "1. Push your code to GitHub:"
        echo "   git push origin main"
        echo ""
        echo "2. Go to https://pages.cloudflare.com"
        echo "3. Click 'Create a project'"
        echo "4. Connect your GitHub repository"
        echo "5. Build settings:"
        echo "   - Framework preset: None"
        echo "   - Build command: Leave empty"
        echo "   - Build output directory: Leave as default"
        echo "6. Click 'Save and Deploy'"
        echo ""
        echo "✅ Your app will be live with the fastest CDN!"
        ;;
    5)
        echo ""
        echo "⚡ Deploying to Surge.sh..."
        echo "1. Install Surge globally:"
        echo "   npm install -g surge"
        echo ""
        echo "2. Deploy your app:"
        echo "   surge"
        echo ""
        echo "3. Follow the prompts to create an account"
        echo "4. Your site will be at: https://your-project-name.surge.sh"
        echo ""
        echo "✅ Command line deployment complete!"
        ;;
    6)
        echo ""
        echo "🔥 Deploying to Firebase Hosting..."
        echo "1. Install Firebase CLI:"
        echo "   npm install -g firebase-tools"
        echo ""
        echo "2. Login to Firebase:"
        echo "   firebase login"
        echo ""
        echo "3. Initialize Firebase:"
        echo "   firebase init hosting"
        echo ""
        echo "4. Deploy:"
        echo "   firebase deploy"
        echo ""
        echo "✅ Your app will be live on Firebase!"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🔧 Before deploying, make sure you have:"
echo "1. ✅ Updated config.js with your Supabase credentials"
echo "2. ✅ Set up your Supabase database table"
echo "3. ✅ Pushed your code to GitHub"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo "🎉 Happy deploying!"