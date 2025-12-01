import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Client, ClientFormData } from '@/types/client';

export function useClients(companyId: string) {
    return useQuery({
        queryKey: ['clients', companyId],
        queryFn: async () => {
            const { data } = await api.get<Client[]>(`/${companyId}/${companyId}/clients`);
            return data;
        },
        enabled: !!companyId,
    });
}

export function useClient(companyId: string, clientId: string) {
    return useQuery({
        queryKey: ['client', companyId, clientId],
        queryFn: async () => {
            const { data } = await api.get<Client>(`/${companyId}/${companyId}/clients/${clientId}`);
            return data;
        },
        enabled: !!companyId && !!clientId,
    });
}

export function useCreateClient(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newClient: ClientFormData) => {
            const { data } = await api.post<Client>(`/${companyId}/${companyId}/clients`, newClient);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients', companyId] });
        },
    });
}
