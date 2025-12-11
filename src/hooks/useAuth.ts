import { useSession } from 'next-auth/react';

// Hook to get the current authenticated user from NextAuth
export function useAuth() {
    const { data: session, status } = useSession();

    return {
        user: {
            userId: session?.user?.userId || '',
            companyId: session?.user?.companyId || '', // This will now come from the DB
            email: session?.user?.email || '',
            fullName: session?.user?.name || '',
            role: session?.user?.role || 'user'
        },
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading'
    };
}
