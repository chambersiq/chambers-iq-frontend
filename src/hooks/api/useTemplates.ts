import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Template, TemplateFormData } from '@/types/template';

export function useTemplates(companyId: string) {
    return useQuery({
        queryKey: ['templates', companyId],
        queryFn: async () => {
            const { data } = await api.get<Template[]>(`/companies/${companyId}/templates`);
            return data;
        },
        enabled: !!companyId,
    });
}

export function useTemplate(companyId: string, templateId: string) {
    return useQuery({
        queryKey: ['template', companyId, templateId],
        queryFn: async () => {
            const { data } = await api.get<Template>(`/templates/${templateId}`);
            return data;
        },
        enabled: !!companyId && !!templateId,
    });
}

export function useCreateTemplate(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTemplate: TemplateFormData) => {
            const { data } = await api.post<Template>(`/companies/${companyId}/templates`, newTemplate);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates', companyId] });
        },
    });
}

export function useUploadTemplateSample(companyId: string) {
    return useMutation({
        mutationFn: async ({ generationId, file }: { generationId: string, file: File }) => {
            const formData = new FormData();
            formData.append('file', file);
            // formData.append('generation_id') is query param in route
            const { data } = await api.post<{ status: string, s3Key: string }>(
                `/companies/${companyId}/templates/ai/upload?generation_id=${generationId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            return data;
        },
    });
}

export function useGenerateTemplate(companyId: string) {
    return useMutation({
        mutationFn: async ({ generationId, prompt }: { generationId: string, prompt: string }) => {
            const { data } = await api.post<{ content: string }>(
                `/companies/${companyId}/templates/ai/generate`,
                { generationId, prompt }
            );
            return data;
        },
    });
}

export function useStartWorkflow(companyId: string) {
    return useMutation({
        mutationFn: async (data: { sampleDocs: string[] }) => {
            const { data: response } = await api.post<{ threadId: string, status: string }>(`/ai/workflow/start`, { ...data, companyId });
            return response;
        }
    });
}

export function useGetWorkflowStatus(threadId: string | null) {
    return useQuery({
        queryKey: ['workflow', threadId],
        queryFn: async () => {
            if (!threadId) return null;
            const { data } = await api.get<{
                status: string,
                currentStep: string,
                template?: string,
                attorneyFeedback?: string
            }>(`/ai/workflow/${threadId}`);
            return data;
        },
        enabled: !!threadId,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            if (status === 'awaiting_attorney_review' || status === 'completed') {
                return false;
            }
            return 2000;
        }
    });
}

export function useReviewWorkflow(threadId: string) {
    return useMutation({
        mutationFn: async (data: { approved: boolean, feedback?: string }) => {
            const { data: response } = await api.post(`/ai/workflow/${threadId}/review`, data);
            return response;
        }
    });
}
