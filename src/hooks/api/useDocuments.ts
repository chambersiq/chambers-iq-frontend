import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Document, DocumentCreate } from '@/types/document';

export function useDocuments(companyId: string, caseId: string) {
    return useQuery({
        queryKey: ['documents', companyId, caseId],
        queryFn: async () => {
            const { data } = await api.get<Document[]>(`/cases/${caseId}/documents`);
            return data;
        },
        enabled: !!companyId && !!caseId,
    });
}

export function useDocument(companyId: string, documentId: string) {
    return useQuery({
        queryKey: ['document', companyId, documentId],
        queryFn: async () => {
            const { data } = await api.get<Document>(`/documents/${documentId}`);
            return data;
        },
        enabled: !!companyId && !!documentId,
    });
}

export function useCreateDocumentUrl(companyId: string) {
    return useMutation({
        mutationFn: async (docData: DocumentCreate) => {
            const { data } = await api.post<{ document: Document, uploadUrl: string }>(`/companies/${companyId}/documents/upload-url`, docData);
            return data;
        },
    });
}

export function useDeleteDocument(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ caseId, documentId }: { caseId: string, documentId: string }) => {
            await api.delete(`/documents/${documentId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] }); // Invalidate list
        }
    });
}
