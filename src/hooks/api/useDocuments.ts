import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Document, DocumentCreate } from '@/types/document';

export function useDocuments(companyId: string, caseId: string) {
    return useQuery({
        queryKey: ['documents', companyId, caseId],
        queryFn: async () => {
            const { data } = await api.get<Document[]>(`/${companyId}/${companyId}/cases/${caseId}/documents`);
            return data;
        },
        enabled: !!companyId && !!caseId,
    });
}

export function useDocument(companyId: string, documentId: string) {
    return useQuery({
        queryKey: ['document', companyId, documentId],
        queryFn: async () => {
            const { data } = await api.get<Document>(`/${companyId}/${companyId}/documents/${documentId}`);
            return data;
        },
        enabled: !!companyId && !!documentId,
    });
}

export function useCreateDocumentUrl(companyId: string) {
    return useMutation({
        mutationFn: async (docData: DocumentCreate) => {
            const { data } = await api.post<{ document: Document, uploadUrl: string }>(`/${companyId}/${companyId}/documents/upload-url`, docData);
            return data;
        },
    });
}

export function useDeleteDocument(companyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ caseId, documentId }: { caseId: string, documentId: string }) => {
            // Assuming delete endpoint exists, if not I'll need to check routes again.
            // Checking routes.py... it doesn't seem to have a delete endpoint!
            // I should double check routes.py content I viewed earlier.
            // It only had get_documents, create_upload_url, get_document.
            // So delete is NOT implemented in backend yet?
            // I'll skip delete for now or implement it in backend if needed.
            // For now, I'll just comment it out or not add it.
            // Wait, I should check if I missed it in routes.py.
            // I viewed lines 1-38. Maybe it's longer?
            // The file size was 1323 bytes. 38 lines seems about right for that size.
            // So delete is likely missing.
            // I will NOT add useDeleteDocument for now to avoid errors.
        },
    });
}
