# GitHub Upload Guide

## 🚀 Quick Upload Instructions

### Method 1: Using Git Command Line (Recommended)

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Install with default settings
   - Restart your terminal

2. **Open PowerShell/Command Prompt** in your project folder:
   ```bash
   cd "D:\sites\Marassi_Daily_Reports"
   ```

3. **Initialize Git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Security Daily Reports v1.0.0"
   ```

4. **Create GitHub repository**:
   - Go to https://github.com/new
   - Repository name: `security-daily-reports`
   - Make it **Public**
   - Don't initialize with README (you already have one)
   - Click "Create repository"

5. **Connect and upload**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/security-daily-reports.git
   git push -u origin main
   ```

### Method 2: Using GitHub Desktop (Easier)

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Install and sign in**
3. **Create new repository**:
   - File → New Repository
   - Name: `security-daily-reports`
   - Local path: `D:\sites\Marassi_Daily_Reports`
   - Make it public
4. **Publish to GitHub**:
   - Click "Publish repository"
   - Check "Keep this code private" if you want it private
   - Click "Publish Repository"

### Method 3: Manual Web Upload

1. **Create repository on GitHub**:
   - Go to https://github.com/new
   - Name: `security-daily-reports`
   - Make it public
   - Don't add README, .gitignore, or license

2. **Upload files**:
   - Click "uploading an existing file"
   - Select all files from your project folder
   - Add commit message: "Initial commit: Security Daily Reports v1.0.0"
   - Click "Commit changes"

## 🌐 Enable GitHub Pages

After uploading:

1. **Go to repository Settings**
2. **Scroll to "Pages" section**
3. **Source**: Select "GitHub Actions"
4. **Your app will be live at**: `https://YOUR-USERNAME.github.io/security-daily-reports/`

## ✅ Verify Everything Works

1. **Check your repository**: https://github.com/YOUR-USERNAME/security-daily-reports
2. **Check live demo**: https://YOUR-USERNAME.github.io/security-daily-reports/
3. **Test all features**:
   - Create new reports
   - View reports
   - Analytics dashboard
   - Print functionality

## 🆘 Need Help?

- **Git issues**: Check https://git-scm.com/docs
- **GitHub Desktop**: Check https://docs.github.com/en/desktop
- **GitHub Pages**: Check https://pages.github.com/

---

**Happy Uploading!** 🚀
