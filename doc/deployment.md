# YesraSew Deployment Guide

This guide provides instructions for deploying the YesraSew Marketplace application to Google Cloud Run and Vercel.

## 🔑 Prerequisites: Gemini API Key
This application requires a Google Gemini API Key.
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Generate an API Key.
3. Keep this key ready as you will need to set it as an environment variable named `API_KEY`.

---

## 1. Deploying to Google Cloud Run
Google Cloud Run is ideal for containerized deployment. Since this app uses a "build-less" ESM approach, we will serve it using a lightweight Nginx container.

### A. Create a Dockerfile
Create a file named `Dockerfile` in the project root:

```dockerfile
# Use Nginx to serve static files
FROM nginx:alpine

# Copy all project files to the Nginx html directory
COPY . /usr/share/nginx/html

# Optional: Add custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### B. Build and Deploy via Google Cloud CLI
Run these commands in your terminal:

```bash
# 1. Build the container image
gcloud builds submit --tag gcr.io/[PROJECT_ID]/yesrasew

# 2. Deploy to Cloud Run
gcloud run deploy yesrasew \
  --image gcr.io/[PROJECT_ID]/yesrasew \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars API_KEY=your_gemini_api_key_here
```

---

## 2. Deploying to Vercel (via GitHub)
Vercel is the easiest way to deploy this application with automatic updates whenever you push to GitHub.

### Step 1: Push to GitHub
1. Create a new repository on GitHub.
2. Push your local code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/yesrasew.git
   git push -u origin main
   ```

### Step 2: Connect to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New"** > **"Project"**.
3. Import your `yesrasew` repository.
4. **Configure Project Settings**:
   - **Framework Preset**: Other (or Vite if you eventually add a build step).
   - **Build Command**: Leave empty (this is a static app).
   - **Output Directory**: `.` (Current directory).
5. **Environment Variables**:
   - Add a new variable:
     - **Key**: `API_KEY`
     - **Value**: `[Your Gemini API Key]`
6. Click **Deploy**.

---

## 🛠️ Local Development Reminder
When running locally, ensure you are using a development server that supports ES modules. You can use:
```bash
npx serve .
```
Or, if you are using the AI Studio environment, the environment variables are handled automatically.

## 🛡️ Security Note
Ensure your `API_KEY` is never hardcoded into the source files. Always use environment variables as described in the deployment steps above to keep your credentials safe.