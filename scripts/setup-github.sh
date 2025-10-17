#!/bin/bash

# GitHub Setup Script for Project Name Daily Reports
echo "🚀 Setting up Security Daily Reports for GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Security Daily Reports v1.0.0"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository URL:"
    echo "   git remote add origin https://github.com/your-username/security-daily-reports.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
else
    echo "✅ Remote origin already configured"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your project is ready for GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/your-username/security-daily-reports.git"
    echo "3. Run: git push -u origin main"
    echo "4. Enable GitHub Pages in repository settings"
    echo ""
    echo "Your app will be available at: https://your-username.github.io/security-daily-reports/"
else
    echo "❌ Build failed. Please check for errors."
fi
