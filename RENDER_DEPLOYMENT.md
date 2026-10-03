# Deploying AWS Security Dashboard on Render.com 🚀

This guide explains how to deploy your full-stack AWS Security Dashboard (Spring Boot Backend + React Frontend) to **Render.com** using the **Render Blueprint (`render.yaml`)**.

---

## ⚡ Option 1: One-Click Deployment (Recommended)

Since `render.yaml` is pre-configured in this repository, Render can deploy both the backend and frontend automatically.

### Step 1: Push project to GitHub / GitLab
Make sure your project is committed and pushed to a remote git repository (GitHub or GitLab):
```bash
git add .
git commit -m "Add Render deployment setup"
git push origin main
```

### Step 2: Create a New Blueprint on Render
1. Log in to [Render.com Dashboard](https://dashboard.render.com/).
2. Click **New +** at the top right and select **Blueprint**.
3. Connect your GitHub/GitLab account and select your repository (`aws-security-dashboard-starter`).
4. Render will read `render.yaml` and show:
   - 🔹 **Web Service**: `aws-security-dashboard-backend` (Docker container running Spring Boot Java 17)
   - 🔹 **Static Site**: `aws-security-dashboard-frontend` (React + Vite build)
5. Click **Apply**.

Render will automatically build both services and link the frontend to the live backend URL!

---

## 🛠️ Option 2: Manual Deployment on Render

If you prefer to set up each service manually on Render:

### Deploy Backend (Web Service)
1. In Render Dashboard, click **New +** ➔ **Web Service**.
2. Connect your repository.
3. Select **Language / Environment**: `Docker`.
4. Set **Docker Context**: `./backend`
5. Set **Dockerfile Path**: `./backend/Dockerfile`
6. Click **Create Web Service**.
7. Copy your deployed backend URL (e.g. `https://aws-security-dashboard-backend.onrender.com`).

### Deploy Frontend (Static Site)
1. Click **New +** ➔ **Static Site**.
2. Connect your repository.
3. Set **Build Command**: `cd frontend && npm install && npm run build`
4. Set **Publish Directory**: `frontend/dist`
5. Under **Environment Variables**, add:
   - Key: `VITE_API_URL`
   - Value: `https://aws-security-dashboard-backend.onrender.com/api` (replace with your backend URL)
6. Under **Redirects / Rewrites**, add:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
7. Click **Create Static Site**.

---

## 🔍 Verification
- **Backend Health Check**: `https://<your-backend-url>.onrender.com/api/health`
- **Backend Findings API**: `https://<your-backend-url>.onrender.com/api/findings`
- **Frontend Dashboard**: `https://<your-frontend-url>.onrender.com`
