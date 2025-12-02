import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import axios from "axios"

// Define types for session and user
declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null
            email?: string | null
            image?: string | null
            companyId?: string
            userId?: string
            role?: string
        }
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false

            try {
                // Verify user exists in our backend
                // Use internal API URL if running server-side, or public URL
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

                console.log(`[Auth Debug] Checking email: ${user.email} against API: ${apiUrl}`);

                const response = await axios.get(`${apiUrl}/users/check-email`, {
                    params: { email: user.email }
                })

                console.log(`[Auth Debug] API Response Status: ${response.status}`);

                if (response.status === 200 && response.data) {
                    // Attach backend user data to the next-auth user object temporarily
                    // so it can be accessed in the jwt callback
                    (user as any).companyId = response.data.companyId;
                    (user as any).userId = response.data.userId;
                    (user as any).role = response.data.role;
                    console.log(`[Auth Debug] User verified successfully:`, response.data);
                    return true
                }

                console.log(`[Auth Debug] User verification failed. Response data:`, response.data);
                return false
            } catch (error) {
                console.error("[Auth Debug] Login verification error:", error);
                if (axios.isAxiosError(error)) {
                    console.error("[Auth Debug] Axios Error Details:", {
                        message: error.message,
                        code: error.code,
                        response: error.response?.data,
                        status: error.response?.status
                    });
                }
                return false
            }
        },
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.companyId = (user as any).companyId
                token.userId = (user as any).userId
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.companyId = token.companyId as string
                session.user.userId = token.userId as string
                session.user.role = token.role as string
            }
            return session
        },
    },
    pages: {
        signIn: '/', // Custom sign-in page (our landing page)
        error: '/', // Error page
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "temporary-fallback-secret",
}

console.log("Auth Options Loaded. Secret present:", !!process.env.NEXTAUTH_SECRET);
