import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Company {
    companyId: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    status: string;
    createdAt?: string;
}

export interface User {
    userId: string;
    companyId: string;
    email: string;
    fullName: string;
    role: string;
}

import { useSession } from 'next-auth/react';

// ... existing imports ...

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

export function useCompany(companyId: string) {
    return useQuery({
        queryKey: ['company', companyId],
        queryFn: async () => {
            const { data } = await api.get<Company>(`/companies/${companyId}`);
            return data;
        },
        enabled: !!companyId,
    });
}

export function useCreateCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCompany: Partial<Company>) => {
            const { data } = await api.post<Company>('/companies', newCompany);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['company', data.companyId], data);
        },
    });
}
