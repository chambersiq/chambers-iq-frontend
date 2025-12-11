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

// ... existing imports ...

// useAuth has been moved to src/hooks/useAuth.ts


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
