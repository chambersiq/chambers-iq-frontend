import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors for auth token and context
import { getSession } from "next-auth/react";

api.interceptors.request.use(async (config) => {
    // We use getSession because it works client-side and retrieves the session
    const session = await getSession();

    if (session?.user) {
        if ((session.user as any).companyId) {
            config.headers['X-Company-Id'] = (session.user as any).companyId;
        }
        if (session.user.email) {
            config.headers['X-User-Email'] = session.user.email;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors (e.g., 401 Unauthorized)
        return Promise.reject(error);
    }
);

export default api;
