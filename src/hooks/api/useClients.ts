import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Client, ClientFormData } from '@/types/client';

import { useAuth } from '@/hooks/api/useCompany';

export function useClients(companyId: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['clients', companyId, user?.email],
        queryFn: async () => {
            const config = {
                headers: {
                    'X-User-Email': user?.email || ''
                }
            };
            const { data } = await api.get<Client[]>(`/companies/${companyId}/clients`, config);
            return data;
        },
        enabled: !!companyId && !!user?.email,
    });
}

export function useClient(companyId: string, clientId: string) {
    return useQuery({
        queryKey: ['client', companyId, clientId],
        queryFn: async () => {
            // Updated to flat URL
            const { data } = await api.get<Client>(`/clients/${clientId}`);
            return data;
        },
        enabled: !!companyId && !!clientId,
    });
}

export function useCreateClient(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newClient: ClientFormData) => {
            const { data } = await api.post<Client>(`/companies/${companyId}/clients`, newClient);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients', companyId] });
        },
    });
}

export function useDeleteClient(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (clientId: string) => {
            await api.delete(`/companies/${companyId}/clients/${clientId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients', companyId] });
        },
    });
}

export function useUpdateClient(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ clientId, data }: { clientId: string; data: Partial<ClientFormData> }) => {
            const { data: response } = await api.put<Client>(`/companies/${companyId}/clients/${clientId}`, data);
            return response;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['clients', companyId] });
            queryClient.invalidateQueries({ queryKey: ['client', companyId, data.clientId] });
        },
    });
}
