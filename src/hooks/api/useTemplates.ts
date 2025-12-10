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
