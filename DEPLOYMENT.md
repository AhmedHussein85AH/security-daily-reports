# Deployment Guide

This guide explains how to deploy the Security Daily Reports application to various hosting platforms.

## 🚀 GitHub Pages (Recommended)

### Automatic Deployment (GitHub Actions)
The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source

2. **Push your code**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Your app will be available at**:
   `https://your-username.github.io/security-daily-reports/`

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy the dist folder to GitHub Pages
# (Use GitHub Desktop or upload manually)
```

## 🌐 Netlify

1. **Build your project**:
   ```bash
   npm run build
   ```

2. **Deploy options**:
   - **Drag & Drop**: Drag the `dist` folder to Netlify
   - **Git Integration**: Connect your GitHub repository
   - **CLI**: Use `netlify deploy --dir=dist`

3. **Configuration** (netlify.toml):
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

## ⚡ Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Or connect via GitHub**:
   - Import your repository on Vercel
   - Automatic deployments on every push

## 🔥 Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## 🐳 Docker Deployment

### Create Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and run
```bash
docker build -t security-daily-reports .
docker run -p 80:80 security-daily-reports
```

## 🔧 Environment Configuration

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Environment Variables
Create `.env.production` for production-specific variables:
```env
VITE_APP_TITLE=Security Daily Reports
VITE_APP_VERSION=1.0.0
```

## 📊 Performance Optimization

### Build Optimization
- The project uses Vite for fast builds
- Automatic code splitting
- Tree shaking for smaller bundles
- Image optimization

### Monitoring
- Use browser dev tools to check performance
- Monitor bundle size with `npm run build`
- Check Lighthouse scores

## 🛠️ Troubleshooting

### Common Issues

1. **404 on refresh**:
   - Configure redirects for SPA routing
   - Add `_redirects` file for Netlify

2. **Build failures**:
   - Check Node.js version (requires 16+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

3. **Styling issues**:
   - Ensure Tailwind CSS is properly configured
   - Check for missing dependencies

### Support
- Check [GitHub Issues](https://github.com/your-username/security-daily-reports/issues)
- Contact: [your-email@example.com]

---

**Happy Deploying!** 🚀
