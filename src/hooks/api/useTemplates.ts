import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Template, TemplateFormData } from '@/types/template';

export function useTemplates(companyId: string) {
    return useQuery({
        queryKey: ['templates', companyId],
        queryFn: async () => {
            const { data } = await api.get<Template[]>(`/${companyId}/${companyId}/templates`);
            return data;
        },
        enabled: !!companyId,
    });
}

export function useTemplate(companyId: string, templateId: string) {
    return useQuery({
        queryKey: ['template', companyId, templateId],
        queryFn: async () => {
            const { data } = await api.get<Template>(`/${companyId}/${companyId}/templates/${templateId}`);
            return data;
        },
        enabled: !!companyId && !!templateId,
    });
}

export function useCreateTemplate(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTemplate: TemplateFormData) => {
            const { data } = await api.post<Template>(`/${companyId}/${companyId}/templates`, newTemplate);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates', companyId] });
        },
    });
}
