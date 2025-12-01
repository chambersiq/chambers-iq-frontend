# Deploying to Railway

This project is configured for easy deployment on [Railway](https://railway.app).

## Prerequisites

- A GitHub account with access to this repository.
- A Railway account (you can sign up with GitHub).

## Steps

1.  **Login to Railway**: Go to [railway.app](https://railway.app) and log in.
2.  **New Project**: Click the "New Project" button.
3.  **Deploy from GitHub**: Select "Deploy from GitHub repo".
4.  **Select Repository**: Choose `chambersiq/chambers-iq-frontend`.
    - *Note: You may need to grant Railway access to the `chambersiq` organization if you haven't already.*
5.  **Configure**: Railway will automatically detect the `railway.json` file and configure the build/start commands.
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
6.  **Deploy**: Click "Deploy Now".

## Environment Variables

If your application requires environment variables (e.g., API keys, Database URLs), go to the **Variables** tab in your Railway project dashboard and add them there.

## Automatic Deploys

By default, Railway will automatically redeploy your application whenever you push changes to the `main` branch.
