import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Case, CaseFormData } from '@/types/case';

export function useCases(companyId: string, clientId?: string) {
    return useQuery({
        queryKey: ['cases', companyId, clientId],
        queryFn: async () => {
            const url = clientId && clientId !== 'all'
                ? `/clients/${clientId}/cases`
                : `/companies/${companyId}/cases`;
            const { data } = await api.get<Case[]>(url);
            return data;
        },
        enabled: !!companyId,
    });
}

export function useCase(companyId: string, caseId: string) {
    return useQuery({
        queryKey: ['case', companyId, caseId],
        queryFn: async () => {
            // Use the new direct endpoint (Flat URL)
            const { data } = await api.get<Case>(`/cases/${caseId}`);
            return data;
        },
        enabled: !!companyId && !!caseId,
    });
}

export function useCreateCase(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ clientId, data }: { clientId: string, data: CaseFormData }) => {
            const { data: response } = await api.post<Case>(`/clients/${clientId}/cases`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cases', companyId] });
        },
    });
}

export function useUpdateCase(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ clientId, caseId, data }: { clientId: string, caseId: string, data: Partial<CaseFormData> }) => {
            const { data: response } = await api.put<Case>(`/cases/${caseId}`, data);
            return response;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['cases', companyId] });
            queryClient.invalidateQueries({ queryKey: ['case', companyId, data.caseId] });
        },
    });
}

export function useDeleteCase(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ clientId, caseId }: { clientId: string, caseId: string }) => {
            await api.delete(`/cases/${caseId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cases', companyId] });
        },
    });
}
