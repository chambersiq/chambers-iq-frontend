import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Draft } from '@/types/draft';

export function useDrafts(companyId: string, caseId?: string) {
    return useQuery({
        queryKey: ['drafts', companyId, caseId],
        queryFn: async () => {
            // If caseId is provided, use the case-specific endpoint
            const url = caseId
                ? `/${companyId}/cases/${caseId}/drafts`
                : `/${companyId}/drafts`;

            const { data } = await api.get<Draft[]>(url);
            return data;
        },
        enabled: !!companyId,
    });
}

export function useDraft(companyId: string, draftId: string) {
    return useQuery({
        queryKey: ['draft', companyId, draftId],
        queryFn: async () => {
            const { data } = await api.get<Draft>(`/${companyId}/drafts/${draftId}`);
            return data;
        },
        enabled: !!companyId && !!draftId,
    });
}

export function useCreateDraft(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ caseId, data }: { caseId: string, data: Partial<Draft> }) => {
            const { data: response } = await api.post<Draft>(`/${companyId}/cases/${caseId}/drafts`, data);
            return response;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['drafts', companyId] });
            if (data.caseId) {
                queryClient.invalidateQueries({ queryKey: ['drafts', companyId, data.caseId] });
            }
        },
    });
}

export function useUpdateDraft(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ draftId, data }: { draftId: string, data: Partial<Draft> }) => {
            const { data: response } = await api.put<Draft>(`/${companyId}/drafts/${draftId}`, data);
            return response;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['draft', companyId, data.draftId] });
            queryClient.invalidateQueries({ queryKey: ['drafts', companyId] });
        },
    });
}

export function useDeleteDraft(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (draftId: string) => {
            await api.delete(`/${companyId}/drafts/${draftId}`);
        },
        onSuccess: () => {
            // Invalidate all drafts queries for this company (exact: false matches partial keys)
            queryClient.invalidateQueries({
                queryKey: ['drafts', companyId],
                exact: false
            });
        },
    });
}

export function useGenerateAITemplate() {
    return useMutation({
        mutationFn: async (data: { caseId: string; documentType: string }) => {
            // Convert camelCase to snake_case for backend
            const requestData = {
                case_id: data.caseId,
                document_type: data.documentType
            };
            const { data: response } = await api.post('/generate-ai-template', requestData);
            return response;
        },
    });
}
